"use client";

import { Comment } from "@/app/_src/types/process";
import { formatDate } from "@/app/_src/utils/formatters";

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div
      className="space-y-3 max-h-64 overflow-y-auto"
      role="list"
      aria-label="Comments list"
    >
      {sortedComments.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          No comments yet
        </p>
      ) : (
        sortedComments.map((comment) => (
          <div
            key={comment.id}
            role="listitem"
            aria-label={`Comment by ${comment.author} on ${formatDate(
              comment.createdAt
            )}`}
            className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
              {comment.text}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">{comment.author}</span>
              <span>{formatDate(comment.createdAt)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
