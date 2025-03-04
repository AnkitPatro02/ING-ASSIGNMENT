/* eslint-disable react/display-name */
/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import App from "../App.jsx";

jest.mock("../components/StockList", () => () => (
  <div data-testid="stock-list">Stock List</div>
));
jest.mock("../components/StockDetails", () => () => (
  <div data-testid="stock-details">Stock Details</div>
));

describe("App Component", () => {
  test("should render heading and default StockList component", () => {
    render(<App />);

    expect(
      screen.getByText(/Stock Difference List from data/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId("stock-list")).toBeInTheDocument();
  });
});
