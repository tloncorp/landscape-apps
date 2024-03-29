import React from 'react';

import { IconProps } from './icon';

export default function MenuIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        className="fill-current"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 6c0-.55228.44772-1 1-1h12c.5523 0 1 .44772 1 1s-.4477 1-1 1H6c-.55228 0-1-.44772-1-1Zm0 6c0-.5523.44772-1 1-1h12c.5523 0 1 .4477 1 1s-.4477 1-1 1H6c-.55228 0-1-.4477-1-1Zm1 5c-.55228 0-1 .4477-1 1s.44772 1 1 1h12c.5523 0 1-.4477 1-1s-.4477-1-1-1H6Z"
      />
    </svg>
  );
}
