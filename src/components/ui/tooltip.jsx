import React, { useState } from "react";

const TooltipContext = React.createContext({
  open: false,
  setOpen: () => {},
});

export const Tooltip = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      {children}
    </TooltipContext.Provider>
  );
};

export const TooltipTrigger = ({ children }) => {
  const { setOpen } = React.useContext(TooltipContext);

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
    </div>
  );
};

export const TooltipContent = ({ children }) => {
  const { open } = React.useContext(TooltipContext);

  if (!open) return null;

  return (
    <div className="absolute z-10 p-2 text-sm bg-gray-800 text-white rounded shadow-lg mt-1">
      {children}
    </div>
  );
};

export const TooltipProvider = Tooltip;
