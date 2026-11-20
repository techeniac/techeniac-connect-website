import React from 'react';

export const Tagline: React.FC = () => {
  return (
    <div className="tagline-row" aria-label="Think. Build. Grow.">
      <span className="tagline-line" aria-hidden="true"></span>
      <div className="tagline-text">
        <span>Think</span>
        <span className="tagline-dot" aria-hidden="true"></span>
        <span>Build</span>
        <span className="tagline-dot" aria-hidden="true"></span>
        <span>Grow</span>
      </div>
      <span className="tagline-line" aria-hidden="true"></span>
    </div>
  );
};
