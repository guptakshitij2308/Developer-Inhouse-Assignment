const express = require("express");
const https = require("https");

const app = express();

const port = process.env.PORT || 3000;
const apiKey = "9f57a86d5eb6b9e587bd8b4919a8c6db";

app.get("/", (req, res) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=gwalior&appid=9f57a86d5eb6b9e587bd8b4919a8c6db`;
  https.get(url, (response) => {
    response.on("data", (data) => {
      const weatherData = JSON.parse(data);

      res.send(weatherData).status(200);
    });
  });
});

app.get("/weather", (req, res) => {
  const location = req.query.location;
  let units = req.query.units;
  if (!location) {
    return res.status(400).json({ error: "Location parameter is missing" });
  }
  if (!units) {
    units = "metric";
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&appid=${apiKey}`;

  apiUrl.replace("{city}", location);

  const request = https.get(apiUrl, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      const weatherData = JSON.parse(data);
      if (response.statusCode === 200) {
        const dataRet = {
          weather_description: weatherData.weather[0].description,
          temperature: {
            "current temperature": weatherData.main.temp,
            "feels like": weatherData.main.feels_like,
          },
          wind: weatherData.wind,
          "weather conditions": weatherData.weather,
        };
        // res.json(weatherData);
        res.json(dataRet);
      } else {
        res.status(response.statusCode).json({ error: weatherData.message });
      }
    });
  });

  request.on("error", (error) => {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  });
});

app.listen(3000, () => {
  console.log(`Server running on port ${port}`);
});

// 9f57a86d5eb6b9e587bd8b4919a8c6db
