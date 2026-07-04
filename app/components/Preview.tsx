"use client";

import { useMemo } from "react";
import { markdownToHtml, sanitizeHtml } from "@/app/lib/markdown";

interface PreviewProps {
  content: string;
  className?: string;
}

export default function Preview({ content, className = "" }: PreviewProps) {
  const html = useMemo(() => {
    if (!content) {
      return '<p class="text-gray-400">Preview will appear here...</p>';
    }
    const rawHtml = markdownToHtml(content);
    return sanitizeHtml(rawHtml);
  }, [content]);

  return (
    <div
      className={`prose dark:prose-invert max-w-none p-4 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 overflow-auto h-96 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
