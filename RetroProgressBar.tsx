import React from "react";

interface RetroProgressBarProps {
  percentage: number; // 0 to 100
  color?: "health" | "blue" | "green" | "orange" | "purple";
  height?: "sm" | "md" | "lg";
  blockCount?: number;
  showPercentageText?: boolean;
}

export const RetroProgressBar: React.FC<RetroProgressBarProps> = ({
  percentage,
  color = "blue",
  height = "md",
  blockCount = 10,
  showPercentageText = false,
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));
  const activeBlocks = Math.round((clamped / 100) * blockCount);

  // Determine bar colors based on color theme or health status
  const getBarColor = () => {
    if (color === "health") {
      if (clamped > 50) return "bg-[#00696e] border-[#003437]";
      if (clamped > 20) return "bg-[#fe8b6d] border-[#75240e]";
      return "bg-[#ba1a1a] border-[#5c0006]";
    }
    if (color === "green") return "bg-[#50a2a7] border-[#003437]";
    if (color === "orange") return "bg-[#fe8b6d] border-[#75240e]";
    if (color === "purple") return "bg-[#b388ff] border-[#4a148c]";
    return "bg-[#005ac2] border-[#002c65]";
  };

  const heightClass =
    height === "sm" ? "h-3" : height === "lg" ? "h-7" : "h-5";

  return (
    <div className="w-full">
      <div
        className={`w-full ${heightClass} bg-[#1b1b1c] pixel-border p-1 flex gap-1 items-center justify-between relative overflow-hidden shadow-[inset_2px_2px_0px_rgba(0,0,0,0.6)]`}
      >
        {Array.from({ length: blockCount }).map((_, i) => {
          const isActive = i < activeBlocks;
          return (
            <div
              key={i}
              className={`h-full flex-1 transition-all duration-200 pixel-border ${
                isActive
                  ? `${getBarColor()} shadow-[inset_-1px_-1px_0px_rgba(0,0,0,0.3)]`
                  : "bg-[#2d3132] border-[#1b1b1c] opacity-40"
              }`}
            />
          );
        })}

        {showPercentageText && (
          <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-[10px] text-white tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,1)] select-none">
            {clamped}%
          </div>
        )}
      </div>
    </div>
  );
};
