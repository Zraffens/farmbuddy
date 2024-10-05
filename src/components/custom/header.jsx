import React from "react";
import { NavLink } from "react-router-dom";
import { Leaf } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
      <div className="mx-auto flex justify-between items-center relative font-poppins text-lg max-xl:justify-center">
        {/* Logo */}
        <NavLink className="flex items-center justify-start xl:flex-1" to="/">
          <Leaf className="text-green-500" />
          <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-400 max-sm:text-lg">
            FarmBuddy
          </span>
        </NavLink>

        {/* Navigation */}
        <nav className="hidden xl:flex justify-center flex-1 gap-20">
          <NavLink
            to="/plantrec"
            className="text-gray-600 hover:text-gray-900"
            activeClassName="text-gray-900 font-bold"
          >
            Plant Recommendation
          </NavLink>
          <NavLink
            to="/flood"
            className="text-gray-600 hover:text-gray-900"
            activeClassName="text-gray-900 font-bold"
          >
            Flood Status
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
