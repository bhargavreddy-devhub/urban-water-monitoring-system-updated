import Header from "@/components/Header";
import { useSamples } from "@/context/SamplesContext";
import { WATER_PARAMETERS, getParameterStatus } from "@/lib/water-data";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

const CHART_COLORS = {
  safe: "hsl(145, 65%, 42%)",
  warning: "hsl(38, 92%, 50%)",
  danger: "hsl(0, 72%, 55%)",
  primary: "hsl(195, 85%, 35%)",
  accent: "hsl(175, 60%, 40%)",
};

const Reports = () => {
  const { samples } = useSamples();

  // Compute average per parameter
  const avgData = WATER_PARAMETERS.map((p) => {
    const values = samples.map((s) => s.parameters[p.id]).filter((v) => v != null);
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    return { name: p.name, average: parseFloat(avg.toFixed(2)), safeMax: p.safeMax, safeMin: p.safeMin, unit: p.unit };
  });

  // Overall compliance pie
  let safeCount = 0;
  let warningCount = 0;
  let dangerCount = 0;
  samples.forEach((s) => {
    WATER_PARAMETERS.forEach((p) => {
      const status = getParameterStatus(p.id, s.parameters[p.id]);
      if (status === "safe") safeCount++;
      else if (status === "warning") warningCount++;
      else dangerCount++;
    });
  });
  const pieData = [
    { name: "Safe", value: safeCount, color: CHART_COLORS.safe },
    { name: "Warning", value: warningCount, color: CHART_COLORS.warning },
    { name: "Danger", value: dangerCount, color: CHART_COLORS.danger },
  ].filter((d) => d.value > 0);

  // Trend data (line chart by sample index, reversed so oldest first)
  const trendData = [...samples].reverse().map((s, i) => ({
    sample: `#${i + 1}`,
    pH: s.parameters.ph,
    TDS: s.parameters.tds,
    Turbidity: s.parameters.turbidity,
  }));

  // Per-parameter summary cards
  const paramSummaries = WATER_PARAMETERS.map((p) => {
    const values = samples.map((s) => s.parameters[p.id]);
    const latest = values[0];
    const prev = values[1];
    const trend = prev != null ? (latest > prev ? "up" : latest < prev ? "down" : "flat") : "flat";
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    return { ...p, latest, trend, avg: parseFloat(avg.toFixed(2)), max, min };
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Water quality insights based on {samples.length} samples
            </p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {paramSummaries.map((ps) => (
            <div key={ps.id} className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{ps.icon}</span>
                {ps.trend === "up" && <TrendingUp className="w-4 h-4 text-warning" />}
                {ps.trend === "down" && <TrendingDown className="w-4 h-4 text-safe" />}
                {ps.trend === "flat" && <Minus className="w-4 h-4 text-muted-foreground" />}
              </div>
              <p className="text-xs text-muted-foreground">{ps.name}</p>
              <p className="text-xl font-bold text-foreground">{ps.avg} <span className="text-xs font-normal text-muted-foreground">{ps.unit}</span></p>
              <p className="text-xs text-muted-foreground mt-1">
                {ps.min}–{ps.max} {ps.unit}
              </p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar chart — averages */}
          <div className="glass-card rounded-xl p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-foreground mb-4">Average Parameter Levels</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={avgData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(210, 20%, 88%)",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="average" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart — compliance */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Overall Compliance</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend line chart */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Parameter Trends Across Samples</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 88%)" />
              <XAxis dataKey="sample" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(210, 20%, 88%)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="pH" stroke={CHART_COLORS.primary} strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="TDS" stroke={CHART_COLORS.accent} strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Turbidity" stroke={CHART_COLORS.warning} strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default Reports;
