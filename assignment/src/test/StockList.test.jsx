/* eslint-disable no-undef */
import { render, screen, waitFor, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import StockList from "../components/StockList.jsx";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockStockData = {
  instruments: [
    {
      isin: "12345",
      name: "Test Stock 📈",
      currentPrice: { value: 105 },
      closePrice: { value: 98 },
      openPrice: { value: 95 },
    },
    {
      isin: "67890",
      name: "Another Stock",
      currentPrice: { value: 200 },
      closePrice: { value: 205 },
      openPrice: { value: 195 },
    },
  ],
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockStockData),
    })
  );
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("StockList Component", () => {
  test("renders loading state initially", () => {
    render(
      <BrowserRouter>
        <StockList />
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading data/i)).toBeInTheDocument();
  });

  test("displays an error message if the fetch fails", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Fetch error")));

    render(
      <BrowserRouter>
        <StockList />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/Error: Fetch error/i)).toBeInTheDocument()
    );
  });

  test("calculates and displays previousPrice and priceChange correctly", async () => {
    render(
      <BrowserRouter>
        <StockList />
      </BrowserRouter>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getAllByRole("row").length).toBeGreaterThan(1)
    );
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(3);
    const firstRow = rows[1];
    expect(within(firstRow).getByText("Test Stock 📈")).toBeInTheDocument();
    const priceCells = screen.getAllByText("105");
    expect(priceCells.length).toBeGreaterThanOrEqual(2);
    expect(within(firstRow).getByText("98")).toBeInTheDocument();
    expect(within(firstRow).getByText("95")).toBeInTheDocument();
  });

  test("handles HTTP error response", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    render(<StockList />);

    await waitFor(() =>
      expect(screen.getByText(/Error: HTTP error!/)).toBeInTheDocument()
    );
  });

  test("handles invalid data format", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<StockList />);

    await waitFor(() =>
      expect(
        screen.getByText(/Error: Invalid data format: 'instruments' missing/)
      ).toBeInTheDocument()
    );
  });
});
