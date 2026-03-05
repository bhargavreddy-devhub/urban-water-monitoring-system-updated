import { createContext, useContext, useState, type ReactNode } from "react";
import { MOCK_SAMPLES, type WaterSample } from "@/lib/water-data";

interface SamplesContextType {
  samples: WaterSample[];
  addSample: (sample: WaterSample) => void;
  deleteSample: (id: string) => void;
}

const SamplesContext = createContext<SamplesContextType | null>(null);

export const useSamples = () => {
  const ctx = useContext(SamplesContext);
  if (!ctx) throw new Error("useSamples must be used within SamplesProvider");
  return ctx;
};

export const SamplesProvider = ({ children }: { children: ReactNode }) => {
  const [samples, setSamples] = useState<WaterSample[]>(MOCK_SAMPLES);

  const addSample = (sample: WaterSample) => setSamples((prev) => [sample, ...prev]);
  const deleteSample = (id: string) => setSamples((prev) => prev.filter((s) => s.id !== id));

  return (
    <SamplesContext.Provider value={{ samples, addSample, deleteSample }}>
      {children}
    </SamplesContext.Provider>
  );
};
