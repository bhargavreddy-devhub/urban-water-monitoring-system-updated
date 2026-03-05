import Header from "@/components/Header";
import ParameterCard from "@/components/ParameterCard";
import SamplesTable from "@/components/SamplesTable";
import { useSamples } from "@/context/SamplesContext";
import { WATER_PARAMETERS } from "@/lib/water-data";
import { Droplets, ShieldCheck, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { samples } = useSamples();
  const latestSample = samples[0];

  const totalSamples = samples.length;
  const safeCount = samples.filter((s) =>
    Object.entries(s.parameters).every(([key, val]) => {
      const p = WATER_PARAMETERS.find((wp) => wp.id === key);
      return p ? val >= p.safeMin && val <= p.safeMax : true;
    })
  ).length;
  const alertCount = totalSamples - safeCount;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalSamples}</p>
              <p className="text-xs text-muted-foreground">Total Samples</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-safe/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-safe" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{safeCount}</p>
              <p className="text-xs text-muted-foreground">All Parameters Safe</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{alertCount}</p>
              <p className="text-xs text-muted-foreground">With Alerts</p>
            </div>
          </div>
        </div>

        {/* Parameter cards for latest sample */}
        {latestSample && (
          <section>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Latest Reading — {latestSample.location}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {WATER_PARAMETERS.map((p) => (
                <ParameterCard key={p.id} paramId={p.id} value={latestSample.parameters[p.id]} />
              ))}
            </div>
          </section>
        )}

        {/* Recent samples table */}
        <SamplesTable samples={samples} />

        {/* Quick links */}
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/samples">View All Samples</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/reports">View Reports</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
