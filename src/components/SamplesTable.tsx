import { type WaterSample, WATER_PARAMETERS, getParameterStatus } from "@/lib/water-data";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SamplesTableProps {
  samples: WaterSample[];
}

const SamplesTable = ({ samples }: SamplesTableProps) => {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border/50">
        <h2 className="text-lg font-semibold text-foreground">Recent Samples</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{samples.length} records</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Collected By</TableHead>
              {WATER_PARAMETERS.map((p) => (
                <TableHead key={p.id} className="text-center">
                  {p.icon} {p.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {samples.map((sample) => (
              <TableRow key={sample.id}>
                <TableCell className="font-medium max-w-[200px] truncate">{sample.location}</TableCell>
                <TableCell className="text-muted-foreground">{sample.date}</TableCell>
                <TableCell className="text-muted-foreground">{sample.collectedBy}</TableCell>
                {WATER_PARAMETERS.map((p) => {
                  const value = sample.parameters[p.id];
                  const status = getParameterStatus(p.id, value);
                  return (
                    <TableCell key={p.id} className="text-center">
                      <span
                        className={cn(
                          "inline-block px-2 py-0.5 rounded text-xs font-medium",
                          status === "safe" && "bg-safe/15 text-safe",
                          status === "warning" && "bg-warning/15 text-warning",
                          status === "danger" && "bg-danger/15 text-danger"
                        )}
                      >
                        {value} {p.unit}
                      </span>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SamplesTable;
