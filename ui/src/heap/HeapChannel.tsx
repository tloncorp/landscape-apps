import { useCallback, useEffect, useState, useMemo } from 'react';
import cn from 'classnames';
import { Outlet, useParams, useNavigate } from 'react-router';
import { Helmet } from 'react-helmet';
import bigInt from 'big-integer';
import { VirtuosoGrid } from 'react-virtuoso';
import { ViewProps } from '@/types/groups';
import Layout from '@/components/Layout/Layout';
import {
  useRouteGroup,
  useChannel,
  useGroup,
  useVessel,
} from '@/state/groups/groups';
import {
  useHeapPerms,
  useMarkHeapReadMutation,
  useJoinHeapMutation,
  useInfiniteCurioBlocks,
} from '@/state/heap/heap';
import { useHeapSortMode, useHeapDisplayMode } from '@/state/settings';
import HeapBlock from '@/heap/HeapBlock';
import HeapRow from '@/heap/HeapRow';
import useDismissChannelNotifications from '@/logic/useDismissChannelNotifications';
import { canReadChannel, canWriteChannel } from '@/logic/utils';
import { GRID, HeapCurio } from '@/types/heap';
import useRecentChannel from '@/logic/useRecentChannel';
import { useIsMobile } from '@/logic/useMedia';
import { useLastReconnect } from '@/state/local';
import { useChannelIsJoined } from '@/logic/channel';
import NewCurioForm from './NewCurioForm';
import HeapHeader from './HeapHeader';
import HeapPlaceholder from './HeapPlaceholder';

