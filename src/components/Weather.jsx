import React, { useRef, useState } from 'react'
import './Weather.css'
import search_icon from  '../assets/search.png'
import clear_icon from  '../assets/clear.png'
import cloud_icon from  '../assets/cloud.png'
import drizzle_icon from  '../assets/drizzle.png'
import rain_icon from  '../assets/rain.png'
import snow_icon from  '../assets/snow.png'
import wind_icon from  '../assets/wind.png'
import humditity_icon from  '../assets/humidity.png'
import { useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";


const Weather = () => {
    
    const inputRef = useRef()
    const [weatherData, setWeatherData] = useState(false);
    const [forecastData, setForecastData] = useState([]);
    const [isMetric, setIsMetric] = useState(true);
    

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    }

    const emojiMap = {
  "clear sky": "☀️",
  "few clouds": "🌤️",
  "scattered clouds": "⛅",
  "broken clouds": "🌥️",
  "shower rain": "🌦️",
  "rain": "🌧️",
  "light rain": "🌧️",
  "moderate rain": "🌧️",
  "thunderstorm": "⛈️",
  "snow": "❄️",
  "mist": "🌫️",
  "haze": "🌫️",
  "overcast clouds": "☁️"
};

const getWeatherTheme = (desc = "") => {
  desc = desc.toLowerCase();
  if (desc.includes("clear")) return "sunny";
  if (desc.includes("rain") || desc.includes("shower")) return "rainy";
  if (desc.includes("snow")) return "snowy";
  if (desc.includes("cloud")) return "cloudy";
  return "default";
};


         const search = async (city) => {
            if(city == ""){
                alert("Enter City Name");
                return;
            }
            try {
              
                const unit = isMetric ? 'metric' : 'imperial';
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
                
                const response = await fetch(url);
                const data = await response.json();
                
                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
                const forecastResponse = await fetch(forecastUrl);
                const forecastJson = await forecastResponse.json();


                if(!response.ok || !forecastResponse.ok){
                    alert(data.message);
                    return;
                }


                console.log(data);
                const icon = allIcons[data.weather[0].icon] || clear_icon;
                setWeatherData({
                    humidity: data.main.humidity,
                    windspeed: data.wind.speed,
                    temperature: Math.floor(data.main.temp),
                    location: data.name,
                    icon: icon,
                    description: data.weather[0].description,
                     localTime: new Date((data.dt + data.timezone) * 1000).toLocaleString("en-US", {
                     hour: '2-digit',
                     minute: '2-digit',
                     day: 'numeric',
                     month: 'short',
                     year: 'numeric'
                })
            });

            const dailyForecast = forecastJson.list.filter(item => item.dt_txt.includes("12:00:00"));
            setForecastData(dailyForecast);
           
            } catch (error) {
                 setWeatherData(false);
                 setForecastData([]);
                 console.error("Error in fetching weather data");
            }
         }
         
         useEffect(() => {
          search('Surat');
          }, [isMetric]);

    


  return (
      <div className={`Weather ${getWeatherTheme(weatherData?.description)}`}>
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="search"/>
        <img src={search_icon} alt="" onClick={()=>search(inputRef.current.value)}/>
         <div className="unit-toggle">
           <label className="switch">
            <input type="checkbox" onChange={() => setIsMetric(!isMetric)} checked={!isMetric} />
            <span className="slider"></span>
          </label>
            <span className="unit-label">{isMetric ? '°C / km/h' : '°F / mph'}</span>
          </div>
      </div>
      
      {weatherData?<>
            <img src={weatherData.icon} alt=""  className='weather-icon'/>
      <p className="tempertaure">{weatherData.temperature}{isMetric? '°C' : '°F'}</p>
      <p className="description">
          {emojiMap[weatherData.description] || "🌈"} {weatherData.description}
      </p>
      <p className="location">{weatherData.location}</p>
      <p className="local-time">Local Time: {weatherData.localTime}</p>

      <div className="weather-data">
        <div className="col">
            <img src={humditity_icon} alt="" />
            <div>
                <p>{weatherData.humidity}</p>
                <span>Humidity</span>
            </div>
        </div>
         <div className="col">
            <img src={wind_icon} alt="" />
            <div>
                <p>{weatherData.windspeed} {isMetric? 'Km/h' : 'mph'}</p>
                <span>Wind Speed</span>
            </div>
        </div>
      </div> 
      {/* 📅 Forecast section goes here */}
        <div className="forecast">
          <h2>5-Day Forecast</h2>
          <div className="forecast-container">
            <AnimatePresence>
          {forecastData.map((item, index) => (
             <motion.div
               className="forecast-card"
               key={index}
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{
               type: "spring",
               stiffness: 300,
               damping: 15,
              delay: index * 0.1,
             }}
            whileHover={{ scale: 1.1 }}
      >
               <p>{new Date(item.dt_txt).toLocaleDateString(undefined, {
                  weekday: 'short', month: 'short', day: 'numeric'
                })}</p>
                <img src={allIcons[item.weather[0].icon] || clear_icon} alt="" />
                <p>{Math.round(item.main.temp)}°C</p>
                <span>{item.weather[0].main}</span>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        </div>
      </>:<></>}
      
    </div>
  )
}

export default Weather