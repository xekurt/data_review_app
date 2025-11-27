interface HeaderProps {
  onChangelogClick?: () => void;
  changelogCount?: number;
}

const Header: React.FC<HeaderProps> = ({
  onChangelogClick,
  changelogCount = 0,
}) => (
  <header className="p-4 bg-gray-100 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 flex items-center justify-between">
    <h1 className="m-0 text-2xl font-semibold text-gray-900 dark:text-gray-100">
      Process review dashboard
    </h1>
    {onChangelogClick && (
      <button
        onClick={onChangelogClick}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span>Activity Log</span>
        {changelogCount > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-primary-500 rounded-full">
            {changelogCount}
          </span>
        )}
      </button>
    )}
  </header>
);

export default Header;
