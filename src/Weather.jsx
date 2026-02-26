import React, { useEffect, useState } from 'react'
import './App.css'
import searchIcon from './assets/images/searchIcon.jpg';
import cloudIcon from './assets/images/cloud.jpg';
import drizzleIcon from './assets/images/drizzleIcon.jpg';
import rainIcon from './assets/images/rainIcon.jpg';
import snowIcon from './assets/images/snowIcon.jpg';
import humanity from './assets/images/humanity.jpg';
import windSpeed from './assets/images/windSpeed.jpg';
import clearIcon from './assets/images/ClearIcon.jpg';

const WeatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="weather" />
      </div>
      <div className="temp">{temp}°C </div>
      <div className="city">{city}</div>
      <div className="country">{country}</div>

      <div className="cord">
        <div>
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">longitude</span>
          <span>{log}</span>
        </div>
      </div>

      <div className="data-container">
        <div className="element">
          <img src={humanity} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percentage">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>

        <div className="element">
          <img src={windSpeed} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percentage">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function Weather() {
  let api_key = "c616facf70a2a1f17d0b96125429ca5f";

  const [icon, setIcon] = useState(cloudIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('IND');
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [text, setText] = useState("Chennai");
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // include ALL OpenWeather icons
  const weatherIconMap = {
    "01d": clearIcon, "01n": clearIcon, // clear
    "02d": cloudIcon, "02n": cloudIcon, // few clouds
    "03d": cloudIcon, "03n": cloudIcon, // scattered clouds
    "04d": drizzleIcon, "04n": drizzleIcon, // broken clouds
    "09d": rainIcon, "09n": rainIcon, // shower rain
    "10d": rainIcon, "10n": rainIcon, // rain
    "11d": rainIcon, "11n": rainIcon, // thunderstorm
    "13d": snowIcon, "13n": snowIcon, // snow
    "50d": cloudIcon, "50n": cloudIcon, // mist/fog
  };

  const search = async () => {
    setLoading(true);
    setError(null);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();

      if (data.cod === "404" || data.cod === 404) {
        console.error("City Not Found");
        setCityNotFound(true);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(Math.round(data.wind.speed * 3.6)); // convert m/s → km/h
      setTemp(Math.round(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || cloudIcon); // fallback to cloud

      setCityNotFound(false);
    } catch (error) {
      console.log("An error occurred:", error.message);
      setError("An error occurred while fetching weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(() => {
    search();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          className="cityinput"
          placeholder="Search City"
          onChange={handleCity}
          onKeyDown={handleKeyDown}
          value={text}
        />
        <div className="search-icon">
          <img
            src={searchIcon}
            alt="search"
            style={{ width: "25px", height: "25px" }}
            onClick={() => search()}
          />
        </div>
      </div>

      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {cityNotFound && <div className="city-not-found">City not found</div>}

      {!loading && !cityNotFound && (
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          log={log}
          humidity={humidity}
          wind={wind}
        />
      )}
    </div>
  );
}

export default Weather;
