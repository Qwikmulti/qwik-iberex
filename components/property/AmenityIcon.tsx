import { 
  Waves, 
  Film, 
  Dumbbell, 
  Zap, 
  Thermometer, 
  Car, 
  Fingerprint, 
  Cloud, 
  Wind,
  ShieldCheck,
  Flame,
  Wifi,
  Tv,
  Coffee,
  Trees
} from "lucide-react";

interface AmenityIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function AmenityIcon({ name, size = 20, className }: AmenityIconProps) {
  const norm = name.toLowerCase();

  if (norm.includes("pool"))             return <Waves size={size} className={className} />;
  if (norm.includes("cinema") || norm.includes("theater")) return <Film size={size} className={className} />;
  if (norm.includes("gym") || norm.includes("fitness") || norm.includes("wellness")) return <Dumbbell size={size} className={className} />;
  if (norm.includes("smart") || norm.includes("ecosystem") || norm.includes("automation")) return <Zap size={size} className={className} />;
  if (norm.includes("climate") || norm.includes("wine") || norm.includes("cellar")) return <Thermometer size={size} className={className} />;
  if (norm.includes("car") || norm.includes("garage") || norm.includes("gallery")) return <Car size={size} className={className} />;
  if (norm.includes("security") || norm.includes("biometric") || norm.includes("fingerprint")) return <Fingerprint size={size} className={className} />;
  if (norm.includes("sauna") || norm.includes("steam")) return <Cloud size={size} className={className} />;
  if (norm.includes("air") || norm.includes("ac") || norm.includes("ventilation")) return <Wind size={size} className={className} />;
  if (norm.includes("security") || norm.includes("guarded")) return <ShieldCheck size={size} className={className} />;
  if (norm.includes("kitchen") || norm.includes("chef")) return <Flame size={size} className={className} />;
  if (norm.includes("wifi") || norm.includes("internet")) return <Wifi size={size} className={className} />;
  if (norm.includes("tv") || norm.includes("entertainment")) return <Tv size={size} className={className} />;
  if (norm.includes("coffee") || norm.includes("bar")) return <Coffee size={size} className={className} />;
  if (norm.includes("garden") || norm.includes("landscaped") || norm.includes("park")) return <Trees size={size} className={className} />;

  // Default
  return <ShieldCheck size={size} className={className} />;
}
