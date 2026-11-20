import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="header-row">
      <a
        href="https://techeniac.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="logo-link"
        title="TechEniac"
      >
        <img
          src="/logos/logo.svg"
          alt="TechEniac Logo"
          className="logo-img"
          data-site-logo
        />
      </a>
    </header>
  );
};
