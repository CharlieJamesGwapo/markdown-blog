"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Article, getArticleBySlug, deleteArticle, getAllArticles } from "@/app/lib/storage";
import { formatDate, markdownToHtml, sanitizeHtml, getReadingTime } from "@/app/lib/markdown";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    params.then((p) => {
      setSlug(p.slug);
      const foundArticle = getArticleBySlug(p.slug);
      setArticle(foundArticle);
      setIsLoading(false);
    });
  }, [params]);

  const handleDelete = () => {
    if (!article) return;

    if (confirm("Are you sure you want to delete this article? This cannot be undone.")) {
      deleteArticle(article.id);
      router.push("/");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Article Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The article you're looking for doesn't exist or has been deleted.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const htmlContent = sanitizeHtml(markdownToHtml(article.content));
  const readingTime = getReadingTime(article.content);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Back to articles
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {article.title}
        </h1>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>By {article.author}</span>
            <span>{formatDate(article.createdAt)}</span>
            <span>{readingTime} min read</span>
          </div>

          {article.updatedAt > article.createdAt && (
            <div className="text-xs text-gray-500 dark:text-gray-500 italic">
              Updated {formatDate(article.updatedAt)}
            </div>
          )}
        </div>

        {/* Tags and Category */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link href={`/categories/${article.category}`}>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
              {article.category}
            </span>
          </Link>
          {article.tags.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`}>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 text-xs font-medium hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors">
                #{tag}
              </span>
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
          <Link
            href={`/write?id=${article.id}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none mb-12">
        <div
          className="prose-sm sm:prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to articles
        </Link>
      </div>
    </div>
  );
}
