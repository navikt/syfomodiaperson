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

vi.mock("@amplitude/analytics-browser", () => ({
  track: vi.fn(),
  init: vi.fn(),
}));

export const mockServer = setupServer(
  http.get(`*${SYFOVEILEDER_ROOT}/veiledere/self`, () =>
    HttpResponse.json(VEILEDER_DEFAULT)
  )
);

// Start server before all tests
beforeAll(() => mockServer.listen({ onUnhandledRequest: "warn" }));

//  Close server after all tests
afterAll(() => mockServer.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => mockServer.resetHandlers());
