"use client";

import Link from "next/link";
import { Article } from "@/app/lib/storage";
import { formatDate } from "@/app/lib/markdown";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="p-6 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-gray-900 transition-shadow">
      <Link href={`/articles/${article.slug}`} className="block group">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
          {article.title}
        </h2>
      </Link>

      <p className="text-gray-600 dark:text-gray-400 mb-4">{article.excerpt}</p>

      <div className="flex flex-wrap gap-2 mb-4">
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

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex gap-4">
          <span>By {article.author}</span>
          <span>{formatDate(article.createdAt)}</span>
        </div>
        <Link href={`/articles/${article.slug}`}>
          <span className="text-blue-600 dark:text-blue-400 hover:underline">
            Read more →
          </span>
        </Link>
      </div>
    </article>
  );
}
