import { udToDec } from '@urbit/api';
import bigInt, { BigInteger } from 'big-integer';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelect, useValue } from 'react-cosmos/client';
import { MemoryRouter } from 'react-router';
import { VirtuosoHandle } from 'react-virtuoso';
import BTree from 'sorted-btree';
import { useIsScrolling } from '@/logic/scroll';
import { MessageFetchState } from '@/logic/useChatScrollerItems';
import { ChatScrollerQuery } from '@/logic/useChatScrollerQuery';
import { ChatMessage, ChatStory, ChatWrit } from '@/types/chat';
import ChatScroller from './ChatScroller';
import messageData from './fixtureMessages.json';

// Keys
const allMessages = Object.entries(messageData)
  .map<[BigInteger, ChatWrit]>(([k, v]) => [bigInt(udToDec(k)), v])
  .sort(([a], [b]) => b.compare(a));

const loadMessages = (start: number, end: number) =>
  allMessages.slice(start, end);

const createMessageTree = (messages: [BigInteger, ChatWrit][]) =>
  new BTree(messages, (a, b) => a.compare(b));

const initialLoadSize = 50;
const pageLoadSize = 100;
const startIndex = Math.round(allMessages.length / 2);

const messagesToSend = allMessages.slice(0, 100);

function isStoryMessage(message: ChatMessage): message is { story: ChatStory } {
  return 'story' in message;
}

function useMockMessageQuery() {
  const [scenario] = useSelect('Scenario', {
    options: ['normal', 'scrollTo', 'empty', 'short'],
    defaultValue: 'scrollTo',
  });
  const range = useRef({ low: startIndex, high: startIndex + initialLoadSize });
  const [messages, setMessages] = useState(() =>
    createMessageTree(loadMessages(startIndex, startIndex + initialLoadSize))
  );
  const [hasLoadedNewest, setHasLoadedNewest] = useValue<boolean>(
    'Has loaded newest',
    {
      defaultValue: true,
    }
  );

  const [hasLoadedOldest, setHasLoadedOldest] = useValue<boolean>(
    'Has loaded oldest',
    {
      defaultValue: false,
    }
  );
  const [scrollTo, setScrollTo] = useState<BigInteger | null>(null);

  useEffect(() => {
    if (
      scenario === 'scrollTo' ||
      scenario === 'normal' ||
      scenario === 'short'
    ) {
      const loadSize = scenario === 'short' ? 3 : initialLoadSize;
      const low = Math.round(allMessages.length / 2) - loadSize / 2;
      const high = low + loadSize;
      range.current = { high, low };
      const nextMessages = loadMessages(low, high);
      setMessages(createMessageTree(nextMessages));
      setHasLoadedNewest(false);
      setHasLoadedOldest(false);

      if (scenario === 'scrollTo') {
        const anchor = Math.floor(nextMessages.length / 2);
        setScrollTo(nextMessages[anchor][0]);
      }
      if (scenario === 'normal') {
        setScrollTo(null);
        setHasLoadedNewest(true);
      }
      if (scenario === 'short') {
        setScrollTo(null);
        setHasLoadedNewest(true);
        setHasLoadedOldest(true);
      }
    } else {
      setMessages(createMessageTree([]));
      setHasLoadedNewest(true);
      setHasLoadedOldest(true);
    }
  }, [scenario, setHasLoadedNewest, setHasLoadedOldest]);

  const [loadTime] = useValue('Load time', { defaultValue: 1000 });

  const [fetchState, setFetchState] = useSelect('Fetch State', {
    options: ['initial', 'top', 'bottom'],
    defaultValue: 'initial',
  });

  const sendMessage = useCallback(() => {
    const next = messagesToSend.pop();
    if (next) {
      setMessages((currentMessages) => currentMessages.withPairs([next], true));
    }
  }, []);

  const enlargeMessage = useCallback(
    (index: number) => {
      const key = messages.keysArray()[index];
      const writ = messages.get(key);
      const newWrit = JSON.parse(JSON.stringify(writ)) as typeof writ;
      if (newWrit && isStoryMessage(newWrit.memo.content)) {
        newWrit.memo.content.story.inline = [
          ...newWrit.memo.content.story.inline,
          { break: null },
          'extra line',
        ];
        const nextMessages = messages.clone();
        nextMessages.delete(key);
        nextMessages.set(key, newWrit);
        setMessages(nextMessages);
      } else {
        console.warn("couldn't enlarge, no writ or not a story", writ);
      }
    },
    [messages]
  );

  const simulateFetch = useCallback(
    (type: MessageFetchState) => {
      setFetchState(type);
      setTimeout(() => {
        let start: number;
        let end: number;
        if (type === 'top') {
          start = range.current.high;
          end = range.current.high + pageLoadSize;
        } else {
          start = range.current.low - pageLoadSize;
          end = range.current.low;
        }
        const newMessages = loadMessages(start, end);
        setMessages((currentMessages) =>
          currentMessages.withPairs(newMessages, false)
        );
        range.current.high = Math.max(end, range.current.high);
        range.current.low = Math.min(start, range.current.low);
        setFetchState('initial');
      }, loadTime);
    },
    [loadTime, setFetchState]
  );

  const fetchOlder = useCallback(() => {
    simulateFetch('top');
  }, [simulateFetch]);

  const fetchNewer = useCallback(() => {
    simulateFetch('bottom');
  }, [simulateFetch]);

  const query = useMemo(
    () => ({
      fetchState,
      fetchOlder,
      fetchNewer,
      hasLoadedNewest,
      hasLoadedOldest,
    }),
    [fetchState, fetchOlder, fetchNewer, hasLoadedNewest, hasLoadedOldest]
  );
  const utils = useMemo(
    () => ({ sendMessage, enlargeMessage }),
    [sendMessage, enlargeMessage]
  );
  return [query, messages, utils, scrollTo] as [
    ChatScrollerQuery,
    BTree<BigInteger, ChatWrit>,
    { sendMessage: () => void; enlargeMessage: (index: number) => void },
    BigInteger | null
  ];
}

