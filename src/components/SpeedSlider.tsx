import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";

interface SpeedSliderProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

const SpeedSlider = ({ value, onChange, max = 50 }: SpeedSliderProps) => {
  const isDanger = value > 30;
  const isExtreme = value > 40;
  
  const getLabel = () => {
    if (value === 0) return "Speed limit";
    if (value <= 10) return "A little faster";
    if (value <= 20) return "Cruising";
    if (value <= 30) return "Making time";
    if (value <= 40) return "Need for speed";
    return "Full send";
  };
  
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Speed Preference</span>
        <motion.span 
          className={`text-lg font-bold ${
            isExtreme ? 'text-destructive' : isDanger ? 'text-warning' : 'text-primary'
          }`}
          key={value}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          +{value}%
        </motion.span>
      </div>
      
      <div className="relative">
        <Slider
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          max={max}
          step={1}
          className={`
            [&_[role=slider]]:h-5 [&_[role=slider]]:w-5
            [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary
            [&_[role=slider]]:bg-background
            [&_[role=slider]]:shadow-[0_0_15px_hsl(190_100%_50%_/_0.5)]
            [&_[role=slider]]:transition-shadow
            [&_[role=slider]]:hover:shadow-[0_0_25px_hsl(190_100%_50%_/_0.7)]
            ${isDanger ? '[&_[role=slider]]:border-warning [&_[role=slider]]:shadow-[0_0_15px_hsl(38_92%_50%_/_0.5)]' : ''}
            ${isExtreme ? '[&_[role=slider]]:border-destructive [&_[role=slider]]:shadow-[0_0_15px_hsl(0_72%_51%_/_0.5)]' : ''}
          `}
        />
        
        {/* Track markers */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-2 pointer-events-none">
          {[0, 10, 20, 30, 40, 50].map((mark) => (
            <div 
              key={mark} 
              className={`w-0.5 h-2 rounded-full transition-colors ${
                mark <= value 
                  ? mark > 40 ? 'bg-destructive' : mark > 30 ? 'bg-warning' : 'bg-primary'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
      
      <motion.p 
        className={`text-center text-sm font-medium ${
          isExtreme ? 'text-destructive' : isDanger ? 'text-warning' : 'text-primary'
        }`}
        key={getLabel()}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {getLabel()}
      </motion.p>
    </div>
  );
};

export default SpeedSlider;
