import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Navigation, Clock, Building2, Home, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DestinationInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (destination: string, distance: number) => void;
}

const suggestions = [
  { name: "Work", address: "123 Business Ave, Downtown", icon: Briefcase, distance: 15.2 },
  { name: "Home", address: "456 Residential St, Suburbs", icon: Home, distance: 8.5 },
  { name: "Airport", address: "International Airport Terminal 1", icon: Building2, distance: 32.1 },
  { name: "Shopping Mall", address: "789 Commerce Blvd", icon: Building2, distance: 5.8 },
];

const DestinationInput = ({ value, onChange, onSelect }: DestinationInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const filteredSuggestions = value 
    ? suggestions.filter(s => 
        s.name.toLowerCase().includes(value.toLowerCase()) ||
        s.address.toLowerCase().includes(value.toLowerCase())
      )
    : suggestions;

  return (
    <div className="relative w-full">
      <div 
        className={`relative flex items-center glass rounded-xl transition-all duration-300 ${
          isFocused ? 'glow ring-1 ring-primary/50' : ''
        }`}
      >
        <div className="absolute left-4 text-primary">
          <Navigation className="w-5 h-5" />
        </div>
        <Input
          type="text"
          placeholder="Where are you headed?"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-12 pr-12 py-6 bg-transparent border-none text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="absolute right-4 text-muted-foreground">
          <Search className="w-5 h-5" />
        </div>
      </div>
      
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden z-50"
          >
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    onChange(suggestion.address);
                    onSelect(suggestion.address, suggestion.distance);
                  }}
                  className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
                    <suggestion.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{suggestion.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{suggestion.address}</p>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{suggestion.distance} mi</span>
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No locations found</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DestinationInput;
