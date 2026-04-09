import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { SYFOVEILEDER_ROOT } from "@/apiConstants";
import { VEILEDER_DEFAULT } from "@/mocks/common/mockConstants";

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

export const mockServer = setupServer(
  http.get(`*${SYFOVEILEDER_ROOT}/veiledere/self`, () =>
    HttpResponse.json(VEILEDER_DEFAULT)
  ),
  // Catch-all: intercept every unhandled request and return 500 instead of
  // letting jsdom open a real TCP socket. Without this, failed connections
  // trigger a native libuv assertion (uv__stream_destroy) that hard-crashes
  // the Vitest worker process with ERR_IPC_CHANNEL_CLOSED.
  // Specific handlers added via mockServer.use() take priority over this.
  http.all("*", () => new HttpResponse(null, { status: 500 }))
);

// Start server before all tests
beforeAll(() => mockServer.listen({ onUnhandledRequest: "warn" }));

//  Close server after all tests
afterAll(() => mockServer.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => mockServer.resetHandlers());
