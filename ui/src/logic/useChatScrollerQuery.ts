import bigInt from 'big-integer';
import { useCallback, useMemo, useState } from 'react';
import { STANDARD_MESSAGE_FETCH_PAGE_SIZE } from '@/constants';
import { useChatState, useWritWindow } from '@/state/chat/chat';
import {
  MessageFetchState,
  ChatWritTree,
  fetchDebugMessage,
} from './useChatScrollerItems';

export interface ChatScrollerQuery {
  fetchState: MessageFetchState;
  fetchOlder: (count?: number) => Promise<void>;
  fetchNewer: (count?: number) => Promise<void>;
  hasLoadedNewest: boolean;
  hasLoadedOldest: boolean;
}

export default function useChatScrollerQuery({
  whom,
  messages,
  scrollTo,
  isThread,
}: {
  whom: string;
  messages: ChatWritTree;
  scrollTo?: bigInt.BigInteger;
  isThread?: boolean;
}): ChatScrollerQuery {
  const writWindow = useWritWindow(whom, scrollTo);
  const [fetchState, setFetchState] = useState<MessageFetchState>('initial');

  const fetchMessages = useCallback(
    async (newer: boolean, pageSize = STANDARD_MESSAGE_FETCH_PAGE_SIZE) => {
      fetchDebugMessage(
        'fetchMessages',
        newer ? 'newer' : 'older',
        'whom',
        whom,
        'scrolTo',
        scrollTo,
        pageSize
      );

      const newest = messages.maxKey();
      const seenNewest =
        newer && newest && writWindow && writWindow.loadedNewest;
      const oldest = messages.minKey();
      const seenOldest =
        !newer && oldest && writWindow && writWindow.loadedOldest;

      if (seenNewest || seenOldest) {
        fetchDebugMessage('skipping fetch, seen', newer ? 'newest' : 'oldest');
        return;
      }

      try {
        setFetchState(newer ? 'bottom' : 'top');
        if (newer) {
          fetchDebugMessage('load newer');
          const result = await useChatState
            .getState()
            .fetchMessages(whom, pageSize.toString(), 'newer', scrollTo);
          fetchDebugMessage('load result', result);
        } else {
          fetchDebugMessage('load older');
          const result = await useChatState
            .getState()
            .fetchMessages(whom, pageSize.toString(), 'older', scrollTo);
          fetchDebugMessage('load result', result);
        }

        setFetchState('initial');
      } catch (e) {
        setFetchState('initial');
      }
    },
    [whom, messages, scrollTo, writWindow]
  );

  const fetchNewer = useCallback(
    (count = STANDARD_MESSAGE_FETCH_PAGE_SIZE) => fetchMessages(true, count),
    [fetchMessages]
  );

  const fetchOlder = useCallback(
    (count = STANDARD_MESSAGE_FETCH_PAGE_SIZE) => fetchMessages(false, count),
    [fetchMessages]
  );

  return useMemo(
    () => ({
      fetchState,
      fetchOlder,
      fetchNewer,
      // If there's no writWindow, we've loaded the newest we can load
      hasLoadedNewest: writWindow?.loadedNewest ?? true,
      // Loading older is delegated to the main panel for chat threads.
      hasLoadedOldest: isThread ? true : writWindow?.loadedOldest ?? true,
    }),
    [
      fetchOlder,
      fetchNewer,
      fetchState,
      writWindow?.loadedNewest,
      writWindow?.loadedOldest,
      isThread,
    ]
  );
}
