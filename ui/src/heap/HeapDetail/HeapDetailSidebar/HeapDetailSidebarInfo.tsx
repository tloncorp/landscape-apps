import React from 'react';
import { URL_REGEX } from '@/logic/utils';
import { HeapCurio } from '@/types/heap';
import Author from '@/chat/ChatMessage/Author';

interface HeapDetailSidebarProps {
  curio: HeapCurio;
}

export default function HeapDetailSidebarInfo({
  curio,
}: HeapDetailSidebarProps) {
  const { content, author, sent, title } = curio.heart;
  const unixDate = new Date(sent);
  const stringContent = content[0].toString();
  const textPreview = content.toString().split(' ').slice(0, 3).join(' ');
  const isURL = URL_REGEX.test(stringContent);

  return (
    <div className="flex w-full flex-col space-y-4 break-words border-b-2 border-gray-50 p-4">
      <div className="flex flex-col space-y-1">
        {title ||
          (!isURL && (
            <h2 className="whitespace-normal text-lg font-semibold line-clamp-2">
              {title && title}
              {!title && !isURL ? textPreview : null}
            </h2>
          ))}
        {isURL && (
          <a
            href={stringContent}
            target="_blank"
            rel="noreferrer"
            className="text-ellipsis break-all font-semibold text-gray-600 underline line-clamp-1"
          >
            {stringContent}
          </a>
        )}
      </div>
      <Author ship={author} date={unixDate} timeOnly />
    </div>
  );
}
