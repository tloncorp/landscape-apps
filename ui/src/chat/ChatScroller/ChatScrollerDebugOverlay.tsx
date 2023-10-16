import cn from 'classnames';
import { MessageFetchState } from '@/logic/useChatScrollerItems';

function DebugBoolean({ label, value }: { label: string; value: boolean }) {
  return (
    <div className={cn(value ? 'bg-green' : 'bg-red')}>
      {value ? '✔' : '✘'} {label}
    </div>
  );
}

export default function ChatScrollerDebugOverlay({
  count,
  anchorIndex,
  scrollHeight,
  scrollOffset,
  hasLoadedNewest,
  hasLoadedOldest,
  isInverted,
  loadDirection,
  isAtScrollStart,
  isAtScrollEnd,
  isAtOldest,
  isAtNewest,
  fetchState,
  userHasScrolled,
}: {
  count: number;
  anchorIndex?: number | null;
  scrollOffset: number;
  scrollHeight: number;
  hasLoadedNewest: boolean;
  hasLoadedOldest: boolean;
  isInverted: boolean;
  loadDirection: 'newer' | 'older';
  isAtScrollStart: boolean;
  isAtScrollEnd: boolean;
  isAtOldest: boolean;
  isAtNewest: boolean;
  fetchState: MessageFetchState;
  userHasScrolled: boolean;
}) {
  return (
    <div
      className={cn(
        'align-end absolute right-0 top-0 flex flex-col items-end text-right'
      )}
    >
      <div
        className={cn(
          isInverted ? 'bg-black text-white' : 'bg-white text-black'
        )}
      >
        {isInverted ? 'Inverted ▲' : 'Not Inverted ▼'}
      </div>
      <div className={cn(anchorIndex !== null ? 'bg-orange' : 'bg-gray-100')}>
        {anchorIndex !== null ? `Anchor: ${anchorIndex}` : 'No anchor'}
      </div>
      <label>
        {Math.round(scrollOffset)}/{scrollHeight}
      </label>
      <label> {count} items</label>
      <DebugBoolean label="User scrolled" value={userHasScrolled} />
      <DebugBoolean label="At start" value={isAtScrollStart} />
      <DebugBoolean label="At end" value={isAtScrollEnd} />
      <DebugBoolean label="At newest" value={isAtNewest} />
      <DebugBoolean label="At oldest" value={isAtOldest} />
      <label>Top loader</label>
      <DebugBoolean label="Selected" value={loadDirection === 'older'} />
      <DebugBoolean label="Exhausted" value={hasLoadedOldest} />
      <DebugBoolean label="Fetching" value={fetchState === 'top'} />
      <label>Bottom loader</label>
      <DebugBoolean label="Selected" value={loadDirection === 'newer'} />
      <DebugBoolean label="Exhausted" value={hasLoadedNewest} />
      <DebugBoolean label="Fetching" value={fetchState === 'top'} />
    </div>
  );
}
