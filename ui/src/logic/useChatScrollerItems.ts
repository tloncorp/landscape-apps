import { daToUnix } from '@urbit/api';
import bigInt from 'big-integer';
import React, { useMemo, useRef } from 'react';
import BTree from 'sorted-btree';

import { ChatWrit } from '@/types/chat';

export type ChatWritTree = BTree<bigInt.BigInteger, ChatWrit>;

export type MessageFetchState = 'top' | 'bottom' | 'initial';

const DEBUG_FETCH = true;

export function fetchDebugMessage(...args: unknown[]) {
  if (DEBUG_FETCH) {
    console.log('[useFetchMessages]', ...args);
  }
}

interface ChatScrollerMessageData {
  writ: ChatWrit;
  time: bigInt.BigInteger;
  newAuthor: boolean;
  newDay: boolean;
  whom: string;
  isLast: boolean;
  isLinked: boolean;
  hideReplies: boolean;
}

export type ChatScrollerMessageItem = {
  key: bigInt.BigInteger;
  type: 'message';
  message: ChatScrollerMessageData;
};

interface KeyedChatWrit {
  key: bigInt.BigInteger;
  writ: ChatWrit;
}

export default function useChatScrollerItems({
  whom,
  scrollTo,
  messages,
  isThread,
}: {
  whom: string;
  scrollTo?: bigInt.BigInteger;
  messages: ChatWritTree;
  isThread: boolean;
}) {
  const messageDays = useRef(new Map<string, number>());

  const messageMeta = useMemo(() => {
    function getDay(id: string, time: bigInt.BigInteger) {
      let day = messageDays.current.get(id);
      if (!day) {
        day = new Date(daToUnix(time)).setHours(0, 0, 0, 0);
        messageDays.current.set(id, day);
      }
      return day;
    }

    function getWritMeta(
      { key, writ }: KeyedChatWrit,
      previous?: KeyedChatWrit
    ) {
      const { key: lastKey, writ: lastWrit } = previous ?? {};
      const meta = {
        writ,
        time: key,
        newAuthor: true,
        newDay: true,
      };
      if (lastWrit && lastKey) {
        const lastDay = getDay(lastWrit.seal.id, lastKey);
        const thisDay = getDay(writ.seal.id, key);
        if (lastDay === thisDay) {
          meta.newDay = false;
        }
        if (writ.memo.author === lastWrit.memo.author) {
          meta.newAuthor = false;
        }
      }
      return meta;
    }

    return messages.toArray().map(([key, writ]) => {
      const lastKey = messages.nextLowerKey(key);
      const lastWrit = lastKey ? messages.get(lastKey) : undefined;
      const previous =
        lastWrit && lastKey ? { key: lastKey, writ: lastWrit } : undefined;
      const meta = getWritMeta({ key, writ }, previous);
      return { key, meta };
    }, []);
  }, [messages]);

  const messageItems: ChatScrollerMessageItem[] = useMemo(
    () =>
      messageMeta.map(({ key, meta }, index) => ({
        key,
        type: 'message',
        message: {
          whom,
          isLast: index === messageMeta.length - 1,
          isLinked: !!scrollTo && (key?.eq(scrollTo) ?? false),
          hideReplies: isThread,
          ...meta,
        },
      })),
    [messageMeta, isThread, scrollTo, whom]
  );

  return messageItems;
}
