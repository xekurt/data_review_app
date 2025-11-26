"use client";

import Header from "./_src/components/header";
import Processes from "./_src/components/Processes";
import Subprocesses from "./_src/components/Subprocesses";
import Tasks from "./_src/components/Tasks";
import { useInitializeProcesses } from "./_src/hooks/useProcessData";

export default function Home() {
  useInitializeProcesses();

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
        <div className="flex-1 overflow-auto">
          <Tasks />
        </div>
      </div>
    </section>
  );
}
