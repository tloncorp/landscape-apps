import { daToUnix } from '@urbit/api';
import React, { ReactElement } from 'react';
import { ChatScrollerMessageItem } from '@/logic/useChatScrollerItems';
import ChatMessage from '../ChatMessage/ChatMessage';
import ChatNotice from '../ChatNotice';

export interface CustomScrollItemData {
  type: 'custom';
  key: string;
  component: ReactElement;
}

export const ChatScrollerListItem = React.memo(
  ({
    item,
    isScrolling,
  }: {
    item: ChatScrollerMessageItem | CustomScrollItemData;
    isScrolling: boolean;
  }) => {
    if (item.type === 'custom') {
      return item.component;
    }

    const { writ, time } = item.message;
    const content = writ?.memo?.content ?? {};
    if ('notice' in content) {
      return (
        <ChatNotice
          key={writ.seal.id}
          writ={writ}
          newDay={new Date(daToUnix(time))}
        />
      );
    }

    return (
      <ChatMessage
        key={writ.seal.id}
        isScrolling={isScrolling}
        {...item.message}
      />
    );
  }
);
