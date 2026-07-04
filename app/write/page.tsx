"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ArticleForm from "@/app/components/ArticleForm";
import {
  createArticle,
  updateArticle,
  getArticleById,
  getAllCategories,
  Article,
} from "@/app/lib/storage";

export default function WritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get("id");

  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadedCategories = getAllCategories();
    setCategories(loadedCategories);

    if (articleId) {
      const foundArticle = getArticleById(articleId);
      if (foundArticle) {
        setArticle(foundArticle);
      }
    }
  }, [articleId]);

  const handleSubmit = async (data: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    author: string;
  }) => {
    setIsLoading(true);

    try {
      if (article) {
        // Update existing article
        updateArticle(article.id, data);
        router.push(`/articles/${article.slug}`);
      } else {
        // Create new article
        const newArticle = createArticle(data);
        router.push(`/articles/${newArticle.slug}`);
      }
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Error saving article. Please try again.");
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {article ? "Edit Article" : "Write New Article"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {article
            ? "Update your article content and metadata"
            : "Create a new article with markdown support"}
        </p>
      </div>

      <ArticleForm
        initialArticle={article || undefined}
        categories={categories}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
