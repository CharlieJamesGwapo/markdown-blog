"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ArticleCard from "@/app/components/ArticleCard";
import SearchBar from "@/app/components/SearchBar";
import { Article, getArticlesByCategory, getAllCategories, searchArticles } from "@/app/lib/storage";

interface CategoryPageProps {
  params: Promise<{ name: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      const decodedName = decodeURIComponent(p.name);
      setCategoryName(decodedName);

      const categoryArticles = getArticlesByCategory(decodedName);
      setArticles(categoryArticles);
      setFilteredArticles(categoryArticles);
      setIsLoading(false);
    });
  }, [params]);

  useEffect(() => {
    if (searchQuery) {
      const results = searchArticles(searchQuery).filter((a) =>
        articles.some((ca) => ca.id === a.id)
      );
      setFilteredArticles(results);
    } else {
      setFilteredArticles(articles);
    }
  }, [searchQuery, articles]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
          ← Back to home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {categoryName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {articles.length} article{articles.length !== 1 ? "s" : ""} in this category
        </p>
      </section>

      {/* Search */}
      <section>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search in this category..."
        />
      </section>

      {/* Articles */}
      <section>
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {articles.length === 0
                ? "No articles in this category yet."
                : "No articles match your search."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
