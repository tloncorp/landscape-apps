import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import _ from 'lodash';
import bigInt from 'big-integer';
import { unstable_batchedUpdates as batchUpdates } from 'react-dom';
import produce, { setAutoFreeze } from 'immer';
import { BigIntOrderedMap, decToUd, udToDec, unixToDa } from '@urbit/api';
import {
  CurioDelta,
  Heap,
  HeapAction,
  HeapCurio,
  HeapDiff,
  HeapFlag,
  HeapSaid,
  HeapCreate,
  HeapCurios,
  HeapCurioMap,
  HeapCurioTuple,
  CurioHeart,
  HeapUpdate,
  HeapBriefs,
  Stash,
} from '@/types/heap';
import api from '@/api';
import { canWriteChannel, restoreMap } from '@/logic/utils';
import useNest from '@/logic/useNest';
import useReactQuerySubscription from '@/logic/useReactQuerySubscription';
import { CURIO_PAGE_SIZE } from '@/constants';
import { useGroup, useVessel } from '../groups';
import { createState } from '../base';

setAutoFreeze(false);
export interface HeapState {
  set: (fn: (sta: HeapState) => void) => void;
  batchSet: (fn: (sta: HeapState) => void) => void;
  pendingImports: Record<string, boolean>;
  initImports: (init: Record<string, boolean>) => void;
  [key: string]: unknown;
}

export const useHeapState = createState<HeapState>(
  'heap',
  (set, get) => ({
    set: (fn) => {
      set(produce(get(), fn));
    },
    batchSet: (fn) => {
      batchUpdates(() => {
        get().set(fn);
      });
    },
    pendingImports: {},
    initImports: (init) => {
      get().batchSet((draft) => {
        draft.pendingImports = init;
      });
    },
  }),
  {},
  []
);

function subscribeOnce<T>(app: string, path: string) {
  return new Promise<T>((resolve) => {
    api.subscribe({
      app,
      path,
      event: resolve,
    });
  });
}

function heapAction(flag: HeapFlag, diff: HeapDiff) {
  return {
    app: 'heap',
    mark: 'heap-action-0',
    json: {
      flag,
      update: {
        time: '',
        diff,
      },
    },
  };
}

function heapCurioDiff(flag: HeapFlag, time: string, delta: CurioDelta) {
  return heapAction(flag, {
    curios: {
      time,
      delta,
    },
  });
}

function getTime() {
  return decToUd(unixToDa(Date.now()).toString());
}

export function useHeapBriefs(): HeapBriefs {
  const emptyBriefs = useMemo(() => ({} as HeapBriefs), []);
  const { data, isLoading, isError } = useReactQuerySubscription({
    queryKey: ['heap', 'briefs'],
    app: 'heap',
    path: '/briefs',
    scry: '/briefs',
  });

  if (!data || isLoading || isError) {
    return emptyBriefs;
  }

  return data as HeapBriefs;
}

export function useHeapBrief(flag: HeapFlag) {
  const briefs = useHeapBriefs();
  return briefs[flag];
}

export function useStash(): Stash {
  const emptyStash = useMemo(() => ({} as Stash), []);
  const { data } = useReactQuerySubscription({
    queryKey: ['heap', 'stash'],
    app: 'heap',
    path: '/ui',
    scry: '/stash',
  });

  return data ? (data as Stash) : emptyStash;
}

export function useHeap(flag: HeapFlag): Heap | undefined {
  const stash = useStash();
  return stash[flag];
}

export function useHeapPerms(flag: HeapFlag) {
  const defaultPerms = useMemo(() => ({ writers: [] }), []);
  const stash = useStash();
  return stash[flag]?.perms || defaultPerms;
}

export function useCanWriteToHeap(groupFlag: string) {
  const group = useGroup(groupFlag);
  const vessel = useVessel(groupFlag, window.our);
  const nest = useNest();
  const perms = useHeapPerms(nest);
  const canWrite = canWriteChannel(perms, vessel, group?.bloc);

  return canWrite;
}

export function useHeapIsJoined(flag: HeapFlag) {
  const briefs = useHeapBriefs();
  return useMemo(() => _.has(briefs, flag), [flag, briefs]);
}

export function useCreateHeapMutation() {
  const queryClient = useQueryClient();

  const mutationFn = async (variables: HeapCreate) => {
    await api.trackedPoke<HeapCreate, HeapAction>(
      {
        app: 'heap',
        mark: 'heap-create',
        json: variables,
      },
      { app: 'heap', path: '/ui' },
      (event) => {
        const { update, flag } = event;
        return (
          'create' in update.diff && flag === `${window.our}/${variables.name}`
        );
      }
    );
  };

  return useMutation({
    mutationFn,
    onSettled: async () => {
      await queryClient.refetchQueries(['heap', 'briefs']);
      await queryClient.refetchQueries(['heap', 'stash']);
    },
  });
}

