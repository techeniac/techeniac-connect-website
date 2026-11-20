import React, { useRef } from 'react';
import { CardItemData } from '../types';
import {
  ArrowIcon,
  WebsiteIcon,
  LinkedInIcon,
  InstagramIcon,
  PhoneIcon,
  UsersIcon,
  WhatsAppIcon,
  EmailIcon,
} from './Icons';

interface CardItemProps {
  data: CardItemData;
}

export const CardItem: React.FC<CardItemProps> = ({ data }) => {
  const cardRef = useRef<HTMLAnchorElement | null>(null);

  const updateTouchPosition = (clientX: number, clientY: number) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--touch-x', `${(clientX - r.left).toFixed(1)}px`);
    card.style.setProperty('--touch-y', `${(clientY - r.top).toFixed(1)}px`);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    card.classList.add('is-touching');
    updateTouchPosition(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    updateTouchPosition(e.clientX, e.clientY);
  };

  const endTouch = () => {
    const card = cardRef.current;
    if (!card) return;
    card.classList.remove('is-touching');
  };

  const renderIcon = () => {
    switch (data.icon) {
      case 'website':
        return <WebsiteIcon />;
      case 'linkedin':
        return <LinkedInIcon />;
      case 'instagram':
        return <InstagramIcon />;
      case 'phone':
        return <PhoneIcon />;
      case 'users':
        return <UsersIcon />;
      case 'whatsapp':
        return <WhatsAppIcon />;
      case 'email':
        return <EmailIcon />;
    }
  };

  const cardClass = `card ${data.isFullWidth ? 'card-full' : 'card-grid-item'}`;

  return (
    <a
      ref={cardRef}
      href={data.href}
      target={data.isExternal ? '_blank' : undefined}
      rel={data.isExternal ? 'noopener noreferrer' : undefined}
      className={cardClass}
      title={data.tooltip}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endTouch}
      onPointerCancel={endTouch}
      onMouseLeave={endTouch}
    >
      <div className="card-left">
        <div className="icon-circle">{renderIcon()}</div>
        <div className="card-text-col">
          <span className="micro-label">{data.microLabel}</span>
          <div className="card-title">{data.title}</div>
        </div>
      </div>
      <ArrowIcon />
    </a>
  );
};
