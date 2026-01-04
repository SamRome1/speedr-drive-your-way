import { motion } from "framer-motion";
import { Clock, Zap, Route, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RouteCardProps {
  destination: string;
  distance: number;
  speedPercentage: number;
  onStart: () => void;
}

const RouteCard = ({ destination, distance, speedPercentage, onStart }: RouteCardProps) => {
  // Average speed limit assumed to be 45 mph for calculation
  const avgSpeedLimit = 45;
  const effectiveSpeed = avgSpeedLimit * (1 + speedPercentage / 100);
  
  // Base time in minutes
  const baseTime = (distance / avgSpeedLimit) * 60;
  const adjustedTime = (distance / effectiveSpeed) * 60;
  const timeSaved = baseTime - adjustedTime;
  
  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins} min`;
  };
  
  const isDanger = speedPercentage > 30;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Route Summary</h3>
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">{destination}</p>
        </div>
        <div className="flex items-center gap-2 text-primary">
          <Route className="w-5 h-5" />
          <span className="font-semibold">{distance} mi</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Normal ETA */}
        <div className="bg-secondary/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Normal ETA</span>
          </div>
          <p className="text-xl font-bold text-foreground">{formatTime(baseTime)}</p>
        </div>
        
        {/* Speedr ETA */}
        <div 
          className={`rounded-xl p-4 ${isDanger ? 'bg-warning/20' : 'bg-primary/20'}`}
        >
          <div className={`flex items-center gap-2 mb-2 ${isDanger ? 'text-warning' : 'text-primary'}`}>
            <Zap className="w-4 h-4" />
            <span className="text-xs font-medium">Speedr ETA</span>
          </div>
          <motion.p 
            className={`text-xl font-bold ${isDanger ? 'text-warning' : 'text-primary'}`}
            key={adjustedTime}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
          >
            {formatTime(adjustedTime)}
          </motion.p>
        </div>
      </div>
      
      {/* Time saved */}
      {timeSaved > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 py-3 bg-success/10 rounded-lg"
        >
          <TrendingDown className="w-4 h-4 text-success" />
          <span className="text-success font-medium">
            Save {formatTime(timeSaved)}
          </span>
        </motion.div>
      )}
      
      {/* Start button */}
      <Button
        onClick={onStart}
        className={`w-full py-6 text-lg font-semibold transition-all ${
          isDanger 
            ? 'bg-gradient-to-r from-warning to-destructive hover:opacity-90 text-background' 
            : 'gradient-speed hover:opacity-90 text-background'
        }`}
        style={{
          boxShadow: isDanger 
            ? '0 0 30px hsl(38 92% 50% / 0.4)' 
            : '0 0 30px hsl(190 100% 50% / 0.4)'
        }}
      >
        <Zap className="w-5 h-5 mr-2" />
        Let's Go
      </Button>
      
      {speedPercentage > 20 && (
        <p className="text-xs text-center text-muted-foreground">
          ⚠️ Drive responsibly. This is for entertainment purposes only.
        </p>
      )}
    </motion.div>
  );
};

export default RouteCard;