export function useAddHeapSectsMutation() {
  const queryClient = useQueryClient();

  const mutationFn = async ({
    flag,
    sects,
  }: {
    flag: HeapFlag;
    sects: string[];
  }) => {
    await api.poke(heapAction(flag, { 'add-sects': sects }));
  };

  return useMutation({
    mutationFn,
    onSettled: async () => {
      await queryClient.refetchQueries(['heap', 'stash']);
    },
  });
}

export function useDelHeapSectsMutation() {
  const queryClient = useQueryClient();

  const mutationFn = async ({
    flag,
    sects,
  }: {
    flag: HeapFlag;
    sects: string[];
  }) => {
    await api.poke(heapAction(flag, { 'del-sects': sects }));
  };

  return useMutation({
    mutationFn,
    onSettled: async () => {
      await queryClient.refetchQueries(['heap', 'stash']);
    },
  });
}

export function useAddCurioFeelMutation() {
  const queryClient = useQueryClient();

  const mutationFn = async ({
    flag,
    time,
    feel,
  }: {
    flag: HeapFlag;
    time: string;
    feel: string;
    replying?: string;
  }) => {
    const ud = decToUd(time);
    await api.poke(
      heapCurioDiff(flag, ud, {
        'add-feel': {
          time: ud,
          feel,
          ship: window.our,
        },
      })
    );
  };

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      if (variables.replying) {
        queryClient.cancelQueries([
          'heap',
          variables.flag,
          'curios',
          udToDec(variables.replying),
          'withComments',
        ]);
      }
    },
    onSettled: async (_data, _error, variables) => {
      if (variables.replying) {
        queryClient.refetchQueries([
          'heap',
          variables.flag,
          'curios',
          udToDec(variables.replying),
          'withComments',
        ]);
      }
    },
  });
}

export function useDelCurioFeelMutation() {
  const queryClient = useQueryClient();

  const mutationFn = async ({
    flag,
    time,
  }: {
    flag: HeapFlag;
    time: string;
    replying?: string;
  }) => {
    const ud = decToUd(time);
    await api.poke(heapCurioDiff(flag, ud, { 'del-feel': window.our }));
  };

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      if (variables.replying) {
        queryClient.cancelQueries([
          'heap',
          variables.flag,
          'curios',
          udToDec(variables.replying),
          'withComments',
        ]);
      }
    },
    onSettled: async (_data, _error, variables) => {
      if (variables.replying) {
        queryClient.refetchQueries([
          'heap',
          variables.flag,
          'curios',
          udToDec(variables.replying),
          'withComments',
        ]);
      }
    },
  });
}

export function useJoinHeapMutation() {
  const queryClient = useQueryClient();

  const mutationFn = async ({
    group,
    chan,
  }: {
    group: string;
    chan: string;
  }) => {
    await api.poke({
      app: 'heap',
      mark: 'channel-join',
      json: {
        group,
        chan,
      },
    });
  };

  return useMutation({
    mutationFn,
    onSettled: async (_data, _error, variables) => {
      await queryClient.refetchQueries(['heap', 'briefs']);
      await queryClient.refetchQueries(['heap', 'stash']);
    },
  });
}

export function useLeaveHeapMutation() {
  const queryClient = useQueryClient();

  const mutationFn = async (variables: { flag: HeapFlag }) => {
    await api.poke({
      app: 'heap',
      mark: 'heap-leave',
      json: variables.flag,
    });
  };

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries(['heap', 'stash']);
      await queryClient.cancelQueries(['heap', 'briefs']);
      await queryClient.cancelQueries(['heap', variables.flag]);

      queryClient.removeQueries(['heap', variables.flag]);
    },
    onSettled: async () => {
      await queryClient.refetchQueries(['heap', 'briefs']);
      await queryClient.refetchQueries(['heap', 'stash']);
    },
  });
}

function generateCurioMap(curios: HeapCurioTuple[]): HeapCurioMap {
  let curioMap = restoreMap<HeapCurio>({});
  curios
    .map(([k, curio]) => ({ tim: bigInt(udToDec(k)), curio }))
    .forEach(({ tim, curio }) => {
      curioMap = curioMap.set(tim, curio);
    });

  return curioMap;
}

function formatCurioResponse(curios: HeapCurios): HeapCurioTuple[] {
  return Object.entries(curios).sort((a, b) => {
    const aTime = bigInt(udToDec(a[0]));
    const bTime = bigInt(udToDec(b[0]));
    return bTime.compare(aTime);
  });
}

