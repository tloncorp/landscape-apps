import bigInt, { BigInteger } from 'big-integer';
import { unstable_batchedUpdates as batchUpdates } from 'react-dom';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import produce, { setAutoFreeze } from 'immer';
import { BigIntOrderedMap, decToUd, unixToDa } from '@urbit/api';
import { useCallback, useMemo } from 'react';
import {
  NoteDelta,
  Diary,
  DiaryBriefs,
  DiaryBriefUpdate,
  DiaryNote,
  DiaryDiff,
  DiaryFlag,
  DiaryPerm,
  Shelf,
} from '@/types/diary';
import api from '@/api';
import {
  createStorageKey,
  clearStorageMigration,
  storageVersion,
} from '@/logic/utils';
import { DiaryState } from './type';
import makeNotesStore from './notes';

setAutoFreeze(false);

function diaryAction(flag: DiaryFlag, diff: DiaryDiff) {
  return {
    app: 'diary',
    mark: 'diary-action',
    json: {
      flag,
      update: {
        time: '',
        diff,
      },
    },
  };
}

function diaryNoteDiff(flag: DiaryFlag, time: number, delta: NoteDelta) {
  return diaryAction(flag, {
    notes: {
      time,
      delta,
    },
  });
}

function getTime() {
  return decToUd(unixToDa(Date.now()).toString());
}

export const useDiaryState = create<DiaryState>(
  persist<DiaryState>(
    (set, get) => ({
      set: (fn) => {
        set(produce(get(), fn));
      },
      batchSet: (fn) => {
        batchUpdates(() => {
          get().set(fn);
        });
      },
      shelf: {},
      notes: {},
      diarySubs: [],
      briefs: {},
      markRead: async (flag) => {
        await api.poke({
          app: 'diary',
          mark: 'diary-remark-action',
          json: {
            flag,
            diff: { read: null },
          },
        });
      },
      start: async () => {
        // TODO: parallelise
        api
          .scry<DiaryBriefs>({
            app: 'diary',
            path: '/briefs',
          })
          .then((briefs) => {
            get().batchSet((draft) => {
              draft.briefs = briefs;
            });
          });

        api
          .scry<Shelf>({
            app: 'diary',
            path: '/shelf',
          })
          .then((chats) => {
            get().batchSet((draft) => {
              draft.shelf = chats;
            });
          });

        api.subscribe({
          app: 'diary',
          path: '/briefs',
          event: (event: unknown, mark: string) => {
            if (mark === 'diary-leave') {
              get().batchSet((draft) => {
                delete draft.briefs[event as string];
              });
              return;
            }

            const { flag, brief } = event as DiaryBriefUpdate;
            get().batchSet((draft) => {
              draft.briefs[flag] = brief;
            });
          },
        });
      },
      joinDiary: async (flag) => {
        await api.poke({
          app: 'diary',
          mark: 'flag',
          json: flag,
        });
      },
      leaveDiary: async (flag) => {
        await api.poke({
          app: 'chat',
          mark: 'diary-leave',
          json: flag,
        });
      },
      addNote: (flag, heart) => {
        api.poke(diaryNoteDiff(flag, Date.now(), { add: heart }));
      },
      delNote: (flag, time) => {
        api.poke(diaryNoteDiff(flag, time, { del: null }));
      },
      create: async (req) => {
        await api.poke({
          app: 'diary',
          mark: 'diary-create',
          json: req,
        });
      },
      addSects: async (flag, sects) => {
        await api.poke(diaryAction(flag, { 'add-sects': sects }));
        const perms = await api.scry<DiaryPerm>({
          app: 'diary',
          path: `/diary/${flag}/perm`,
        });
        get().batchSet((draft) => {
          draft.shelf[flag].perms = perms;
        });
      },
      delSects: async (flag, sects) => {
        await api.poke(diaryAction(flag, { 'del-sects': sects }));
        const perms = await api.scry<DiaryPerm>({
          app: 'chat',
          path: `/diary/${flag}/perm`,
        });
        get().batchSet((draft) => {
          draft.shelf[flag].perms = perms;
        });
      },
      initialize: async (flag) => {
        if (get().diarySubs.includes(flag)) {
          return;
        }

        const perms = await api.scry<DiaryPerm>({
          app: 'diary',
          path: `/diary/${flag}/perm`,
        });
        get().batchSet((draft) => {
          const diary = { perms };
          draft.shelf[flag] = diary;
          draft.diarySubs.push(flag);
        });

        await makeNotesStore(
          flag,
          get,
          `/diary/${flag}/notes`,
          `/diary/${flag}/ui/notes`
        ).initialize();
      },
    }),
    {
      name: createStorageKey('diary'),
      version: storageVersion,
      migrate: clearStorageMigration,
      partialize: ({ shelf }) => ({
        shelf,
      }),
    }
  )
);

export function useNotesForDiary(flag: DiaryFlag) {
  const def = useMemo(() => new BigIntOrderedMap<DiaryNote>(), []);
  return useDiaryState(useCallback((s) => s.notes[flag] || def, [flag, def]));
}

const defaultPerms = {
  writers: [],
};

export function useDiaryPerms(flag: DiaryFlag) {
  return useDiaryState(
    useCallback((s) => s.shelf[flag]?.perms || defaultPerms, [flag])
  );
}

export function useDiaryIsJoined(flag: DiaryFlag) {
  return useDiaryState(
    useCallback((s) => Object.keys(s.briefs).includes(flag), [flag])
  );
}

export function useNotes(flag: DiaryFlag) {
  return useDiaryState(useCallback((s) => s.notes[flag], [flag]));
}

export function useCurrentNotesSize(flag: DiaryFlag) {
  return useDiaryState(useCallback((s) => s.notes[flag]?.size ?? 0, [flag]));
}

// export function useComments(flag: DiaryFlag, time: string) {
//   const notes = useNotes(flag);
//   return useMemo(() => {
//     if (!notes) {
//       return new BigIntOrderedMap<DiaryNote>();
//     }

//     const curio = notes.get(bigInt(time));
//     const replies = (curio?.seal?.replied || ([] as number[]))
//       .map((r: number) => {
//         const t = bigInt(r);
//         const c = notes.get(t);
//         return c ? ([t, c] as const) : undefined;
//       })
//       .filter((r: unknown): r is [BigInteger, DiaryNote] => !!r) as [
//       BigInteger,
//       DiaryNote
//     ][];
//     return new BigIntOrderedMap<DiaryNote>().gas(replies);
//   }, [notes, time]);
// }

export function useNote(flag: DiaryFlag, time: string) {
  return useDiaryState(
    useCallback(
      (s) => {
        const notes = s.notes[flag];
        if (!notes) {
          return undefined;
        }

        const t = bigInt(time);
        return [t, notes.get(t)] as const;
      },
      [flag, time]
    )
  );
}

export function useDiary(flag: DiaryFlag): Diary | undefined {
  return useDiaryState(useCallback((s) => s.shelf[flag], [flag]));
}

export function useBriefs() {
  return useDiaryState(useCallback((s: DiaryState) => s.briefs, []));
}
