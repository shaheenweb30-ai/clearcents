interface OnboardingProgressDotsProps {
  total: number;
  current: number;
}

export function OnboardingProgressDots({ total, current }: OnboardingProgressDotsProps) {
  return (
    <div className="flex items-center gap-2" aria-label="Progress">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={
            "h-2 w-2 rounded-full transition-all " +
            (i === current
              ? "w-4 bg-gradient-to-r from-indigo-600 to-teal-500 shadow"
              : "bg-white/40 dark:bg-white/30")
          }
          aria-current={i === current}
        />
      ))}
    </div>
  );
}

export default OnboardingProgressDots;


