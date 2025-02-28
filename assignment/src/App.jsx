import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StockDetails from "./components/StockDetails";
import StockList from "./components/StockList";
import "./App.css";

function App() {
  return (
    <div>
      <h1 className="heading">Stock Difference List from data</h1>
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
