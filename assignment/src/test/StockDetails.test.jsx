/* eslint-disable no-undef */
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import StockDetails from "../components/StockDetails.jsx";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

const mockUseParams = require("react-router-dom").useParams;
const mockUseLocation = require("react-router-dom").useLocation;

describe("StockDetails Component", () => {
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            instruments: [
              {
                isin: "12345",
                name: "Test Stock",
                symbol: "TSTK",
                exchange: "NYSE",
                currentPrice: { value: 100 },
                highPrice: { value: 110 },
                lowPrice: { value: 90 },
                openPrice: { value: 95 },
                priceMutation: 1.5,
                currency: "USD",
                time: Date.now(),
              },
            ],
          }),
      })
    );
  });

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  test("should render loading state when stock data is not available", () => {
    mockUseParams.mockReturnValue({ isin: "12345" });
    mockUseLocation.mockReturnValue({ state: null });

    render(
      <BrowserRouter>
        <StockDetails />
      </BrowserRouter>
    );

    expect(screen.getByText("Loading stock details...")).toBeInTheDocument();
  });

  test("should render stock details correctly when data is available in location state", async () => {
    const mockStock = {
      name: "Test Stock",
      symbol: "TSTK",
      exchange: "NYSE",
      currentPrice: { value: 100 },
      highPrice: { value: 110 },
      lowPrice: { value: 90 },
      openPrice: { value: 95 },
      priceMutation: 1.5,
      currency: "USD",
      time: Date.now(),
    };

    mockUseParams.mockReturnValue({ isin: "12345" });
    mockUseLocation.mockReturnValue({ state: { stock: mockStock } });

    render(
      <BrowserRouter>
        <StockDetails />
      </BrowserRouter>
    );

    expect(screen.getByText(/Stock Name:/)).toHaveTextContent(mockStock.name);
    expect(screen.getByText(/Symbol:/)).toHaveTextContent(mockStock.symbol);
    expect(screen.getByText(/Exchange:/)).toHaveTextContent(mockStock.exchange);
    expect(screen.getByText(/Current Price:/)).toHaveTextContent("100 USD");
    expect(screen.getByText(/Price Mutation:/)).toHaveTextContent("1.50");
  });

  test("should fetch stock details when location state is null", async () => {
    mockUseParams.mockReturnValue({ isin: "12345" });
    mockUseLocation.mockReturnValue({ state: null });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            instruments: [
              {
                isin: "12345",
                name: "Test Stock",
                symbol: "TSTK",
                exchange: "NYSE",
                currentPrice: { value: 100 },
                highPrice: { value: 110 },
                lowPrice: { value: 90 },
                openPrice: { value: 95 },
                priceMutation: 1.5,
                currency: "USD",
                time: Date.now(),
              },
            ],
          }),
      })
    );
    render(
      <BrowserRouter>
        <StockDetails />
      </BrowserRouter>
    );
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/Stock Name:/)).toHaveTextContent("Test Stock");
  });

  test("if back button is present", async () => {
    render(
      <BrowserRouter>
        <StockDetails />
      </BrowserRouter>
    );
    const backButton = await waitFor(() =>
      screen.getByRole("button", { name: /back/i })
    );
    expect(backButton).toBeInTheDocument();
  });
});
