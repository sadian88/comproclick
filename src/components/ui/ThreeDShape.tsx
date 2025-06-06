import { cn } from "@/lib/utils";

interface ThreeDShapeProps {
  type: "sphere" | "polyhedron" | "crystal";
  className?: string;
  color?: string; 
  size?: number; 
}

// Basic SVG Sphere
const SphereSvg = ({ color, size }: { color: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="sphereGradientModern" cx="30%" cy="30%" r="70%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--color-blanco-puro)/0.8)', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.7 }} />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#sphereGradientModern)" />
    <circle cx="50" cy="50" r="45" fill="transparent" stroke={color} strokeWidth="0.5" opacity="0.4"/>
  </svg>
);

// Basic SVG Polyhedron (Abstracted)
const PolyhedronSvg = ({ color, size }: { color: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
       <linearGradient id="polyGradientModern" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--color-lila-pastel)/0.7)', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.8 }} />
      </linearGradient>
    </defs>
    <rect x="15" y="15" width="70" height="70" fill="url(#polyGradientModern)" stroke={color} strokeWidth="1" opacity="0.8" rx="10" transform="rotate(15 50 50)" />
     <path d="M20 20 L50 10 L80 20 L65 35 Z" fill='hsl(var(--color-blanco-puro)/0.3)' opacity="0.5" transform="rotate(15 50 50)" />
     <path d="M80 20 L80 80 L65 90 L65 35 Z" fill='hsl(var(--color-blanco-puro)/0.2)' opacity="0.4" transform="rotate(15 50 50)" />
  </svg>
);

// Basic SVG Crystal
const CrystalSvg = ({ color, size }: { color: string; size: number }) => (
 <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="crystalGradientModern" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: 'hsl(var(--color-rosa-claro)/0.8)', stopOpacity: 0.8}} />
        <stop offset="50%" style={{stopColor: color, stopOpacity: 0.6}} />
        <stop offset="100%" style={{stopColor: 'hsl(var(--color-azul-cielo-suave)/0.8)', stopOpacity: 0.8}} />
      </linearGradient>
    </defs>
    <polygon points="50,5 15,35 30,75 70,75 85,35" fill="url(#crystalGradientModern)" stroke="hsl(var(--color-blanco-puro)/0.3)" strokeWidth="0.75" />
    <polygon points="50,5 50,45 15,35" fill="hsl(var(--color-lila-pastel)/0.3)" />
    <polygon points="50,5 50,45 85,35" fill="hsl(var(--color-rosa-claro)/0.3)" />
    <polygon points="30,75 50,45 15,35" fill="hsl(var(--color-azul-cielo-suave)/0.4)" />
  </svg>
);


export default function ThreeDShape({ type, className, color = "hsl(var(--color-turquesa-claro))", size = 60 }: ThreeDShapeProps) {
  // Default color changed to a soft turquoise
  let ShapeComponent;
  switch (type) {
    case "sphere":
      ShapeComponent = SphereSvg;
      break;
    case "polyhedron":
      ShapeComponent = PolyhedronSvg;
      break;
    case "crystal":
      ShapeComponent = CrystalSvg;
      break;
    default:
      return null;
  }

  return (
    <div className={cn("animate-float", className)}>
      <ShapeComponent color={color} size={size} />
    </div>
  );
}
