"use client";

import { useState } from "react";

interface CommentFormProps {
  onAddComment: (text: string, author: string) => void;
}

export default function CommentForm({ onAddComment }: CommentFormProps) {
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && authorName.trim()) {
      onAddComment(commentText.trim(), authorName.trim());
      setCommentText("");
      setAuthorName("");
    }
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    // Allow Ctrl+Enter or Cmd+Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (commentText.trim() && authorName.trim()) {
        handleSubmit(e as any);
      }
    }
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (commentText.trim() && authorName.trim()) {
        handleSubmit(e as any);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2"
      aria-label="Add new comment"
    >
      <input
        type="text"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        placeholder="Your name"
        aria-label="Your name"
        required
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
      />
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        onKeyDown={handleTextareaKeyDown}
        placeholder="Add a comment..."
        aria-label="Comment text"
        required
        rows={3}
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
      />
      <button
        type="submit"
        disabled={!commentText.trim() || !authorName.trim()}
        onKeyDown={handleButtonKeyDown}
        className="w-full px-4 py-2 text-sm font-medium bg-gray-900 cursor-pointer text-white bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 disabled:text-gray-200 dark:disabled:bg-gray-600 dark:disabled:text-gray-400 disabled:cursor-not-allowed rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
      >
        Add Comment
      </button>
    </form>
  );
}
