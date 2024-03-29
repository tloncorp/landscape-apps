import React from 'react';

import { IconProps } from './icon';

export default function AddReactIcon({ className }: IconProps) {
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
        d="M6 4h10c1.3062 0 2.4175.83481 2.8293 2H20.9c-.4633-2.28224-2.481-4-4.9-4H6C3.23858 2 1 4.23858 1 7v10c0 2.7614 2.23858 5 5 5h10c2.419 0 4.4367-1.7178 4.9-4h-2.0707c-.4118 1.1652-1.5231 2-2.8293 2H6c-1.65685 0-3-1.3431-3-3V7c0-1.65685 1.34315-3 3-3Zm-.5 4C4.67157 8 4 8.67157 4 9.5v1c0 .8284.67157 1.5 1.5 1.5S7 11.3284 7 10.5v-1C7 8.67157 6.32843 8 5.5 8ZM11 9.5c0-.82843.6716-1.5 1.5-1.5s1.5.67157 1.5 1.5v1c0 .8284-.6716 1.5-1.5 1.5s-1.5-.6716-1.5-1.5v-1ZM10 15c0 .5523-.44772 1-1 1s-1-.4477-1-1 .44772-1 1-1 1 .4477 1 1Zm2 0c0 1.6569-1.3431 3-3 3-1.65685 0-3-1.3431-3-3s1.34315-3 3-3c1.6569 0 3 1.3431 3 3Zm8-6c0-.55228-.4477-1-1-1s-1 .44772-1 1v2h-2c-.5523 0-1 .4477-1 1s.4477 1 1 1h2v2c0 .5523.4477 1 1 1s1-.4477 1-1v-2h2c.5523 0 1-.4477 1-1s-.4477-1-1-1h-2V9Z"
      />
    </svg>
  );
}
