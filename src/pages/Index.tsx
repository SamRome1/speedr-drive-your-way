import { useState } from "react";
import { motion } from "framer-motion";
import { Gauge, Zap } from "lucide-react";
import DestinationInput from "@/components/DestinationInput";
import SpeedSlider from "@/components/SpeedSlider";
import SpeedGauge from "@/components/SpeedGauge";
import RouteCard from "@/components/RouteCard";
import Map from "@/components/Map";
import { toast } from "sonner";

const Index = () => {
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [speedPercentage, setSpeedPercentage] = useState(0);

  const handleSelectDestination = (dest: string, dist: number) => {
    setDestination(dest);
    setDistance(dist);
  };

  const handleStart = () => {
    toast.success("Navigation started!", {
      description: `Heading to your destination +${speedPercentage}% faster`,
      icon: <Zap className="w-4 h-4" />,
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Map background */}
      <div className="absolute inset-0">
        <Map className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="relative z-10 container max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl gradient-speed flex items-center justify-center glow">
              <Gauge className="w-6 h-6 text-background" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              speed<span className="text-primary text-glow">r</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">Get there. Faster.</p>
        </motion.header>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Destination input */}
          <DestinationInput
            value={destination}
            onChange={setDestination}
            onSelect={handleSelectDestination}
          />

          {/* Speed controls */}
          {distance && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Gauge display */}
              <div className="glass rounded-2xl p-6 flex flex-col items-center">
                <SpeedGauge speedPercentage={speedPercentage} />
                <motion.p 
                  className="text-3xl font-bold mt-4"
                  style={{ 
                    color: speedPercentage > 40 
                      ? 'hsl(0 72% 51%)' 
                      : speedPercentage > 30 
                        ? 'hsl(38 92% 50%)' 
                        : 'hsl(190 100% 50%)'
                  }}
                >
                  +{speedPercentage}%
                </motion.p>
                <p className="text-sm text-muted-foreground">above speed limit</p>
              </div>

              {/* Speed slider */}
              <div className="glass rounded-2xl p-6">
                <SpeedSlider 
                  value={speedPercentage} 
                  onChange={setSpeedPercentage}
                />
              </div>

              {/* Route summary */}
              <RouteCard
                destination={destination}
                distance={distance}
                speedPercentage={speedPercentage}
                onStart={handleStart}
              />
            </motion.div>
          )}

          {/* Empty state */}
          {!distance && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Gauge className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Where to?
              </h3>
              <p className="text-muted-foreground text-sm">
                Enter a destination above to start planning your route with custom speed preferences.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-muted-foreground">
            For entertainment purposes only. Always follow local traffic laws.
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
