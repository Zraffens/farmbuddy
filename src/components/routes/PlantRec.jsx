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
import { Leaf, MapPin, Droplets, Sun, Wind } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return position === null ? null : <Marker position={position} />;
};

const PlantRecommendationSystem = () => {
  const [npk, setNpk] = useState({ n: "", p: "", k: "" });
  const [position, setPosition] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [askingLocation, setAskingLocation] = useState(true);

  const dummyWeatherData = {
    temperature: 25,
    humidity: 60,
    rainfall: 1000,
  };

  const dummyPlants = [
    { name: "Rice", image: "https://via.placeholder.com/150?text=Rice" },
    { name: "Wheat", image: "https://via.placeholder.com/150?text=Wheat" },
    { name: "Maize", image: "https://via.placeholder.com/150?text=Maize" },
  ];

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
                    />
                  </MapContainer>
                </div>

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
              <div className="space-y-4">
                <div className="flex items-center">
                  <Sun className="mr-2 text-yellow-500" />
                  <span>Temperature: {dummyWeatherData.temperature}°C</span>
                </div>
                <div className="flex items-center">
                  <Droplets className="mr-2 text-blue-500" />
                  <span>Humidity: {dummyWeatherData.humidity}%</span>
                </div>
                <div className="flex items-center">
                  <Wind className="mr-2 text-gray-500" />
                  <span>Annual Rainfall: {dummyWeatherData.rainfall} mm</span>
                </div>
              </div>

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
