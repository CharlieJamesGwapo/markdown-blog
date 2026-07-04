"use client";

import { useState } from "react";
import { Article } from "@/app/lib/storage";
import Editor from "./Editor";
import Preview from "./Preview";

interface ArticleFormProps {
  initialArticle?: Article;
  categories: string[];
  onSubmit: (data: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    author: string;
  }) => void;
  isLoading?: boolean;
}

export default function ArticleForm({
  initialArticle,
  categories,
  onSubmit,
  isLoading = false,
}: ArticleFormProps) {
  const [title, setTitle] = useState(initialArticle?.title || "");
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || "");
  const [content, setContent] = useState(initialArticle?.content || "");
  const [category, setCategory] = useState(initialArticle?.category || "");
  const [newCategory, setNewCategory] = useState("");
  const [tags, setTags] = useState(initialArticle?.tags.join(", ") || "");
  const [author, setAuthor] = useState(initialArticle?.author || "");
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !category.trim()) {
      alert("Please fill in title, content, and category");
      return;
    }

    const finalCategory = newCategory || category;
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSubmit({
      title: title.trim(),
      excerpt: excerpt.trim(),
      content,
      category: finalCategory.trim(),
      tags: tagArray,
      author: author.trim() || "Anonymous",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          required
        />
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Author
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Excerpt
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief summary of the article"
          rows={2}
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-vertical"
        />
      </div>

      {/* Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (e.target.value) setNewCategory("");
            }}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">Select category...</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="">-- New Category --</option>
          </select>
        </div>

        <div>
          {(!category || category === "") && (
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                New Category
              </label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Create new category"
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., javascript, react, web"
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>

      {/* Content and Preview */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Content (Markdown)
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>

        {showPreview ? (
          <Preview content={content} />
        ) : (
          <Editor value={content} onChange={setContent} />
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : initialArticle ? "Update Article" : "Create Article"}
        </button>
      </div>
    </form>
  );
}
