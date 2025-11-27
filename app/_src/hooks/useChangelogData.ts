"use client";

import { useChangelogStore } from "../store/changelogStore";

export const useChangelogData = () => {
  const changelog = useChangelogStore((state) => state.getChangelog());
  const addChangelogEntry = useChangelogStore(
    (state) => state.addChangelogEntry
  );
  const addChangelogEntries = useChangelogStore(
    (state) => state.addChangelogEntries
  );

  return {
    changelog,
    addChangelogEntry,
    addChangelogEntries,
  };
};
