interface OnboardingHeaderProps {
  idTitle: string;
  idSubtitle: string;
  title: string;
  subtitle: string;
}

export function OnboardingHeader({ idTitle, idSubtitle, title, subtitle }: OnboardingHeaderProps) {
  return (
    <div className="px-6 pt-6 pb-4">
      <h2 id={idTitle} className="text-2xl font-semibold text-white drop-shadow-sm">
        {title}
      </h2>
      <p id={idSubtitle} className="mt-1 text-sm text-white/90">
        {subtitle}
      </p>
    </div>
  );
}

export default OnboardingHeader;


