// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/routes/Home";
import Header from "./components/custom/header";
import { UserProvider } from "./context/UserContext";
import DraughtDashboard from "./components/routes/DraughtDashboard";
const App = () => {
  return (
    <UserProvider>
      {/* Router should wrap around the entire app */}
      <Router>
        {/* Header needs to be inside Router */}
        <Header />

        {/* Define all routes here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/plant-recommendation"
            element={<div>Plant Recommendation</div>}
          />
          <Route path="/draughts" element={<DraughtDashboard />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
