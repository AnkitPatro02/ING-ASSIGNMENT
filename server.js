const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());

// let data = [];
// try {
//   const dataFile = fs.readFileSync("data.json", "utf8");
//   data = JSON.parse(dataFile);
// } catch (err) {
//   console.error("Error reading data.json:", err);
// }
// app.get("/api/data", (req, res) => {
//   res.json(data); // Send the data as JSON
// });
const API_URL =
  "https://www.ing.nl/api/securities/web/markets/stockmarkets/AEX";

app.get("/data", async (req, res) => {
  console.log("Received request");

  try {
    const response = await fetch(
      "https://www.ing.nl/api/securities/web/markets/stockmarkets/AEX"
    );
    console.log("Response received");
    if (!response.ok) {
      throw new Error(`HTTP Error. Status: ${response.status}`);
    }
    const textData = await response.text();
    console.log("Raw response text sample:", textData.slice(0, 100));
    const lines = textData.split("\n");
    if (lines.length < 2) {
      throw new Error("Unexpected API response format");
    }
    const cleanJsonText = lines.slice(1).join("\n");
    console.log("Cleaned JSON text");
    const jsonData = JSON.parse(cleanJsonText);
    console.log("Data parsed successfully");
    console.log("---------------");
    res.json(jsonData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
