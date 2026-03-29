type InfoRowProps = {
  label: string;
  value: string;
  mono?: boolean;
};

export function InfoRow({ label, value, mono = false }: InfoRowProps) {
  return (
    <div className="row">
      <div className="row-label">{label}</div>
      <div className={mono ? "mono" : ""}>{value}</div>
    </div>
  );
}
