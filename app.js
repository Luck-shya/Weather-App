const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
require("dotenv").config();

app.post("/", function (req, res) {
  const unit = "metric";
  const query = req.body.cityName;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    process.env.API_KEY +
    "&units=" +
    unit;

  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDesc = weatherData.weather[0].description;

      res.writeHead(200, { "Content-Type": "text/html" });
      const icon = weatherData.weather[0].icon;
      const imageurl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Weather App</title>
          <!-- Bootstrap CSS -->
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
          @import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
            body {
              font-family: "Poppins";
              width: 100%;
            }
            /* For laptop screens */
            h1 {
              font-size: 2rem;
            }
        
          </style>
        </head>
        <body class="d-flex justify-content-center align-items-center vh-100">
          <div class="text-center">
            <h1>The Weather is currently ${weatherDesc} in ${query.charAt(0).toUpperCase() + query.slice(1).toLowerCase()}</h1>
            <h1>The Temperature in ${
              query.charAt(0).toUpperCase() + query.slice(1).toLowerCase()
            } is ${temp} Degree Celsius</h1>
            <img style="width: 200px; background-color:"#f5f5f5"; border-radius:100px;  src="${imageurl}">
            <button class="btn btn-success w-100 mt-3" onclick="history.back(-1)">Go Back</button>
          </div>
          <!-- Bootstrap JS bundle -->
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
      `);

      res.end();
    });
  });
});

app.listen(process.env.PORT, function () {
  console.log(`Server running on port ${process.env.PORT}`);
});
