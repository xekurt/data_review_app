"use client";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export default function Loading({
  message = "Loading...",
  size = "md",
  fullScreen = false,
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinner */}
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full border-4 border-gray-200 dark:border-gray-700`}
        ></div>
        <div
          className={`${sizeClasses[size]} rounded-full border-4 border-primary-500 border-t-transparent animate-spin absolute top-0 left-0`}
        ></div>
      </div>

      {/* Loading message */}
      {message && (
        <p
          className={`${textSizeClasses[size]} font-medium text-gray-700 dark:text-gray-300 animate-pulse`}
        >
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-950 z-50">
        {content}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center p-6"
      role="status"
      aria-live="polite"
    >
      {content}
    </div>
  );
}
