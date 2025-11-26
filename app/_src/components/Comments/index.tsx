"use client";

import { useState } from "react";
import { Comment } from "../../types/process";
import { formatDate } from "../../utils/formatters";

interface CommentsProps {
  comments: Comment[];
  onAddComment: (text: string, author: string) => void;
}

export default function Comments({ comments, onAddComment }: CommentsProps) {
  console.info("COMENTS : ", comments);
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && authorName.trim()) {
      onAddComment(commentText.trim(), authorName.trim());
      setCommentText("");
      setAuthorName("");
    }
  };

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Comments ({comments.length})
        </h4>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="space-y-4 animate-fade-in">
          {/* Comment List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {sortedComments.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No comments yet
              </p>
            ) : (
              sortedComments.map((comment) => (
                <div
                  key={comment.id}
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

          {/* Add Comment Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || !authorName.trim()}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Add Comment
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
