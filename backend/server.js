const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());

app.get("/data", async (req, res) => {
  try {
    const response = await fetch(
      "https://www.ing.nl/api/securities/web/markets/stockmarkets/AEX"
    );
    if (!response.ok) {
      throw new Error(`HTTP Error. Status: ${response.status}`);
    }
    const textData = await response.text();

    const cleanJsonText = textData.replace(")]}',", "");
    const jsonData = JSON.parse(cleanJsonText);
    res.json(jsonData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
