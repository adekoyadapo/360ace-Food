interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-4">
      <span className="inline-flex items-center rounded-full bg-ember/20 px-4 py-1 text-sm font-bold uppercase tracking-[0.32em] text-ember">
        {eyebrow}
      </span>
      <h2 className="font-display text-3xl text-midnight md:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-base text-slate/70">{description}</p> : null}
    </div>
  );
}
