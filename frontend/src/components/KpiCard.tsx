interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
}

export function KpiCard({ label, value, unit }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">
        {value}
        {unit && <span className="kpi-unit"> {unit}</span>}
      </span>
    </div>
  );
}
