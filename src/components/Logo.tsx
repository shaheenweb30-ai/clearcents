import { Link } from "react-router-dom";
import { DollarSign } from "lucide-react";
import { useOptimizedBrandingSettings } from "@/hooks/useOptimizedBrandingSettings";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const { settings: brandingSettings } = useOptimizedBrandingSettings();

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <Link to="/" className={`flex items-center space-x-2 hover:opacity-80 transition-opacity ${className}`}>
      {brandingSettings?.logo_url ? (
        <img 
          src={brandingSettings.logo_url} 
          alt={brandingSettings.business_name || "Logo"} 
          className={`${sizeClasses[size]} w-auto object-contain`}
        />
      ) : (
        <div className={`${sizeClasses[size]} bg-primary rounded-full flex items-center justify-center`}>
          <DollarSign className={`${size === "sm" ? "w-3 h-3" : size === "md" ? "w-5 h-5" : "w-7 h-7"} text-primary-foreground`} />
        </div>
      )}
      {showText && (
        <span className={`font-heading font-bold ${textSizes[size]} text-primary`}>
          {brandingSettings?.business_name || 'ClearCents'}
        </span>
      )}
    </Link>
  );
} 