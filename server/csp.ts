import express from "express";
import { logger } from "@navikt/pino-logger";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getDirective(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const directive = value.split(/[;\s]/, 1)[0].toLowerCase();
  return /^[a-z-]{1,64}$/.test(directive) ? directive : undefined;
}

function getBlockedOrigin(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  if (["inline", "eval", "wasm-eval", "data"].includes(value)) {
    return value;
  }
  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

function getCspReports(body: unknown): unknown[] {
  if (Array.isArray(body)) {
    return body.flatMap((item) =>
      isRecord(item) && item.type === "csp-violation" ? [item.body] : [],
    );
  }
  if (isRecord(body) && "csp-report" in body) {
    return [body["csp-report"]];
  }
  if (isRecord(body) && body.type === "csp-violation") {
    return [body.body];
  }
  return [body];
}

function logCspViolation(report: unknown): void {
  if (!isRecord(report)) {
    return;
  }
  const effectiveDirective = getDirective(
    report["effective-directive"] ?? report.effectiveDirective,
  );
  const violatedDirective = getDirective(
    report["violated-directive"] ?? report.violatedDirective,
  );
  const blockedOrigin = getBlockedOrigin(
    report["blocked-uri"] ?? report.blockedURL,
  );
  const disposition = report.disposition;
  const statusCode = report["status-code"] ?? report.statusCode;

  logger.warn(
    {
      cspViolation: {
        effectiveDirective,
        violatedDirective,
        blockedOrigin,
        disposition:
          disposition === "enforce" || disposition === "report"
            ? disposition
            : undefined,
        statusCode:
          typeof statusCode === "number" &&
          Number.isInteger(statusCode) &&
          statusCode >= 0
            ? statusCode
            : undefined,
      },
    },
    "CSP violation reported",
  );
}

/** Registers CSP reporting headers and the sanitized violation-report endpoint. */
export function setupCspReporting(server: express.Express): void {
  server.use((_req, res, next) => {
    res.setHeader("Reporting-Endpoints", 'csp-endpoint="/csp-report"');
    next();
  });
  server.post(
    "/csp-report",
    express.json({
      type: [
        "application/json",
        "application/csp-report",
        "application/reports+json",
      ],
      limit: "32kb",
    }),
    (req: express.Request, res: express.Response) => {
      for (const report of getCspReports(req.body)) {
        logCspViolation(report);
      }
      res.status(204).end();
    },
  );
}
