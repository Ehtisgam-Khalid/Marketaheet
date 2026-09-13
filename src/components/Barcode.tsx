import React from 'react';

interface BarcodeProps {
  value: string;
  className?: string;
}

export const Barcode: React.FC<BarcodeProps> = ({ value, className = '' }) => {
  // Generate deterministic bar widths based on the input text
  const bars: number[] = [];
  const str = (value || '00197151-33454').toUpperCase();

  // Start guard
  bars.push(3, 1, 2, 1);

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    const b1 = (code % 3) + 1;
    const b2 = ((code >> 1) % 3) + 1;
    const b3 = ((code >> 2) % 4) + 1;
    const b4 = ((code >> 3) % 2) + 1;
    bars.push(b1, b2, b3, b4);
  }

  // End guard
  bars.push(2, 1, 3, 1, 2);

  const totalWidth = bars.reduce((a, b) => a + b, 0);

  let currentX = 0;
  const rects: { x: number; width: number; isBlack: boolean }[] = [];

  bars.forEach((w, idx) => {
    const isBlack = idx % 2 === 0;
    if (isBlack) {
      rects.push({ x: currentX, width: w, isBlack });
    }
    currentX += w;
  });

  return (
    <div className={`inline-block ${className}`}>
      <svg
        viewBox={`0 0 ${totalWidth} 42`}
        className="w-full h-9 md:h-11 object-fill"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {rects.map((r, i) => (
          <rect
            key={i}
            x={r.x}
            y="0"
            width={r.width}
            height="42"
            fill="#111111"
          />
        ))}
      </svg>
    </div>
  );
};
