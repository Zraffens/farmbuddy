// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/routes/Home";
import Header from "./components/custom/header";
import { UserProvider } from "./context/UserContext";
import DroughtDashboard from "./components/routes/DroughtDashboard";
import PlantRecommendationSystem from "./components/routes/PlantRec";
import ResponsiveSidebar from "./components/custom/mobilenav";

const App = () => {
  return (
    <UserProvider>
      {/* Router should wrap around the entire app */}
      <Router>
        {/* Header needs to be inside Router */}
        <Header />
        <ResponsiveSidebar />

        {/* Define all routes here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/plantrec"
            element={<PlantRecommendationSystem />}
          />
          <Route path="/droughts" element={<DroughtDashboard />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
