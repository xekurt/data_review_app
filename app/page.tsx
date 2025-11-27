"use client";

import Header from "./_src/components/header";
import Processes from "./_src/components/Processes";
import Subprocesses from "./_src/components/Subprocesses";
import Tasks from "./_src/components/Tasks";
import Changelog from "./_src/components/Changelog";
import { useInitializeProcesses, useProcessData } from "./_src/hooks/useProcessData";

export default function Home() {
  useInitializeProcesses();
  const { changelog } = useProcessData();

  return (
    <section className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto border-r border-gray-200 dark:border-gray-700">
          <Processes />
        </div>
        <div className="flex-1 overflow-auto border-r border-gray-200 dark:border-gray-700">
          <Subprocesses />
        </div>
        <div className="flex-1 overflow-auto border-r border-gray-200 dark:border-gray-700">
          <Tasks />
        </div>
        <div className="flex-1 overflow-auto">
          <div className="p-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
            <h1 className="text-2xl font-bold mb-4">Activity Log</h1>
            <Changelog entries={changelog} />
          </div>
        </div>
      </div>
    </section>
  );
}
