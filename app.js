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

app.get("/weather/city", (req, res) => {
  const location = req.query.location;
  let units = req.query.units;
  if (!location) {
    return res
      .status(400)
      .json({ error: "City whose weather info is needed is missing" });
  }
  if (!units) {
    units = "metric";
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&appid=${apiKey}`;

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

// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

app.get("/weather/coordinates", (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;
  let units = req.query.units;
  if (!lat || !lon) {
    return res.status(400).json({
      error: "Location parameters (latitude or longitude) is missing",
    });
  }
  if (!units) {
    units = "metric";
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=3&units=${units}&appid=${apiKey}`;

  const request = https.get(apiUrl, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      const weatherData = JSON.parse(data);
      if (response.statusCode === 200) {
        const dataRet = {
          Location: {
            "City Name": weatherData.city.name,
            "Country Name": weatherData.city.country,
          },
          days: {
            "Day 1": {
              tempertaure: weatherData.list[0].main,
              weather: weatherData.list[0].weather,
            },
            "Day 2": {
              tempertaure: weatherData.list[1].main,
              weather: weatherData.list[1].weather,
            },
            "Day 3": {
              tempertaure: weatherData.list[2].main,
              weather: weatherData.list[2].weather,
            },
          },
        };
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
