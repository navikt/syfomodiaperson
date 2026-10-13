import { render } from "@testing-library/react";
import {
  MemoryRouter,
  type MemoryRouterProps,
  Route,
  Routes,
} from "react-router-dom";
import { ReactNode } from "react";

export const memoryRouterFutureConfig = {
  v7_relativeSplatPath: true,
  v7_startTransition: true,
} as const;

export const renderWithRouter = (
  element: ReactNode,
  path: string,
  initialEntries?: MemoryRouterProps["initialEntries"],
) => {
  render(
    <MemoryRouter
      initialEntries={initialEntries}
      future={memoryRouterFutureConfig}
    >
      <Routes>
        <Route path={path} element={element} />
      </Routes>
    </MemoryRouter>,
  );
};
