import { cn } from "@/lib/utils";

interface ThreeDShapeProps {
  type: "sphere" | "polyhedron" | "crystal";
  className?: string;
  color?: string; // Allows overriding default metallic gold
  size?: number; // Approx size in pixels
}

// Basic SVG Sphere
const SphereSvg = ({ color, size }: { color: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="sphereGradient" cx="30%" cy="30%" r="70%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--color-dorado-metalico)/0.8)', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: color, stopOpacity: 1 }} />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#sphereGradient)" />
    <circle cx="50" cy="50" r="45" fill="transparent" stroke={color} strokeWidth="1" opacity="0.5"/>
  </svg>
);

// Basic SVG Polyhedron (Cube-like)
const PolyhedronSvg = ({ color, size }: { color: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
       <linearGradient id="polyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--color-dorado-metalico)/0.7)', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: color, stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect x="15" y="15" width="70" height="70" fill="url(#polyGradient)" stroke={color} strokeWidth="1.5" transform="rotate(10 50 50)" opacity="0.9" />
     <path d="M15 15 L45 5 L85 15 L55 25 Z" fill={color} opacity="0.6" transform="rotate(10 50 50)" />
     <path d="M85 15 L85 85 L55 95 L55 25 Z" fill={color} opacity="0.4" transform="rotate(10 50 50)" />
  </svg>
);

// Basic SVG Crystal
const CrystalSvg = ({ color, size }: { color: string; size: number }) => (
 <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="crystalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: 'hsl(var(--color-lila-pastel))', stopOpacity: 0.7}} />
        <stop offset="50%" style={{stopColor: 'hsl(var(--color-rosa-claro))', stopOpacity: 0.5}} />
        <stop offset="100%" style={{stopColor: 'hsl(var(--color-azul-cielo-suave))', stopOpacity: 0.7}} />
      </linearGradient>
    </defs>
    <polygon points="50,5 20,30 30,70 70,70 80,30" fill="url(#crystalGradient)" stroke="hsl(var(--color-gris-translucido))" strokeWidth="1" />
    <polygon points="50,5 50,40 20,30" fill="hsl(var(--color-lila-pastel)/0.3)" />
    <polygon points="50,5 50,40 80,30" fill="hsl(var(--color-rosa-claro)/0.3)" />
    <polygon points="30,70 50,40 20,30" fill="hsl(var(--color-azul-cielo-suave)/0.3)" />
  </svg>
);


export default function ThreeDShape({ type, className, color = "hsl(var(--color-dorado-metalico))", size = 60 }: ThreeDShapeProps) {
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
