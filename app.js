const express = require("express");
const https = require("https");

const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=gwalior&appid=9f57a86d5eb6b9e587bd8b4919a8c6db`;
  https.get(url, (response) => {
    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      // console.log(weatherData);
      res.send(weatherData).status(200);
    });
  });
});

app.listen(3000, () => {
  console.log(`Server running on port ${port}`);
});

// 9f57a86d5eb6b9e587bd8b4919a8c6db
