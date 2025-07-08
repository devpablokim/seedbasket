import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* AI Brain/Circuit Background */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-20">
        <circle cx="20" cy="20" r="3" fill="#10b981" />
        <circle cx="80" cy="20" r="3" fill="#10b981" />
        <circle cx="20" cy="80" r="3" fill="#10b981" />
        <circle cx="80" cy="80" r="3" fill="#10b981" />
        <circle cx="50" cy="50" r="4" fill="#10b981" />
        <line x1="20" y1="20" x2="50" y2="50" stroke="#10b981" strokeWidth="1" />
        <line x1="80" y1="20" x2="50" y2="50" stroke="#10b981" strokeWidth="1" />
        <line x1="20" y1="80" x2="50" y2="50" stroke="#10b981" strokeWidth="1" />
        <line x1="80" y1="80" x2="50" y2="50" stroke="#10b981" strokeWidth="1" />
      </svg>
      
      {/* Seed/Plant Icon */}
      <div className="relative z-10 text-3xl">🌱</div>
      
      {/* AI Sparkles */}
      <div className="absolute -top-1 -right-1 text-xs">✨</div>
    </div>
  );
};

export default Logo;