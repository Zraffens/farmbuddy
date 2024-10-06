import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { ScrollArea } from "../ui/ScrollArea";
import { Sheet, SheetContent, SheetTrigger } from "../ui/Sheet";
import { MenuIcon, X, Leaf } from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { to: "/plantrec", label: "Plant Recommendation", icon: "🌱" },
  { to: "/droughts", label: "Drought Status", icon: "💧" },
];

export default function ResponsiveSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <ScrollArea className="h-[120vh] bg-gradient-to-b from-green-50 to-teal-50 py-6 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <NavLink
          className="flex items-center justify-start mb-8"
          to="/"
          onClick={() => setIsOpen(false)}
        >
          <Leaf className="text-green-500 h-8 w-8" />
          <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-400">
            FarmBuddy
          </span>
        </NavLink>
      </motion.div>
      <h2 className="mb-6 text-xl font-semibold text-green-800">Menu</h2>
      <nav className="flex flex-col space-y-4">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-green-200 text-green-800 font-bold z-50"
                    : "text-gray-600 hover:bg-green-100 hover:text-green-700"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-3 text-2xl">{item.icon}</span>
              {item.label}
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </ScrollArea>
  );

  return (
    <div className="xl:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-3 z-40 bg-white shadow-md hover:bg-green-50"
          >
            <MenuIcon className="h-6 w-6 text-green-600" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-80 p-0 border-r-4 border-green-200"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-6 top-4 z-50"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6 text-green-600" />
            </Button>
            <SidebarContent />
          </motion.div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
