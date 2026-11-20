import React from 'react';

export const Watermarks: React.FC = () => {
  return (
    <>
      <img
        src="/logos/face.svg"
        className="bg-watermark-face"
        alt=""
        aria-hidden="true"
      />
      <img
        src="/logos/wing.svg"
        className="bg-watermark-wing"
        alt=""
        aria-hidden="true"
      />
    </>
  );
};
