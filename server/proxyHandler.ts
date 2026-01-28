import { Request, Response } from "express";
import { Readable } from "stream";

const PROXY_TIMEOUT_MS = 30000;

const FORWARDED_REQUEST_HEADERS = [
  "content-type",
  "nav-personident",
  "nav-call-id",
  "nav-consumer-id",
  "fnr",
] as const;

const FORWARDED_RESPONSE_HEADERS = [
  "content-type",
  "content-length",
  "cache-control",
] as const;

export interface ProxyConfig {
  host: string;
  applicationName: string;
  removePathPrefix?: boolean;
  accessToken?: string;
  rewritePath?: (path: string) => string;
  additionalHeaders?: Record<string, string>;
}

function buildTargetUrl(req: Request, config: ProxyConfig): string {
  const hostUrl = new URL(config.host);
  const hostPath = hostUrl.pathname === "/" ? "" : hostUrl.pathname;

  const requestUrl = new URL(req.originalUrl, `http://${req.headers.host}`);
  const requestPath = requestUrl.pathname;
  const queryString = requestUrl.search;

  let targetPath = hostPath + requestPath;

  if (config.removePathPrefix) {
    targetPath = targetPath.replace(`${config.applicationName}/`, "");
  }

  if (config.rewritePath) {
    targetPath = config.rewritePath(targetPath);
  }

  return `${hostUrl.origin}${targetPath}${queryString}`;
}

function buildRequestHeaders(
  req: Request,
  config: ProxyConfig
): Record<string, string> {
  const headers: Record<string, string> = {};

  for (const headerName of FORWARDED_REQUEST_HEADERS) {
    const value = req.headers[headerName];
    if (typeof value === "string") {
      headers[headerName] = value;
    }
  }

  if (config.accessToken) {
    headers["Authorization"] = `Bearer ${config.accessToken}`;
  }

  if (config.additionalHeaders) {
    Object.assign(headers, config.additionalHeaders);
  }
  return headers;
}

function getRequestBody(
  req: Request
): ReadableStream<Uint8Array> | null | string {
  if (req.method === "GET" || req.method === "HEAD") {
    return null;
  }

  // If body has already been parsed by express.json(), use it directly
  if (req.body && Object.keys(req.body).length > 0) {
    return JSON.stringify(req.body);
  }

  // Stream the raw request body
  return Readable.toWeb(req) as ReadableStream<Uint8Array>;
}

export async function proxyRequest(
  req: Request,
  res: Response,
  config: ProxyConfig
): Promise<void> {
  const targetUrl = buildTargetUrl(req, config);
  const abortController = new AbortController();

  // Abort upstream request if client disconnects
  const onClientClose = () => {
    abortController.abort();
  };
  req.on("close", onClientClose);

  // Set up timeout
  const timeoutId = setTimeout(() => {
    abortController.abort();
  }, PROXY_TIMEOUT_MS);

  try {
    const requestHeaders = buildRequestHeaders(req, config);
    const requestBody = getRequestBody(req);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: requestHeaders,
      body: requestBody,
      signal: abortController.signal,
      // @ts-expect-error - duplex is required for streaming request bodies in Node.js
      duplex: requestBody instanceof ReadableStream ? "half" : undefined,
    });

    clearTimeout(timeoutId);

    res.status(response.status);

    for (const headerName of FORWARDED_RESPONSE_HEADERS) {
      const value = response.headers.get(headerName);
      if (value) {
        res.setHeader(headerName, value);
      }
    }

    // Stream response body back to client
    if (response.body) {
      const reader = response.body.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // Check if client is still connected before writing
          if (res.writableEnded) {
            reader.cancel();
            break;
          }

          res.write(value);
        }
      } finally {
        reader.releaseLock();
      }
    }

    res.end();
  } catch (error) {
    clearTimeout(timeoutId);

    // Don't send error response if client already disconnected
    if (res.writableEnded) {
      return;
    }

    if (error instanceof Error) {
      // Handle abort (timeout or client disconnect)
      if (error.name === "AbortError") {
        if (!req.closed) {
          // Timeout occurred
          console.error(`Proxy timeout for ${targetUrl}`);
          res.status(504).json({ message: "Gateway timeout" });
        }
        // Client disconnected - don't send response
        return;
      }

      // Handle connection refused
      if ("cause" in error && isConnectionRefused(error.cause)) {
        console.error(
          `Proxy connection refused for ${config.host}: ${error.message}`
        );
        res.status(503).json({ message: `Could not contact ${config.host}` });
        return;
      }

      console.error(`Proxy error for ${targetUrl}: ${error.message}`);
      res.status(502).json({ message: "Bad gateway" });
    } else {
      console.error(`Proxy unknown error for ${targetUrl}:`, error);
      res.status(500).json({ message: "Internal server error" });
    }
  } finally {
    req.off("close", onClientClose);
  }
}

function isConnectionRefused(cause: unknown): boolean {
  if (cause && typeof cause === "object" && "code" in cause) {
    return cause.code === "ECONNREFUSED";
  }
  return false;
}
