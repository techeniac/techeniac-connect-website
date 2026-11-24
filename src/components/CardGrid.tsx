import React from 'react';
import { CardItem } from './CardItem';
import { CardItemData } from '../types';

const websiteCard: CardItemData = {
  id: 'website',
  microLabel: 'VISIT US',
  title: 'techeniac.com',
  href: 'https://techeniac.com/',
  isExternal: true,
  isFullWidth: true,
  tooltip: 'Visit TechEniac Website',
  icon: 'website',
};

const row2Cards: CardItemData[] = [
  {
    id: 'contact',
    microLabel: 'CONTACT',
    title: '+91 81400 85842',
    href: 'tel:+918140085842',
    isExternal: false,
    tooltip: 'Contact: +91 81400 85842',
    icon: 'phone',
  },
  {
    id: 'career',
    microLabel: 'CAREER',
    title: '+91 84012 84730',
    href: 'tel:+918401284730',
    isExternal: false,
    tooltip: 'Career: +91 84012 84730',
    icon: 'users',
  },
];

const row3Cards: CardItemData[] = [
  {
    id: 'linkedin',
    microLabel: 'LINKEDIN',
    title: 'TechEniac Services LLP.',
    href: 'https://www.linkedin.com/company/techeniac-services-llp/',
    isExternal: true,
    tooltip: 'LinkedIn: TechEniac Services LLP.',
    icon: 'linkedin',
  },
  {
    id: 'instagram',
    microLabel: 'INSTAGRAM',
    title: 'life_at_techeniac',
    href: 'https://www.instagram.com/life_at_techeniac',
    isExternal: true,
    tooltip: 'Instagram: life_at_techeniac',
    icon: 'instagram',
  },
];

const row4Cards: CardItemData[] = [
  {
    id: 'whatsapp',
    microLabel: 'WHATSAPP',
    title: '+91 81400 85842',
    href: 'https://api.whatsapp.com/send?phone=+918140085842&text=Hello',
    isExternal: true,
    tooltip: 'WhatsApp: +91 81400 85842',
    icon: 'whatsapp',
  },
  {
    id: 'email',
    microLabel: 'EMAIL',
    title: 'buzz@techeniac.com',
    href: 'mailto:buzz@techeniac.com',
    isExternal: false,
    tooltip: 'Email: buzz@techeniac.com',
    icon: 'email',
  },
];

export const CardGrid: React.FC = () => {
  return (
    <section className="cards-layout-group">
      {/* Row 1: Website Full Width */}
      <CardItem data={websiteCard} />

      {/* Row 2: Contact & Career */}
      <div className="cards-grid-row">
        {row2Cards.map((c) => (
          <CardItem key={c.id} data={c} />
        ))}
      </div>

      {/* Row 3: LinkedIn & Instagram */}
      <div className="cards-grid-row">
        {row3Cards.map((c) => (
          <CardItem key={c.id} data={c} />
        ))}
      </div>

      {/* Row 4: WhatsApp & Email */}
      <div className="cards-grid-row">
        {row4Cards.map((c) => (
          <CardItem key={c.id} data={c} />
        ))}
      </div>
    </section>
  );
};
