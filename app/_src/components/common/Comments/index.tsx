"use client";

import { useState } from "react";

import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import { Comment } from "@/app/_src/types/process";

interface CommentsProps {
  comments: Comment[];
  onAddComment: (text: string, author: string) => void;
}

export default function Comments({ comments, onAddComment }: CommentsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
      <button
        onClick={handleToggle}
        onKeyDown={handleToggleKeyDown}
        aria-expanded={isExpanded}
        aria-controls="comments-section"
        aria-label={`${isExpanded ? "Collapse" : "Expand"} comments section. ${
          comments.length
        } ${comments.length === 1 ? "comment" : "comments"}.`}
        className="flex items-center justify-between w-full text-left mb-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 rounded"
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
        <div id="comments-section" className="space-y-4 animate-fade-in">
          <CommentList comments={comments} />
          <CommentForm onAddComment={onAddComment} />
        </div>
      )}
    </div>
  );
}
