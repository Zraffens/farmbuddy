import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import {
  Leaf,
  MapPin,
  Droplets,
  Sun,
  Wind,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const LocationMarker = ({ position, setPosition, setLocationData }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetchLocationData(e.latlng);
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      fetchLocationData(e.latlng);
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  const fetchLocationData = async (latlng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`
      );
      const data = await response.json();
      setLocationData(data.address);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  return position === null ? null : <Marker position={position} />;
};

const WeatherIcon = ({ condition }) => {
  const iconMap = {
    Clear: Sun,
    Clouds: Cloud,
    Rain: CloudRain,
    Snow: CloudSnow,
    Thunderstorm: CloudLightning,
    Drizzle: CloudRain,
    Mist: Cloud,
    Smoke: Cloud,
    Haze: Cloud,
    Dust: Wind,
    Fog: Cloud,
    Sand: Wind,
    Ash: Cloud,
    Squall: Wind,
    Tornado: Wind,
  };

  const Icon = iconMap[condition] || Cloud;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Icon className="w-16 h-16 text-blue-500" />
    </motion.div>
  );
};

const PlantRecommendationSystem = () => {
  const [npk, setNpk] = useState({ n: "", p: "", k: "" });
  const [position, setPosition] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [askingLocation, setAskingLocation] = useState(true);
  const [locationData, setLocationData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [monthlyRainfall, setMonthlyRainfall] = useState(null);

  const dummyPlants = [
    { name: "Rice", image: "https://via.placeholder.com/150?text=Rice" },
    { name: "Wheat", image: "https://via.placeholder.com/150?text=Wheat" },
    { name: "Maize", image: "https://via.placeholder.com/150?text=Maize" },
  ];

  const fetchWeatherData = async (lat, lon) => {
    const API_KEY = process.env.REACT_APP_OPENWAPI; 
    console.log(process.env);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      setWeatherData({
        temperature: data.main.temp,
        humidity: data.main.humidity,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        windSpeed: data.wind.speed,
      });

      // Fetch monthly rainfall data (this is a placeholder, as OpenWeatherAPI doesn't provide monthly data in the free tier)
      // You might need to use a different API or calculate this based on historical data
      setMonthlyRainfall(Math.random() * 100); // Placeholder: random value between 0-100 mm
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    if (position) {
      fetchWeatherData(position.lat, position.lng);
    }
  }, [position]);

  const handleNpkChange = (e) => {
    setNpk({ ...npk, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const randomPlant =
      dummyPlants[Math.floor(Math.random() * dummyPlants.length)];
    setRecommendation(randomPlant);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-green-800 mb-8 text-center"
      >
        FarmBuddy Plant Recommendation
      </motion.h1>

      {askingLocation ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8 text-center"
        >
          <p className="mb-4">
            To provide accurate recommendations, we need your location. Please
            allow location access when prompted.
          </p>
          <button
            onClick={() => setAskingLocation(false)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Continue
          </button>
        </motion.div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/2 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    NPK Composition
                  </label>
                  <div className="mt-1 flex space-x-4">
                    {["n", "p", "k"].map((nutrient) => (
                      <input
                        key={nutrient}
                        type="number"
                        name={nutrient}
                        value={npk[nutrient]}
                        onChange={handleNpkChange}
                        placeholder={nutrient.toUpperCase()}
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ))}
                  </div>
                </div>

                <div style={{ height: "300px", width: "100%" }}>
                  <MapContainer
                    center={[28.3949, 84.124]}
                    zoom={7}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker
                      position={position}
                      setPosition={setPosition}
                      setLocationData={setLocationData}
                    />
                  </MapContainer>
                </div>

                {locationData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-md text-white"
                  >
                    <h3 className="text-xl font-semibold mb-3">
                      Location Details
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {locationData.city && (
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 mr-2" />
                          <span>{locationData.city}</span>
                        </div>
                      )}
                      {locationData.state && (
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 mr-2" />
                          <span>{locationData.state}</span>
                        </div>
                      )}
                      {locationData.country && (
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 mr-2" />
                          <span>{locationData.country}</span>
                        </div>
                      )}
                      {locationData.postcode && (
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 mr-2" />
                          <span>{locationData.postcode}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Get Recommendation
                </button>
              </form>
            </div>

            <div className="md:flex-shrink-0 md:w-1/2 bg-green-50 p-8">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">
                Weather Conditions
              </h2>
              {weatherData ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <WeatherIcon condition={weatherData.condition} />
                    <div className="text-right">
                      <p className="text-3xl font-bold">
                        {weatherData.temperature.toFixed(1)}°C
                      </p>
                      <p className="text-gray-600 capitalize">
                        {weatherData.description}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Droplets className="w-6 h-6 mr-2 text-blue-500" />
                      <span>Humidity: {weatherData.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="w-6 h-6 mr-2 text-gray-500" />
                      <span>Wind: {weatherData.windSpeed} m/s</span>
                    </div>
                    <div className="flex items-center col-span-2">
                      <CloudRain className="w-6 h-6 mr-2 text-blue-400" />
                      <span>
                        Monthly Rainfall: {monthlyRainfall.toFixed(1)} mm
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <p>Loading weather data...</p>
              )}

              {recommendation && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8"
                >
                  <h2 className="text-2xl font-semibold text-green-800 mb-4">
                    Recommended Plant
                  </h2>
                  <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
                    <img
                      src={recommendation.image}
                      alt={recommendation.name}
                      className="w-20 h-20 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">
                        {recommendation.name}
                      </h3>
                      <p className="text-gray-600">
                        Best suited for your soil and climate
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantRecommendationSystem;
