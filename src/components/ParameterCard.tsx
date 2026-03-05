import { WATER_PARAMETERS, getParameterStatus } from "@/lib/water-data";
import { cn } from "@/lib/utils";

interface ParameterCardProps {
  paramId: string;
  value: number;
}

const statusLabels = {
  safe: "Within Range",
  warning: "Near Limit",
  danger: "Out of Range",
};

const ParameterCard = ({ paramId, value }: ParameterCardProps) => {
  const param = WATER_PARAMETERS.find((p) => p.id === paramId);
  if (!param) return null;

  const status = getParameterStatus(paramId, value);

  return (
    <div className="glass-card rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{param.icon}</span>
        <span
          className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full",
            status === "safe" && "status-safe",
            status === "warning" && "status-warning",
            status === "danger" && "status-danger"
          )}
        >
          {statusLabels[status]}
        </span>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{param.name}</h3>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {param.unit && <span className="text-sm text-muted-foreground">{param.unit}</span>}
      </div>
      <div className="mt-3 pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          Safe range: {param.safeMin}–{param.safeMax} {param.unit}
        </p>
      </div>
    </div>
  );
};

export default ParameterCard;