export function useInfiniteCurioBlocks(flag: HeapFlag) {
  const queryClient = useQueryClient();
  const def = useMemo(() => new BigIntOrderedMap<HeapCurio>(), []);
  const queryKey = useMemo(() => ['heap', flag, 'curios', 'infinite'], [flag]);

  const invalidate = useRef(
    _.debounce(
      () => {
        queryClient.invalidateQueries(queryKey);
      },
      300,
      { leading: true, trailing: true }
    )
  );

  useEffect(() => {
    api.subscribe({
      app: 'heap',
      path: `/heap/${flag}/ui`,
      event: invalidate.current,
    });
  }, [flag, invalidate]);

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const path = pageParam
        ? `/heap/${flag}/curios/older/${pageParam}/${CURIO_PAGE_SIZE}/blocks`
        : `/heap/${flag}/curios/newest/${CURIO_PAGE_SIZE}/blocks`;
      const response = await api.scry<HeapCurios>({
        app: 'heap',
        path,
      });
      return formatCurioResponse(response);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.length ? _.last(lastPage)![0] : undefined;
    },
    keepPreviousData: true,
    refetchOnMount: true,
    retryOnMount: true,
  });

  const curios = useMemo(
    () => generateCurioMap(data?.pages.flat() || []),
    [data]
  );

  return {
    curios: data ? curios : def,
    fetchNextPage,
    hasNextPage,
    isLoading,
  };
}

export async function prefetchCurioBlocks({
  queryClient,
  flag,
  delay = 0,
}: {
  queryClient: QueryClient;
  flag: HeapFlag;
  delay?: number;
}) {
  const queryKey = ['heap', flag, 'curios', 'infinite'];

  if (queryClient.getQueryCache().find(queryKey)) {
    return;
  }

  async function fetchAndCache() {
    const data = (await api.scry({
      app: 'heap',
      path: `/heap/${flag}/curios/newest/${CURIO_PAGE_SIZE}/blocks`,
    })) as HeapCurios;
    if (data && data.length) {
      queryClient.setQueryData(['heap', flag, 'curios', 'infinite'], {
        pages: [formatCurioResponse(data)],
        pageParams: [null],
      });
    }
  }

  setTimeout(() => {
    fetchAndCache();
  }, delay);
}

export async function prefetchCurioWithComments({
  queryClient,
  flag,
  time,
}: {
  queryClient: QueryClient;
  flag: HeapFlag;
  time: string;
}) {
  const ud = decToUd(time);
  const data = (await api.scry({
    app: 'heap',
    path: `/heap/${flag}/curios/curio/id/${ud}/full`,
  })) as HeapCurio;
  if (data) {
    queryClient.setQueryData(
      ['heap', flag, 'curios', time, 'withComments'],
      data
    );
  }
}

export function usePrefetchCurioWithComments() {
  const queryClient = useQueryClient();
  const prefetch = useCallback(
    (flag: HeapFlag, time: string) => {
      prefetchCurioWithComments({ queryClient, flag, time });
    },
    [queryClient]
  );
  return prefetch;
}

function formatCurioComments(curios: HeapCurios): HeapCurioMap {
  let curioMap = restoreMap<HeapCurio>({});
  Object.entries(curios)
    .map(([k, curio]) => ({ tim: bigInt(udToDec(k)), curio }))
    .forEach(({ tim, curio }) => {
      curioMap = curioMap.set(tim, curio);
    });

  return curioMap;
}

export function useCurioWithComments(flag: HeapFlag, time: string) {
  const defComments = useMemo(() => new BigIntOrderedMap<HeapCurio>(), []);
  const ud = useMemo(() => decToUd(time), [time]);
  const { data, ...query } = useReactQuerySubscription({
    queryKey: ['heap', flag, 'curios', time, 'withComments'],
    app: 'heap',
    path: `/heap/${flag}/ui`,
    scry: `/heap/${flag}/curios/curio/id/${ud}/full`,
    options: {
      keepPreviousData: true,
      refetchOnMount: true,
      retryOnMount: true,
    },
  });

  return useMemo(() => {
    if (!data) {
      return {
        ...query,
        time: bigInt(time),
        curio: null,
        comments: defComments,
      };
    }

    const curio = _.get(data as HeapCurios, ud);
    const comments = _.omit(data as HeapCurios, ud);

    return {
      ...query,
      time: bigInt(time),
      curio,
      comments: formatCurioComments(comments),
    };
  }, [time, ud, data, query, defComments]);
}

