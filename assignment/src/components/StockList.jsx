import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StockList.css";

const API_URL = "http://localhost:4000/data";

function StockList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previousPrices, setPreviousPrices] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        if (!jsonData || !jsonData.instruments) {
          throw new Error("Invalid data format: 'instruments' missing");
        }

        const allData = jsonData.instruments;

        setPreviousPrices((prevPrices) => {
          const newPrices = {};
          allData.forEach((stock) => {
            if (stock.currentPrice && stock.currentPrice.value !== undefined) {
              newPrices[stock.isin] =
                prevPrices[stock.isin] ?? stock.currentPrice.value;
            }
          });
          return newPrices;
        });

        setData(allData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <table className="stocks">
        <thead className="header">
          <tr>
            <td>Stock Name</td>
            <td>Stock Current Price</td>
            <td>Stock Previous Price</td>
            <td>Stock Closing Price</td>
            <td>Stock Opening Price</td>
          </tr>
        </thead>
        <tbody>
          {data.map((stock) => {
            const previousPrice =
              previousPrices[stock.isin] || stock.currentPrice.value;
            const currentPrice = stock.currentPrice.value;
            const priceChange = currentPrice - previousPrice;
            return (
              <tr
                key={stock.isin}
                onClick={() =>
                  navigate(`/stock/${stock.isin}`, { state: { stock } })
                }
              >
                <td>
                  {stock.name}{" "}
                  {priceChange > 0 ? "📈" : priceChange < 0 ? "📉" : ""}
                </td>
                <td
                  style={{
                    backgroundColor:
                      priceChange > 0
                        ? "lightgreen"
                        : priceChange < 0
                        ? "lightcoral"
                        : ""
                  }}
                >
                  {currentPrice}
                </td>
                <td>{previousPrice}</td>
                <td>{stock.closePrice.value}</td>
                <td>{stock.openPrice.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StockList;
