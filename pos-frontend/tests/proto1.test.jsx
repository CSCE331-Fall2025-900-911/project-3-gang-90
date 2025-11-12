import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../src/components/Home";
import { MemoryRouter } from "react-router-dom";

vi.mock("../src/components/CartContext", () => ({
  useCart: () => ({ items: [] })
}));

test("renders the Drinks link on the Home page", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(screen.getByText("Drinks")).toBeInTheDocument();
});