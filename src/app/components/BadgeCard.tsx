export default function BadgeCard({
    title,
    icon,
    color,
    description,
  }: {
    title: string;
    icon: string;
    color: string;
    description?: string;
  }) {
    return (
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3 border transition-all hover:scale-[1.02]"
        style={{ background: `${color}15`, borderColor: `${color}40` }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${color}25` }}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
    );
  }