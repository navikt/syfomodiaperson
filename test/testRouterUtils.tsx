import React from "react";
import { render } from "@testing-library/react";
import {
  MemoryRouter,
  type MemoryRouterProps,
  Route,
  Routes,
} from "react-router-dom";

export const renderWithRouter = (
  element: React.ReactNode,
  path: string,
  initialEntries?: MemoryRouterProps["initialEntries"],
) => {
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path={path} element={element} />
      </Routes>
    </MemoryRouter>,
  );
};
