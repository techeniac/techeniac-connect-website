import React from 'react';
import { PinIcon } from './Icons';

interface FooterProps {
  onAddressClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAddressClick }) => {
  return (
    <footer className="footer-wave-section">
      <div className="waves-container" aria-hidden="true">
        <svg className="wave wave-back" viewBox="0 0 1440 180" preserveAspectRatio="none">
          <path
            d="M0,45 C320,110 540,10 820,60 C1100,110 1280,30 1440,55 L1440,180 L0,180 Z"
            fill="rgba(66, 94, 249, 0.40)"
          ></path>
        </svg>
        <svg className="wave wave-mid" viewBox="0 0 1440 180" preserveAspectRatio="none">
          <path
            d="M0,75 C240,20 520,115 800,45 C1080,-5 1260,95 1440,65 L1440,180 L0,180 Z"
            fill="rgba(48, 82, 245, 0.72)"
          ></path>
        </svg>
        <svg className="wave wave-front" viewBox="0 0 1440 180" preserveAspectRatio="none">
          <path
            d="M0,90 C340,30 620,120 900,60 C1160,10 1340,85 1440,75 L1440,180 L0,180 Z"
            fill="#2445F0"
          ></path>
        </svg>
      </div>

      <div className="footer-content">
        <a
          href="https://maps.app.goo.gl/b2dSdtUVqHBB3xsy8"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-address-link"
          title="Open Google Maps Location"
          onClick={() => onAddressClick?.()}
        >
          <div className="pin-icon-box">
            <PinIcon />
            <div className="pin-pulse"></div>
          </div>
          <div className="address-text-lines">
            <span>1501 Westport, near Taj Hotel, Sindhubhavan Road,</span>
            <span>Ahmedabad, Gujarat 380059.</span>
          </div>
        </a>
      </div>
    </footer>
  );
};
