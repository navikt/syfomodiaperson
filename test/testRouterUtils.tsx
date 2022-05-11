import React from "react";
import { InitialEntry } from "history";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

export const renderWithRouter = (
  element: React.ReactNode,
  path: string,
  initialEntries?: InitialEntry[]
) => {
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path={path} element={element} />
      </Routes>
    </MemoryRouter>
  );
};
