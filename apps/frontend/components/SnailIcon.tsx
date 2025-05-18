"use client";

interface SnailIconProps {
  positionX: number;
  trailWidth: number;
  bg: string;
  color: string;
}

export default function SnailIcon({ positionX, trailWidth, bg, color }: SnailIconProps) {

  return (
    <svg
      width="240"
      height="32"
      viewBox="0 0 240 32"
      fill="none"
      className="mt-2"
    >
      {/* Rastro del caracol con efecto gradiente */}
      <defs>
        <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.05" />
          <stop offset={`${Math.min((positionX - 24) / 216 * 100, 100)}%`} stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      
      {/* Rastro con textura de ondas */}
      <path
        d={`M24,16 
           ${Array.from({length: Math.floor(trailWidth / 6)}, (_, i) => {
             const x = 24 + i * 6;
             return `Q${x + 1.5},14 ${x + 3},16 Q${x + 4.5},18 ${x + 6},16`;
           }).join(' ')}
        `}
        stroke="url(#trailGradient)"
        strokeWidth="1.8"
        fill="none"
      />
      
      {/* Concha principal del caracol (más detallada) */}
      <ellipse
        cx={positionX - 9}
        cy={16}
        rx={7}
        ry={6}
        fill={bg}
        stroke={color}
        strokeWidth="1"
      />
      
      {/* Espiral exterior de la concha */}
      <path
        d={`M${positionX - 12},13 
           A7,7 0 0,1 ${positionX - 8},10.5 
           A5,5 0 0,1 ${positionX - 5},11 
           A4,4 0 0,1 ${positionX - 4},14`}
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      
      {/* Espiral interior de la concha */}
      <path
        d={`M${positionX - 10},14.5 
           A3,3 0 0,1 ${positionX - 8},13 
           A2,2 0 0,1 ${positionX - 6},13.5`}
        stroke={color}
        strokeWidth="0.7"
        fill="none"
      />
      
      {/* Cuerpo del caracol con más detalles anatómicos */}
      <path
        d={`M${positionX - 6},16 
           C${positionX - 3},14 ${positionX},14 ${positionX + 2},15.5 
           C${positionX + 4},17 ${positionX + 5},19 ${positionX + 3},19 
           C${positionX + 1},19 ${positionX},18 ${positionX - 3},17.5 
           C${positionX - 4},17 ${positionX - 5},16.5 ${positionX - 6},16`}
        fill={color}
      />
      
      {/* Base del cuerpo (parte inferior) */}
      <path
        d={`M${positionX - 6},17 
           C${positionX - 4},17.2 ${positionX - 2},17.5 ${positionX},17.5 
           C${positionX + 2},17.5 ${positionX + 3},18 ${positionX + 3},19`}
        stroke={color}
        strokeWidth="0.5"
        fill="none"
      />
      
      {/* Antenas (tentáculos oculares) */}
      <path
        d={`M${positionX + 2},15.5 C${positionX + 2.5},13 ${positionX + 3},11 ${positionX + 3.5},9.5`}
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      
      <path
        d={`M${positionX + 0.5},15 C${positionX + 0.7},13 ${positionX + 0.5},11.5 ${positionX + 0.3},10`}
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      
      {/* Tentáculos sensoriales más cortos */}
      <path
        d={`M${positionX + 1},16 C${positionX + 1.2},15 ${positionX + 1.3},14.2 ${positionX - 0.5},13.5`}
        stroke={color}
        strokeWidth="0.7"
        fill="none"
      />
      
      <path
        d={`M${positionX + 3},16 C${positionX + 3.2},15.2 ${positionX + 3.5},14.5 ${positionX + 5},14`}
        stroke={color}
        strokeWidth="0.7"
        fill="none"
      />
      
      {/* Ojos en las puntas de las antenas */}
      <circle cx={positionX + 3.5} cy={9.5} r="0.9" fill={bg} />
      <circle cx={positionX + 3.5} cy={9.5} r="0.45" fill={color} />
      
      <circle cx={positionX + 0.3} cy={10} r="0.9" fill={bg} />
      <circle cx={positionX + 0.3} cy={10} r="0.45" fill={color} />
      
      {/* Pequeños detalles de textura en la concha */}
      <path
        d={`M${positionX - 12},16 L${positionX - 11},15.5 M${positionX - 10},14 L${positionX - 9},13.5 M${positionX - 8},13 L${positionX - 7},12.5`}
        stroke={color}
        strokeWidth="0.5"
        opacity="0.7"
      />
      
      {/* Brillo en la concha */}
      <ellipse
        cx={positionX - 9}
        cy={14}
        rx={2}
        ry={1}
        fill="white"
        opacity="0.2"
      />
    </svg>
  );
}
