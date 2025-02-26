import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StockDetails from "./components/StockDetails";
import StockList from "./components/StockList";

function App() {
  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>
        Stock List from data.json
      </h1>
      <Router>
        <Routes>
          <Route path="/" element={<StockList />} />
          <Route path="/stock/:isin" element={<StockDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