export default function ChatScrollerFixture() {
  const scrollerRef = useRef<VirtuosoHandle>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const isScrolling = useIsScrolling(scrollElementRef);
  const [query, messages, { sendMessage, enlargeMessage }, scrollTo] =
    useMockMessageQuery();

  const enlargeBottomMessage = useCallback(() => {
    enlargeMessage(messages.length - 1);
  }, [enlargeMessage, messages]);

  const enlargeTopMessage = useCallback(() => {
    enlargeMessage(0);
  }, [enlargeMessage]);

  const buttonCn = 'bg-gray-50 rounded-xl p-2';

  return (
    <MemoryRouter>
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className={'flex-1'}>
          <ChatScroller
            query={query}
            whom={'test'}
            scrollTo={scrollTo ?? undefined}
            showDebugOverlay={true}
            messages={messages}
            scrollerRef={scrollerRef}
            scrollElementRef={scrollElementRef}
            isScrolling={isScrolling}
          />
        </div>
        <div className="flex w-full gap-1 overflow-auto bg-gray-100 p-2">
          <button className={buttonCn} onClick={sendMessage}>
            Simulate message
          </button>
          <button className={buttonCn} onClick={() => query.fetchOlder()}>
            Fetch older
          </button>
          <button className={buttonCn} onClick={() => query.fetchNewer()}>
            Fetch newer
          </button>
          {/* <button className={buttonCn} onClick={scrollToRandom}>
            Scroll to random
          </button> */}
          <button className={buttonCn} onClick={enlargeBottomMessage}>
            Enlarge bottom message
          </button>
          <button className={buttonCn} onClick={enlargeTopMessage}>
            Enlarge top message
          </button>
        </div>
      </div>
    </MemoryRouter>
  );
}
