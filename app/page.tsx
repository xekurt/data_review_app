"use client";

import { useState } from "react";
import Header from "./_src/components/header";
import Processes from "./_src/components/Processes";
import Subprocesses from "./_src/components/Subprocesses";
import Tasks from "./_src/components/Tasks";
import ChangelogModal from "./_src/components/ChangelogModal";
import { useInitializeProcesses } from "./_src/hooks/useProcessData";
import { useChangelogData } from "./_src/hooks/useChangelogData";

export default function Home() {
  useInitializeProcesses();
  const { changelog } = useChangelogData();
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  return (
    <section
      className="h-screen flex flex-col"
      role="main"
      aria-label="Data Review Dashboard"
    >
      <Header
        onChangelogClick={() => setIsChangelogOpen(true)}
        changelogCount={changelog.length}
      />
      <div
        className="flex flex-1 overflow-hidden"
        role="region"
        aria-label="Process management panels"
      >
        <div
          className="flex-1 overflow-auto border-r border-gray-200 dark:border-gray-700"
          role="region"
          aria-label="Processes list"
        >
          <Processes />
        </div>
        <div
          className="flex-1 overflow-auto border-r border-gray-200 dark:border-gray-700"
          role="region"
          aria-label="Subprocesses list"
        >
          <Subprocesses />
        </div>
        <div
          className="flex-1 overflow-auto"
          role="region"
          aria-label="Tasks list"
        >
          <Tasks />
        </div>
      </div>
      <ChangelogModal
        entries={changelog}
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
      />
    </section>
  );
}
