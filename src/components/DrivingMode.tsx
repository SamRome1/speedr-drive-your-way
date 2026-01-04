import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, Zap, Clock, AlertTriangle, ArrowUp, CornerUpLeft, CornerUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DrivingModeProps {
  destination: string;
  distance: number;
  speedPercentage: number;
  onEnd: () => void;
}

// Mock turn-by-turn directions
const mockDirections = [
  { instruction: "Head north on Market St", distance: 0.3, icon: ArrowUp },
  { instruction: "Turn left onto 5th St", distance: 0.5, icon: CornerUpLeft },
  { instruction: "Turn right onto Mission St", distance: 0.8, icon: CornerUpRight },
  { instruction: "Continue onto US-101 N", distance: 5.2, icon: ArrowUp },
  { instruction: "Take exit toward Airport", distance: 2.1, icon: CornerUpRight },
  { instruction: "Arrive at destination", distance: 0, icon: Navigation },
];

const DrivingMode = ({ destination, distance, speedPercentage, onEnd }: DrivingModeProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [remainingDistance, setRemainingDistance] = useState(distance);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const avgSpeedLimit = 45;
  const targetSpeed = avgSpeedLimit * (1 + speedPercentage / 100);
  const isDanger = speedPercentage > 30;

  // Calculate remaining time
  const remainingTimeMinutes = (remainingDistance / targetSpeed) * 60;
  
  // Simulate driving
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
      
      // Simulate speed fluctuation around target
      const fluctuation = (Math.random() - 0.5) * 10;
      setCurrentSpeed(Math.max(0, targetSpeed + fluctuation));
      
      // Decrease remaining distance
      setRemainingDistance(prev => {
        const decrease = targetSpeed / 3600; // miles per second
        const newDistance = Math.max(0, prev - decrease);
        
        // Progress through directions
        const progress = 1 - (newDistance / distance);
        const newStep = Math.min(
          mockDirections.length - 1,
          Math.floor(progress * mockDirections.length)
        );
        setCurrentStep(newStep);
        
        return newDistance;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetSpeed, distance]);

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins} min`;
  };

  const currentDirection = mockDirections[currentStep];
  const DirectionIcon = currentDirection.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background"
    >
      {/* Top bar with current direction */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`absolute top-0 left-0 right-0 p-4 ${
          isDanger ? 'bg-gradient-to-b from-warning/20 to-transparent' : 'bg-gradient-to-b from-primary/20 to-transparent'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEnd}
            className="text-foreground hover:bg-secondary"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">TO</p>
            <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
              {destination}
            </p>
          </div>
          <div className="w-10" />
        </div>

        {/* Current direction card */}
        <motion.div
          key={currentStep}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              isDanger ? 'bg-warning/20' : 'bg-primary/20'
            }`}>
              <DirectionIcon className={`w-8 h-8 ${isDanger ? 'text-warning' : 'text-primary'}`} />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-foreground">
                {currentDirection.instruction}
              </p>
              {currentDirection.distance > 0 && (
                <p className="text-sm text-muted-foreground">
                  in {currentDirection.distance.toFixed(1)} mi
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Center - Speed Display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <motion.div
            className={`text-8xl font-bold mb-2 ${
              isDanger ? 'text-warning' : 'text-primary'
            }`}
            style={{
              textShadow: isDanger
                ? '0 0 60px hsl(38 92% 50% / 0.5)'
                : '0 0 60px hsl(190 100% 50% / 0.5)',
            }}
            key={Math.round(currentSpeed)}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
          >
            {Math.round(currentSpeed)}
          </motion.div>
          <p className="text-xl text-muted-foreground">MPH</p>
          
          {/* Speed over limit indicator */}
          <motion.div
            className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              isDanger ? 'bg-warning/20' : 'bg-primary/20'
            }`}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Zap className={`w-4 h-4 ${isDanger ? 'text-warning' : 'text-primary'}`} />
            <span className={`font-semibold ${isDanger ? 'text-warning' : 'text-primary'}`}>
              +{speedPercentage}% SPEEDR
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom stats bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent"
      >
        <div className="glass rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {/* ETA */}
            <div>
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs">ETA</span>
              </div>
              <p className={`text-lg font-bold ${isDanger ? 'text-warning' : 'text-primary'}`}>
                {formatTime(remainingTimeMinutes)}
              </p>
            </div>
            
            {/* Distance */}
            <div>
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Navigation className="w-4 h-4" />
                <span className="text-xs">Distance</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {remainingDistance.toFixed(1)} mi
              </p>
            </div>
            
            {/* Speed limit context */}
            <div>
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs">Limit</span>
              </div>
              <p className="text-lg font-bold text-muted-foreground">
                {avgSpeedLimit} mph
              </p>
            </div>
          </div>
        </div>

        {/* End navigation button */}
        <Button
          variant="outline"
          onClick={onEnd}
          className="w-full mt-4 py-6 border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          End Navigation
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default DrivingMode;
