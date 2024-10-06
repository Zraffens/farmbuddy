import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  MapPin,
  Droplets,
  Thermometer,
  Wind,
  AlertTriangle,
  CloudRain,
} from "lucide-react";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import axios from "axios";


const LocationMarker = ({
  position,
  setPosition,
  setLocationData,
  fetchWeatherData,
}) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetchLocationData(e.latlng);
      fetchWeatherData(e.latlng);
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      fetchLocationData(e.latlng);
      fetchWeatherData(e.latlng);
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

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected location</Popup>
    </Marker>
  );
};

const DroughtDashboard = () => {
  const [position, setPosition] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [showLocationAlert, setShowLocationAlert] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [showDroughtAlert, setShowDroughtAlert] = useState(false);
  const [showOversaturationAlert, setShowOversaturationAlert] = useState(false);

  useEffect(() => {
    if (weatherData && weatherData.length > 0) {
      const latestData = weatherData[weatherData.length - 1];
      setShowDroughtAlert(latestData.droughtIndex < 0);
      setShowOversaturationAlert(latestData.soilMoisture > 1);
    }
  }, [weatherData]);

  useEffect(() => {
    if (showLocationAlert) {
      const timer = setTimeout(() => {
        setShowLocationAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showLocationAlert]);

  useEffect(() => {
    if (weatherData && weatherData.length > 0) {
      const latestDroughtValue =
        weatherData[weatherData.length - 1].droughtIndex;
      setShowDroughtAlert(latestDroughtValue < 0);
    }
  }, [weatherData]);

  const fetchWeatherData = async (latlng) => {
    try {
      const response = await axios.post(
        "https://nsa2024-production.up.railway.app/weatherdata",
        {
          lat: latlng.lat,
          long: latlng.lng,
        }
      );
      const data = response.data;
      console.log(data, "Weather data fetched");

      // Process the data to match the chart format
      const processedData = data.soil_moisture_index.map((value, index) => ({
        date: new Date(
          Date.now() -
            (data.soil_moisture_index.length - 1 - index) * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
        soilMoisture: value,
        droughtIndex: data.drought_index[index],
        temperature: data.temperature[index],
        evapotranspiration: data.evapotranspiration[index],
        rainfall: data.rainfall[index],
      }));

      setWeatherData(processedData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 to-green-100 min-h-screen p-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-6xl font-bold text-center mb-8"
      >
        <motion.span
          initial={{ color: "#1e40af" }}
          animate={{ color: ["#1e40af", "#3b82f6", "#60a5fa", "#1e40af"] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="inline-block"
        >
          Drought
        </motion.span>{" "}
        <motion.span
          initial={{ color: "#065f46" }}
          animate={{ color: ["#065f46", "#10b981", "#34d399", "#065f46"] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          className="inline-block"
        >
          Dashboard
        </motion.span>
      </motion.h1>

      {showLocationAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-100 w-4/5 mx-auto border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md flex items-center justify-between"
        >
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <p>
              To provide accurate recommendations, we need your location. Please
              allow location access when prompted.
            </p>
          </div>
          <button
            onClick={() => setShowLocationAlert(false)}
            className="text-yellow-700 font-bold"
          >
            ×
          </button>
        </motion.div>
      )}
      {showDroughtAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-red-100 w-4/5 mx-auto border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-center justify-between"
        >
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <p>
              Warning: The latest drought index is below zero! Drought
              Possibility Detected!
            </p>
          </div>
          <button
            onClick={() => setShowDroughtAlert(false)}
            className="text-red-700 font-bold"
          >
            ×
          </button>
        </motion.div>
      )}

      {showOversaturationAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-blue-100 w-4/5 mx-auto border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-md flex items-center justify-between"
        >
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <p>
              Warning: The latest soil moisture index is above 1! Soil
              oversaturation and wetting detected!
            </p>
          </div>
          <button
            onClick={() => setShowOversaturationAlert(false)}
            className="text-blue-700 font-bold"
          >
            ×
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 min-h-[500px]"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <MapPin className="mr-2" /> Region Selection
          </h2>
          <div className="h-64 w-full rounded-lg overflow-hidden mb-4">
            <MapContainer
              center={[28.3949, 84.124]}
              zoom={7}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker
                position={position}
                setPosition={setPosition}
                setLocationData={setLocationData}
                fetchWeatherData={fetchWeatherData}
              />
            </MapContainer>
          </div>
          {locationData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4 p-4 bg-blue-50 rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-2">Location Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {locationData.city && <div>City: {locationData.city}</div>}
                {locationData.state && <div>State: {locationData.state}</div>}
                {locationData.country && (
                  <div>Country: {locationData.country}</div>
                )}
                {locationData.postcode && (
                  <div>Postcode: {locationData.postcode}</div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6 min-h-[500px]"
        >
          <h2 className="text-2xl font-semibold mb-24 flex items-center">
            <Droplets className="mr-2" /> Soil Moisture
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weatherData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="soilMoisture"
                stroke="#8884d8"
                strokeWidth={2}
                name="Soil Moisture Index"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-6 min-h-[500px]"
        >
          <h2 className="text-2xl font-semibold mb-24 flex items-center">
            <AlertTriangle className="mr-2" /> Drought Index
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weatherData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="droughtIndex"
                stroke="#FF8042"
                strokeWidth={2}
                name="Drought Index"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <CloudRain className="mr-2" /> Rainfall
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weatherData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rainfall" fill="#82ca9d" name="Rainfall (mm)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Thermometer className="mr-2" /> Temperature
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weatherData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#8884d8"
                strokeWidth={2}
                name="Temperature (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Wind className="mr-2" /> Evapotranspiration
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weatherData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="evapotranspiration"
                fill="#8884d8"
                name="Evapotranspiration (mm)"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default DroughtDashboard;
