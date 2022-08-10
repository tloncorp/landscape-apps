import {
  NoteDiff,
  NoteSeal,
  DiaryNote,
  DiaryNotes,
  DiaryFlag,
} from '@/types/diary';
import { BigIntOrderedMap, decToUd, udToDec } from '@urbit/api';
import bigInt from 'big-integer';
import api from '../../api';
import { DiaryState } from './type';

interface NotesStore {
  initialize: () => Promise<void>;
  getNewer: (count: string) => Promise<boolean>;
  getOlder: (count: string) => Promise<boolean>;
}

export default function makeNotesStore(
  flag: DiaryFlag,
  get: () => DiaryState,
  scryPath: string,
  subPath: string
): NotesStore {
  const scry = <T>(path: string) =>
    api.scry<T>({
      app: 'diary',
      path: `${scryPath}${path}`,
    });

  const getMessages = async (dir: 'older' | 'newer', count: string) => {
    const { notes } = get();
    let noteMap = notes[flag];

    const oldNotesSize = noteMap.size ?? 0;
    if (oldNotesSize === 0) {
      // already loading the graph
      return false;
    }

    const index =
      dir === 'newer'
        ? noteMap.peekLargest()?.[0]
        : noteMap.peekSmallest()?.[0];
    if (!index) {
      return false;
    }

    const fetchStart = decToUd(index.toString());

    const newNotes = await api.scry<DiaryNotes>({
      app: 'diary',
      path: `${scryPath}/${dir}/${fetchStart}/${count}`,
    });

    get().batchSet((draft) => {
      Object.keys(newNotes).forEach((key) => {
        const note = newNotes[key];
        const tim = bigInt(udToDec(key));
        noteMap = noteMap.set(tim, note);
      });
      draft.notes[flag] = noteMap;
    });

    const newMessageSize = get().notes[flag].size;
    return dir === 'newer'
      ? newMessageSize !== oldNotesSize
      : newMessageSize === oldNotesSize;
  };

  return {
    initialize: async () => {
      const notes = await scry<DiaryNotes>(`/newest/100`);
      const sta = get();
      sta.batchSet((draft) => {
        let noteMap = new BigIntOrderedMap<DiaryNote>();

        Object.keys(notes).forEach((key) => {
          const note = notes[key];
          const tim = bigInt(udToDec(key));
          noteMap = noteMap.set(tim, note);
        });

        draft.notes[flag] = noteMap;
      });

      api.subscribe({
        app: 'diary',
        path: subPath,
        event: (data: unknown) => {
          const { time, delta } = data as NoteDiff;
          const s = get();

          const bigTime = bigInt(time);
          s.batchSet((draft) => {
            let noteMap = draft.notes[flag];
            if ('add' in delta && !noteMap.has(bigTime)) {
              const seal: NoteSeal = { time, feels: {} };
              const note: DiaryNote = { seal, essay: delta.add };
              noteMap = noteMap.set(bigTime, note);
            } else if ('del' in delta && noteMap.has(bigTime)) {
              noteMap = noteMap.delete(bigTime);
            }
            draft.notes[flag] = noteMap;
          });
        },
      });
    },
    getNewer: async (count: string) => getMessages('newer', count),
    getOlder: async (count: string) => getMessages('older', count),
  };
}