export function useAddCurioMutation() {
  const queryClient = useQueryClient();
  const mutationFn = async ({
    flag,
    heart,
  }: {
    flag: HeapFlag;
    heart: CurioHeart;
  }) =>
    new Promise<void>((resolve, reject) => {
      const diff = heapCurioDiff(flag, getTime(), { add: heart });
      api
        .trackedPoke<HeapAction, HeapUpdate>(
          diff,
          { app: 'heap', path: `/heap/${flag}/ui` },
          (event) => {
            const { diff: eventDiff } = event;
            if ('curios' in eventDiff) {
              const { delta } = eventDiff.curios;
              if ('add' in delta && delta.add.sent === heart.sent) {
                return true;
              }
            }
            return false;
          }
        )
        .then(() => resolve())
        .catch(() => reject());
    });

  return useMutation({
    mutationFn,
    onSettled: (_data, _error, variables) => {
      if (variables.heart.replying) {
        queryClient.refetchQueries([
          'heap',
          variables.flag,
          'curios',
          udToDec(variables.heart.replying),
          'withComments',
        ]);
      }
      queryClient.refetchQueries([
        'heap',
        variables.flag,
        'curios',
        'infinite',
      ]);
    },
  });
}

export function useDelCurioMutation() {
  const queryClient = useQueryClient();
  const mutationFn = async ({
    flag,
    time,
  }: {
    flag: HeapFlag;
    time: string;
  }) => {
    const ud = decToUd(time);
    await api.poke(heapCurioDiff(flag, ud, { del: null }));
  };

  return useMutation({
    mutationFn,
    onSuccess: (_data, variables) => {
      queryClient.removeQueries([
        'heap',
        variables.flag,
        'curios',
        variables.time,
        'withComments',
      ]);
    },
    onSettled: (_data, _error, variables) => {
      queryClient.refetchQueries(['heap', variables.flag, 'curios']);
    },
  });
}

export function useEditCurioMutation() {
  const queryClient = useQueryClient();
  const mutationFn = async ({
    flag,
    time,
    heart,
  }: {
    flag: HeapFlag;
    time: string;
    heart: CurioHeart;
  }) => {
    const ud = decToUd(time);
    await api.poke(heapCurioDiff(flag, ud, { edit: heart }));
  };

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      queryClient.cancelQueries(['heap', variables.flag, 'curios', 'infinite']);
      queryClient.cancelQueries([
        'heap',
        variables.flag,
        'curios',
        variables.time,
        'withComments',
      ]);
    },
    onSettled: async (_data, _error, variables) => {
      queryClient.refetchQueries([
        'heap',
        variables.flag,
        'curios',
        'infinite',
      ]);
      queryClient.refetchQueries([
        'heap',
        variables.flag,
        'curios',
        variables.time,
        'withComments',
      ]);
    },
  });
}

export function useMarkHeapReadMutation() {
  const mutationFn = async ({ flag }: { flag: HeapFlag }) => {
    await api.poke({
      app: 'heap',
      mark: 'heap-remark-action',
      json: {
        flag,
        diff: { read: null },
      },
    });
  };

  return useMutation({
    mutationFn,
  });
}

export function useOrderedCurios(
  flag: HeapFlag,
  currentId: bigInt.BigInteger | string
) {
  const queryClient = useQueryClient();
  const { curios } = useInfiniteCurioBlocks(flag);
  const sortedCurios = Array.from(curios).filter(
    ([, c]) => c.heart.replying === null
  );
  sortedCurios.sort(([a], [b]) => b.compare(a));

  const curioId = typeof currentId === 'string' ? bigInt(currentId) : currentId;
  const hasNext = curios.size > 0 && curioId.lt(curios.peekLargest()[0]);
  const hasPrev = curios.size > 0 && curioId.gt(curios.peekSmallest()[0]);
  const currentIdx = sortedCurios.findIndex(([i, _c]) => i.eq(curioId));

  const nextCurio = hasNext ? sortedCurios[currentIdx - 1] : null;
  if (nextCurio) {
    prefetchCurioWithComments({
      queryClient,
      flag,
      time: udToDec(nextCurio[0].toString()),
    });
  }
  const prevCurio = hasPrev ? sortedCurios[currentIdx + 1] : null;
  if (prevCurio) {
    prefetchCurioWithComments({
      queryClient,
      flag,
      time: udToDec(prevCurio[0].toString()),
    });
  }

  return {
    hasNext,
    hasPrev,
    nextCurio,
    prevCurio,
    sortedCurios,
  };
}

export function useRemoteCurio(flag: string, time: string, blockLoad: boolean) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ['heap', 'ref', 'curio', time], [time]);
  const path = useMemo(
    () => `/said/${flag}/curio/${decToUd(time)}`,
    [flag, time]
  );

  const queryFn = useCallback(async () => {
    if (!blockLoad) {
      const { curio } = await subscribeOnce<HeapSaid>('heap', path);
      return curio;
    }
    return null;
  }, [path, blockLoad]);

  useEffect(() => {
    queryClient.refetchQueries(queryKey);
  }, [blockLoad, path, queryKey, queryClient]);

  const { data } = useQuery({
    queryKey,
    queryFn,
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  return data;
}
