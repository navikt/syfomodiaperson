import { vi } from "vitest";

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal("ResizeObserver", ResizeObserverMock);
vi.stubGlobal("XMLHttpRequest", vi.fn());

vi.mock("@amplitude/analytics-browser", () => ({
  track: vi.fn(),
  init: vi.fn(),
}));
