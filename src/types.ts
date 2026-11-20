export type IconType =
  | 'website'
  | 'linkedin'
  | 'instagram'
  | 'phone'
  | 'users'
  | 'whatsapp'
  | 'email';

export interface CardItemData {
  id: string;
  microLabel: string;
  title: string;
  href: string;
  isExternal?: boolean;
  tooltip: string;
  icon: IconType;
  isFullWidth?: boolean;
}
