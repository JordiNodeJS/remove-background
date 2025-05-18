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
      {/* Rastro del caracol */}
      <rect
        x="24"
        y="14"
        width={trailWidth}
        height="4"
        rx="2"
        fill={color}
        opacity="0.2"
      />

      {/* Concha del caracol (ahora a la izquierda) */}
      <path
        d={`M${positionX - 12},15 A6,6 0 1,1 ${positionX - 6},15 A6,6 0 1,1 ${positionX - 12},15`}
        fill={bg}
        stroke={color}
        strokeWidth="1"
      />
      
      {/* Espiral de la concha */}
      <path
        d={`M${positionX - 9},15 A3,3 0 1,1 ${positionX - 6},15 A3,3 0 1,1 ${positionX - 9},15`}
        stroke={color}
        strokeWidth="0.5"
        fill="none"
      />

      {/* Cuerpo del caracol (ahora extendido hacia la derecha) */}
      <path
        d={`M${positionX - 6},16 Q${positionX - 3},14 ${positionX},14 T${positionX + 6},16 T${positionX},18 T${positionX - 6},16`}
        fill={color}
      />

      {/* Antenas */}
      <line
        x1={positionX + 4}
        y1={14}
        x2={positionX + 6}
        y2={10}
        stroke={color}
        strokeWidth="1"
      />
      <line
        x1={positionX + 1}
        y1={14}
        x2={positionX + 1}
        y2={10}
        stroke={color}
        strokeWidth="1"
      />

      {/* Puntos en las antenas */}
      <circle cx={positionX + 6} cy={10} r="0.8" fill={color} />
      <circle cx={positionX + 1} cy={10} r="0.8" fill={color} />

      {/* Ojos */}
      <circle cx={positionX + 2} cy={14} r="1" fill={bg} />
      <circle cx={positionX + 2} cy={14} r="0.5" fill={color} />
    </svg>
  );
}
