import React, { PropsWithChildren } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

export default function ChatLoader({
  className,
  scaleY,
  children,
}: PropsWithChildren<{ className?: string; scaleY: number }>) {
  return (
    <div
      className={`absolute flex w-full justify-start text-base ${className}`}
      style={{ transform: `scaleY(${scaleY})` }}
    >
      <div className="m-4 flex items-center gap-3 rounded-lg text-gray-500">
        <div className="flex h-6 w-6 items-center justify-center">
          <LoadingSpinner primary="fill-gray-900" secondary="fill-gray-200" />
        </div>

        {children}
      </div>
    </div>
  );
}
