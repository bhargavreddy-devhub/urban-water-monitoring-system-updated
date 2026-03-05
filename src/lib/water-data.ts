export interface WaterParameter {
  id: string;
  name: string;
  unit: string;
  safeMin: number;
  safeMax: number;
  icon: string;
}

export interface WaterSample {
  id: string;
  location: string;
  date: string;
  collectedBy: string;
  parameters: Record<string, number>;
}

export const WATER_PARAMETERS: WaterParameter[] = [
  { id: "ph", name: "pH", unit: "", safeMin: 6.5, safeMax: 8.5, icon: "🧪" },
  { id: "tds", name: "TDS", unit: "mg/L", safeMin: 0, safeMax: 500, icon: "💧" },
  { id: "turbidity", name: "Turbidity", unit: "NTU", safeMin: 0, safeMax: 5, icon: "🌊" },
  { id: "do", name: "Dissolved Oxygen", unit: "mg/L", safeMin: 6, safeMax: 14, icon: "🫧" },
  { id: "hardness", name: "Hardness", unit: "mg/L", safeMin: 0, safeMax: 300, icon: "⚗️" },
  { id: "chlorine", name: "Chlorine", unit: "mg/L", safeMin: 0.2, safeMax: 1, icon: "🔬" },
];

export function getParameterStatus(paramId: string, value: number): "safe" | "warning" | "danger" {
  const param = WATER_PARAMETERS.find((p) => p.id === paramId);
  if (!param) return "safe";
  if (value >= param.safeMin && value <= param.safeMax) return "safe";
  const range = param.safeMax - param.safeMin;
  const margin = range * 0.2;
  if (
    (value >= param.safeMin - margin && value < param.safeMin) ||
    (value > param.safeMax && value <= param.safeMax + margin)
  )
    return "warning";
  return "danger";
}

export const MOCK_SAMPLES: WaterSample[] = [
  {
    id: "1",
    location: "Station A — River Intake",
    date: "2026-02-20",
    collectedBy: "Dr. Sharma",
    parameters: { ph: 7.2, tds: 320, turbidity: 2.1, do: 7.8, hardness: 180, chlorine: 0.5 },
  },
  {
    id: "2",
    location: "Station B — Treatment Plant",
    date: "2026-02-19",
    collectedBy: "Amit Patel",
    parameters: { ph: 6.8, tds: 450, turbidity: 4.5, do: 6.2, hardness: 280, chlorine: 0.8 },
  },
  {
    id: "3",
    location: "Station C — Distribution Network",
    date: "2026-02-18",
    collectedBy: "Priya Verma",
    parameters: { ph: 8.9, tds: 620, turbidity: 7.2, do: 4.5, hardness: 400, chlorine: 0.1 },
  },
  {
    id: "4",
    location: "Station D — Reservoir Outlet",
    date: "2026-02-17",
    collectedBy: "Ravi Kumar",
    parameters: { ph: 7.0, tds: 210, turbidity: 1.5, do: 8.5, hardness: 150, chlorine: 0.6 },
  },
];
