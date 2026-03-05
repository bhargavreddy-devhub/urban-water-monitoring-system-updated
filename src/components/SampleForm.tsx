import { useState } from "react";
import { WATER_PARAMETERS, type WaterSample } from "@/lib/water-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface SampleFormProps {
  onAddSample: (sample: WaterSample) => void;
}

const SampleForm = ({ onAddSample }: SampleFormProps) => {
  const { toast } = useToast();
  const [location, setLocation] = useState("");
  const [collectedBy, setCollectedBy] = useState("");
  const [params, setParams] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!location.trim()) newErrors.location = "Required";
    if (!collectedBy.trim()) newErrors.collectedBy = "Required";

    WATER_PARAMETERS.forEach((p) => {
      const val = params[p.id];
      if (!val || val.trim() === "") {
        newErrors[p.id] = "Required";
      } else {
        const num = parseFloat(val);
        if (isNaN(num) || num < 0) {
          newErrors[p.id] = "Must be a positive number";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const paramValues: Record<string, number> = {};
    WATER_PARAMETERS.forEach((p) => {
      paramValues[p.id] = parseFloat(params[p.id]);
    });

    const sample: WaterSample = {
      id: Date.now().toString(),
      location: location.trim(),
      date: new Date().toISOString().split("T")[0],
      collectedBy: collectedBy.trim(),
      parameters: paramValues,
    };

    onAddSample(sample);
    setLocation("");
    setCollectedBy("");
    setParams({});
    setErrors({});
    toast({ title: "Sample recorded", description: `Sample from ${sample.location} added successfully.` });
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Record New Sample</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. Station A — River Intake"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={100}
            />
            {errors.location && <p className="text-xs text-destructive mt-1">{errors.location}</p>}
          </div>
          <div>
            <Label htmlFor="collectedBy">Collected By</Label>
            <Input
              id="collectedBy"
              placeholder="e.g. Dr. Sharma"
              value={collectedBy}
              onChange={(e) => setCollectedBy(e.target.value)}
              maxLength={100}
            />
            {errors.collectedBy && <p className="text-xs text-destructive mt-1">{errors.collectedBy}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {WATER_PARAMETERS.map((p) => (
            <div key={p.id}>
              <Label htmlFor={p.id}>
                {p.icon} {p.name} {p.unit && `(${p.unit})`}
              </Label>
              <Input
                id={p.id}
                type="number"
                step="any"
                min="0"
                placeholder={`${p.safeMin}–${p.safeMax}`}
                value={params[p.id] || ""}
                onChange={(e) => setParams((prev) => ({ ...prev, [p.id]: e.target.value }))}
              />
              {errors[p.id] && <p className="text-xs text-destructive mt-1">{errors[p.id]}</p>}
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Sample
        </Button>
      </form>
    </div>
  );
};

export default SampleForm;
