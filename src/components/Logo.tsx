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
    <Link to="/" className={`flex items-center space-x-3 hover:opacity-90 transition-all duration-300 group ${className}`}>
      {brandingSettings?.logo_url ? (
        <img 
          src={brandingSettings.logo_url} 
          alt={brandingSettings.business_name || "Logo"} 
          className={`${sizeClasses[size]} w-auto object-contain group-hover:scale-110 transition-transform duration-300`}
        />
      ) : (
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
          <span className="text-white font-bold text-sm">C</span>
        </div>
      )}
      {showText && (
        <span className={`font-bold ${textSizes[size]} text-gray-900 group-hover:scale-105 transition-transform duration-300`}>
          {brandingSettings?.business_name || 'Centrabudget'}
        </span>
      )}
    </Link>
  );
} 