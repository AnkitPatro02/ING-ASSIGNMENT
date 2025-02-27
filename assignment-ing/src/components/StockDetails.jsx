import "./StockDetails.css";
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

// const API_URL = "http://localhost:4000/data"; 

const StockDetails = () => {
  const { isin } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [stock, setStock] = useState(location.state?.stock || null);

  const fetchDetails = () => {
    fetch("http://localhost:4000/data")
      .then((response) => response.json())
      .then((data) => {
        const foundStock = data.instruments.find((s) => s.isin === isin);
        setStock(foundStock || {});
      })
      .catch((err) => console.error("Error fetching stock data:", err));
  };
  useEffect(() => {
    if (!stock) {
      fetchDetails();
    }
    const interval = setInterval(fetchDetails, 5000);

    return () => clearInterval(interval);
  }, [isin]);

  if (!stock) return <div>Loading stock details...</div>;

  return (
    <div className="details">
      <button onClick={() => navigate("/")}>Back</button>
      <div className="detail">
        <p>
          Stock Name:<span> {stock.name}</span>
        </p>
        <p>Symbol: {stock.symbol}</p>
        <p>Exchange: {stock.exchange}</p>
      </div>
      <div className="detail">
        <p>
          Current Price: {stock.currentPrice.value} {stock.currency}
        </p>

        <p>
          High Price: {stock.highPrice.value} {stock.currency}
        </p>
        <p>
          Low Price: {stock.lowPrice.value} {stock.currency}
        </p>
      </div>
      <div className="detail">
        <p>
          Open Price: {stock.openPrice.value} {stock.currency}
        </p>
        <p>Price Mutation: {stock.priceMutation}</p>
        <p>Last Updated: {new Date(stock.time).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default StockDetails;
