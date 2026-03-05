import Header from "@/components/Header";
import SampleForm from "@/components/SampleForm";
import { useSamples } from "@/context/SamplesContext";
import { Badge } from "@/components/ui/badge";
import { FlaskConical } from "lucide-react";

const Samples = () => {
  const { samples, addSample } = useSamples();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <FlaskConical className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Water Samples</h1>
            <p className="text-sm text-muted-foreground">Manage and record water quality samples</p>
          </div>
          <Badge variant="secondary" className="ml-auto text-sm">
            {samples.length} records
          </Badge>
        </div>

        <SampleForm onAddSample={addSample} />
      </main>
    </div>
  );
};

export default Samples;
