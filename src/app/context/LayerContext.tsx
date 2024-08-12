import React, { createContext, useContext, useState, ReactNode } from "react";

interface LayerContextProps {
  layer: string;
  setLayer: (layer: string) => void;
}

const LayerContext = createContext<LayerContextProps | undefined>(undefined);

export const useLayer = () => {
  const context = useContext(LayerContext);
  if (!context) {
    throw new Error("useLayer must be used within a LayerProvider");
  }
  return context;
};

export const LayerProvider = ({ children }: { children: ReactNode }) => {
  const [layer, setLayer] = useState("");

  return (
    <LayerContext.Provider value={{ layer, setLayer }}>
      {children}
    </LayerContext.Provider>
  );
};
