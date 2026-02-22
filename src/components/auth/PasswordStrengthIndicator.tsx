import { useMemo } from "react";

export type PasswordStrength = "weak" | "medium" | "strong" | null;

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
}

export function PasswordStrengthIndicator({
  strength,
}: PasswordStrengthIndicatorProps) {
  const config = useMemo(() => {
    switch (strength) {
      case "weak":
        return {
          label: "Słabe",
          width: "33.333%",
          color: "bg-red-500 dark:bg-red-400",
          textColor: "text-red-700 dark:text-red-400",
        };
      case "medium":
        return {
          label: "Średnie",
          width: "66.666%",
          color: "bg-yellow-500 dark:bg-yellow-400",
          textColor: "text-yellow-700 dark:text-yellow-400",
        };
      case "strong":
        return {
          label: "Mocne",
          width: "100%",
          color: "bg-green-500 dark:bg-green-400",
          textColor: "text-green-700 dark:text-green-400",
        };
      default:
        return null;
    }
  }, [strength]);

  if (!config) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${config.textColor}`}>
          Siła hasła: {config.label}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full transition-all duration-300 ${config.color}`}
          style={{ width: config.width }}
          role="progressbar"
          aria-valuenow={
            strength === "weak" ? 33 : strength === "medium" ? 66 : 100
          }
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Siła hasła: ${config.label}`}
        />
      </div>
    </div>
  );
}
