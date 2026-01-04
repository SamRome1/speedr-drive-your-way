import { motion } from "framer-motion";

interface SpeedGaugeProps {
  speedPercentage: number;
  maxPercentage?: number;
}

const SpeedGauge = ({ speedPercentage, maxPercentage = 50 }: SpeedGaugeProps) => {
  const rotation = (speedPercentage / maxPercentage) * 180 - 90;
  const isDanger = speedPercentage > 30;
  
  return (
    <div className="relative w-48 h-24 overflow-hidden">
      {/* Gauge background arc */}
      <div className="absolute inset-0">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Colored arc */}
          <motion.path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke={isDanger ? "url(#dangerGradient)" : "url(#speedGradient)"}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (speedPercentage / maxPercentage) * 283 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          {/* Gradients */}
          <defs>
            <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(190 100% 50%)" />
              <stop offset="100%" stopColor="hsl(170 100% 45%)" />
            </linearGradient>
            <linearGradient id="dangerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(38 92% 50%)" />
              <stop offset="100%" stopColor="hsl(0 72% 51%)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Needle */}
      <motion.div
        className="absolute bottom-0 left-1/2 origin-bottom"
        style={{ marginLeft: "-2px" }}
        initial={{ rotate: -90 }}
        animate={{ rotate: rotation }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <div 
          className={`w-1 h-16 rounded-full ${isDanger ? 'bg-destructive' : 'bg-primary'}`}
          style={{
            boxShadow: isDanger 
              ? '0 0 20px hsl(0 72% 51% / 0.6)' 
              : '0 0 20px hsl(190 100% 50% / 0.6)'
          }}
        />
      </motion.div>
      
      {/* Center dot */}
      <div 
        className={`absolute bottom-0 left-1/2 w-4 h-4 -ml-2 -mb-2 rounded-full ${isDanger ? 'bg-destructive' : 'bg-primary'}`}
        style={{
          boxShadow: isDanger 
            ? '0 0 15px hsl(0 72% 51% / 0.8)' 
            : '0 0 15px hsl(190 100% 50% / 0.8)'
        }}
      />
      
      {/* Speed labels */}
      <div className="absolute bottom-0 left-2 text-xs text-muted-foreground font-medium">0%</div>
      <div className="absolute bottom-0 right-2 text-xs text-muted-foreground font-medium">+{maxPercentage}%</div>
    </div>
  );
};

export default SpeedGauge;
