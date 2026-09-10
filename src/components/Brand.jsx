import React from 'react';
import logoHorizontal from '../assets/raify-logo-horizontal.png';
import logoStacked from '../assets/raify-logo-stacked.png';
export default function Brand({ variant = 'horizontal', className = '', compact = false }) {
  const src = variant === 'stacked' ? logoStacked : logoHorizontal;
  return (
    <img
      src={src}
      alt="RAIFY"
      className={`raify-logo ${compact ? 'raify-logo-compact' : ''} ${className}`}
    />
  );
}
