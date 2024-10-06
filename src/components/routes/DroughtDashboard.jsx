import React, { useState } from "react";
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
import { MapPin, Droplets, Thermometer, Wind } from "lucide-react";
import { motion } from "framer-motion";

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

const DroughtDashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState("Jumla");
  const [selectedPeriod, setSelectedPeriod] = useState("Dekad");

  return (
    <div className="bg-gradient-to-br from-blue-100 to-green-100 min-h-screen p-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-blue-800 mb-8 text-center"
      >
        drought
      </motion.h1>

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
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Jumla">Jumla</option>
            <option value="Kathmandu">Kathmandu</option>
            <option value="Pokhara">Pokhara</option>
          </select>
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Select Periodicity</h3>
            <div className="flex space-x-4">
              {["Dekad", "1 Month", "3 Months"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded ${
                    selectedPeriod === period
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6 col-span-2"
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
