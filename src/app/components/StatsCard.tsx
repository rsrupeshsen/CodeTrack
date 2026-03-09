export default function StatsCard({ title, value, color }: any) {
    return (
      <div className="bg-card border border-border rounded-2xl p-5">
  
        <p className="text-muted-foreground text-sm">
          {title}
        </p>
  
        <h3
          className="text-3xl font-bold mt-2"
          style={{ color }}
        >
          {value}
        </h3>
  
      </div>
    );
  }