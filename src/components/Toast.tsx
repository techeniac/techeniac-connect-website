import React from 'react';
import { CheckIcon } from './Icons';

interface ToastProps {
  message: string;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, visible }) => {
  return (
    <div id="toast" className={`toast ${visible ? 'show' : ''}`} role="status" aria-live="polite">
      <CheckIcon />
      <span id="toast-text">{message}</span>
    </div>
  );
};
