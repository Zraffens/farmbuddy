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
} from "recharts";
import {
  MapPin,
  Droplets,
  Thermometer,
  Wind,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";

const mockData = {
  soilMoisture: [
    { date: "2024-02-01", value: 250 },
    { date: "2024-02-15", value: 230 },
    { date: "2024-03-01", value: 200 },
    { date: "2024-03-15", value: 180 },
    { date: "2024-04-01", value: 194.3219 },
  ],
  rainfall: [
    { date: "2024-03-25", value: 2 },
    { date: "2024-03-26", value: 0 },
    { date: "2024-03-27", value: 1 },
    { date: "2024-03-28", value: 3 },
    { date: "2024-03-29", value: 5 },
    { date: "2024-03-30", value: 2 },
    { date: "2024-03-31", value: 0 },
    { date: "2024-04-01", value: 1 },
  ],
  temperature: [
    { date: "2024-03-25", min: 10, max: 22 },
    { date: "2024-03-26", min: 12, max: 24 },
    { date: "2024-03-27", min: 11, max: 23 },
    { date: "2024-03-28", min: 9, max: 21 },
    { date: "2024-03-29", min: 10, max: 22 },
    { date: "2024-03-30", min: 13, max: 25 },
    { date: "2024-03-31", min: 12, max: 24 },
    { date: "2024-04-01", min: 11, max: 23 },
  ],
  evapotranspiration: [
    { date: "2024-03-25", value: 1.2 },
    { date: "2024-03-26", value: 1.5 },
    { date: "2024-03-27", value: 1.3 },
    { date: "2024-03-28", value: 1.1 },
    { date: "2024-03-29", value: 1.4 },
    { date: "2024-03-30", value: 1.6 },
    { date: "2024-03-31", value: 1.5 },
    { date: "2024-04-01", value: 1.3 },
  ],
};

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

  useEffect(() => {
    if (showLocationAlert) {
      const timer = setTimeout(() => {
        setShowLocationAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showLocationAlert]);

  return (
    <div className="bg-gradient-to-br from-blue-100 to-green-100 min-h-screen p-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-blue-800 mb-8 text-center"
      >
        Drought Dashboard
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
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
          className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Droplets className="mr-2" /> Soil Moisture
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData.soilMoisture}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Droplets className="mr-2" /> Rainfall
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockData.rainfall}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Thermometer className="mr-2" /> Temperature
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockData.temperature}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="min"
                stroke="#8884d8"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="max"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Wind className="mr-2" /> Total Evapotranspiration
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockData.evapotranspiration}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default DroughtDashboard;