function HeapChannel({ title }: ViewProps) {
  const [joining, setJoining] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { chShip, chName } = useParams();
  const chFlag = `${chShip}/${chName}`;
  const nest = `heap/${chFlag}`;
  const flag = useRouteGroup();
  const vessel = useVessel(flag, window.our);
  const channel = useChannel(flag, nest);
  const group = useGroup(flag);
  const { setRecentChannel } = useRecentChannel(flag);
  const displayMode = useHeapDisplayMode(chFlag);
  // for now sortMode is not actually doing anything.
  // need input from design/product on what we want it to actually do, it's not spelled out in figma.
  const sortMode = useHeapSortMode(chFlag);
  const { curios, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteCurioBlocks(chFlag);
  const { mutateAsync: markRead } = useMarkHeapReadMutation();
  const { mutateAsync: joinHeap } = useJoinHeapMutation();
  const perms = useHeapPerms(chFlag);
  const canWrite = canWriteChannel(perms, vessel, group?.bloc);
  const canRead = channel
    ? canReadChannel(channel, vessel, group?.bloc)
    : false;
  const joined = useChannelIsJoined(nest);
  const lastReconnect = useLastReconnect();

  const joinChannel = useCallback(async () => {
    setJoining(true);
    await joinHeap({ group: flag, chan: chFlag });
    setJoining(false);
  }, [flag, chFlag, joinHeap]);

  const navigateToDetail = useCallback(
    (time: bigInt.BigInteger) => {
      navigate(`curio/${time}`);
    },
    [navigate]
  );

  useEffect(() => {
    if (!joined) {
      joinChannel();
    }
  }, [joined, joinChannel, channel]);

  useEffect(() => {
    if (joined && !joining && channel && canRead) {
      setRecentChannel(nest);
    }
  }, [
    chFlag,
    nest,
    setRecentChannel,
    joined,
    joining,
    channel,
    canRead,
    lastReconnect,
  ]);

  useEffect(() => {
    if (channel && !canRead) {
      navigate(`/groups/${flag}`);
      setRecentChannel('');
    }
  }, [flag, group, channel, vessel, navigate, setRecentChannel, canRead]);
  useDismissChannelNotifications({
    nest,
    markRead: useCallback(() => markRead({ flag: chFlag }), [markRead, chFlag]),
  });

  const renderCurio = useCallback(
    (i: number, curio: HeapCurio, time: bigInt.BigInteger) => (
      // i === 0 && canWrite ? (
      //   <NewCurioForm />
      // ) : (
      //   <div key={time.toString()} tabIndex={0} className="cursor-pointer">
      //     {displayMode === GRID ? (
      //       <div className="aspect-h-1 aspect-w-1">
      //         <HeapBlock curio={curio} time={time.toString()} />
      //       </div>
      //     ) : (
      //       <div onClick={() => navigateToDetail(time)}>
      //         <HeapRow
      //           key={time.toString()}
      //           curio={curio}
      //           time={time.toString()}
      //         />
      //       </div>
      //     )}
      //   </div>
      // ),
      <div key={time.toString()} tabIndex={0} className="cursor-pointer">
        {displayMode === GRID ? (
          <div className="aspect-h-1 aspect-w-1">
            <HeapBlock curio={curio} time={time.toString()} />
          </div>
        ) : (
          <div onClick={() => navigateToDetail(time)}>
            <HeapRow
              key={time.toString()}
              curio={curio}
              time={time.toString()}
            />
          </div>
        )}
      </div>
    ),
    [displayMode, navigateToDetail]
  );

  const getCurioTitle = (curio: HeapCurio) =>
    curio.heart.title ||
    curio.heart.content.toString().split(' ').slice(0, 3).join(' ');

  const emptyCurio: HeapCurio = {
    heart: {
      title: 'Loading...',
      content: {
        inline: [],
        block: [],
      },
      author: '',
      sent: 0,
      replying: null,
    },
    seal: {
      time: bigInt(0).toString(),
      feels: {
        '': '',
      },
      replied: [''],
    },
  };

  // const fakeCurioMap: [bigInt.BigInteger, HeapCurio][] = [
  //   [bigInt(1), emptyCurio],
  // ];

  // const sortedCurios = fakeCurioMap.concat(
  //   Array.from(curios)
  //     .sort(([a], [b]) => {
  //       if (sortMode === 'time') {
  //         return b.compare(a);
  //       }
  //       if (sortMode === 'alpha') {
  //         const curioA = curios.get(a);
  //         const curioB = curios.get(b);

  //         return getCurioTitle(curioA).localeCompare(getCurioTitle(curioB));
  //       }
  //       return b.compare(a);
  //     })
  //     .filter(([, c]) => !c.heart.replying) // defensive, they should all be blocks
  // );

  const empty = useMemo(() => Array.from(curios).length === 0, [curios]);
  const sortedCurios = Array.from(curios)
    .sort(([a], [b]) => {
      if (sortMode === 'time') {
        return b.compare(a);
      }
      if (sortMode === 'alpha') {
        const curioA = curios.get(a);
        const curioB = curios.get(b);

        return getCurioTitle(curioA).localeCompare(getCurioTitle(curioB));
      }
      return b.compare(a);
    })
    .filter(([, c]) => !c.heart.replying); // defensive, they should all be blocks

  const loadOlderCurios = useCallback(
    (atBottom: boolean) => {
      if (atBottom && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  const computeItemKey = (
    _i: number,
    [time, _curio]: [bigInt.BigInteger, HeapCurio]
  ) => time.toString();

  const thresholds = {
    atBottomThreshold: isMobile ? 125 : 250,
    atTopThreshold: isMobile ? 1200 : 2500,
    overscan: isMobile
      ? { main: 200, reverse: 200 }
      : { main: 400, reverse: 400 },
  };

  return (
    <Layout
      className="flex-1 bg-white pt-4 sm:pt-0"
      aside={<Outlet />}
      header={
        <HeapHeader
          flag={flag}
          nest={nest}
          display={displayMode}
          sort={sortMode}
          canWrite={canWrite}
        />
      }
    >
      <Helmet>
        <title>
          {channel && group
            ? `${channel.meta.title} in ${group.meta.title} ${title}`
            : title}
        </title>
      </Helmet>
      <div className="h-full bg-gray-50 p-4">
        {empty && isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <HeapPlaceholder count={8} />
          </div>
        ) : (
          <VirtuosoGrid
            data={sortedCurios}
            itemContent={(i, [time, curio]) => renderCurio(i, curio, time)}
            computeItemKey={computeItemKey}
            style={{ height: '100%', width: '100%', paddingTop: '1rem' }}
            atBottomStateChange={loadOlderCurios}
            listClassName={cn(
              `heap-${displayMode}`,
              displayMode === 'grid' && 'grid-cols-minmax'
            )}
            {...thresholds}
          />
        )}
      </div>
    </Layout>
  );
}

export default HeapChannel;
