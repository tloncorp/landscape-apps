import { BigInteger } from 'big-integer';
import useNest from '@/logic/useNest';
import { useGroup, useRouteGroup, useVessel } from '@/state/groups/groups';
import { useHeapPerms } from '@/state/heap/heap';
import { canWriteChannel, nestToFlag } from '@/logic/utils';
import { HeapCurioMap } from '@/types/heap';
import HeapDetailCommentField from './HeapDetailCommentField';
import HeapComment from './HeapComment';

interface HeapDetailCommentsProps {
  time: BigInteger;
  comments: HeapCurioMap;
}

export default function HeapDetailComments({
  time,
  comments,
}: HeapDetailCommentsProps) {
  const nest = useNest();
  const flag = useRouteGroup();
  const group = useGroup(flag);
  const [, chFlag] = nestToFlag(nest);
  const stringTime = time.toString();
  const perms = useHeapPerms(chFlag);
  const vessel = useVessel(flag, window.our);
  const canWrite = canWriteChannel(perms, vessel, group?.bloc);
  const sortedComments = Array.from(comments).sort(([a], [b]) => a.compare(b));

  return (
    <>
      <div className="mx-4 mb-2 flex flex-col space-y-2 overflow-y-auto lg:flex-1">
        {sortedComments.map(([id, curio]) => (
          <HeapComment
            key={id.toString()}
            curio={curio}
            parentTime={stringTime}
            time={id.toString()}
          />
        ))}
      </div>
      {canWrite ? <HeapDetailCommentField /> : null}
    </>
  );
}
