import { create } from "zustand";
import type { ChangelogEntry } from "../types/process";

interface ChangelogStore {
  changelog: ChangelogEntry[];
  addChangelogEntry: (entry: ChangelogEntry) => void;
  addChangelogEntries: (entries: ChangelogEntry[]) => void;
  getChangelog: () => ChangelogEntry[];
}

export const useChangelogStore = create<ChangelogStore>((set, get) => ({
  changelog: [],

  addChangelogEntry: (entry) =>
    set((state) => ({
      changelog: [...state.changelog, entry],
    })),

  addChangelogEntries: (entries) =>
    set((state) => ({
      changelog: [...state.changelog, ...entries],
    })),

  getChangelog: () => {
    const state = get();
    return state.changelog;
  },
}));
