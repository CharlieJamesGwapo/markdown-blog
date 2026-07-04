"use client";

import { useState, useEffect } from "react";
import ArticleCard from "./components/ArticleCard";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import { Article, getAllArticles, getAllCategories, searchArticles, getArticlesByCategory, initializeSampleData } from "./lib/storage";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize with sample data on first load if needed
    initializeSampleData();

    // Load articles
    const loadedArticles = getAllArticles();
    const loadedCategories = getAllCategories();

    setArticles(loadedArticles);
    setCategories(loadedCategories);
    setFilteredArticles(loadedArticles);
    setIsLoading(false);
  }, []);

  // Filter articles based on search and category
  useEffect(() => {
    let result = articles;

    if (searchQuery) {
      result = searchArticles(searchQuery);
    } else if (selectedCategory) {
      result = getArticlesByCategory(selectedCategory);
    }

    setFilteredArticles(result);
  }, [searchQuery, selectedCategory, articles]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
          My Markdown Blog
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Discover articles on technology, development, and more
        </p>
      </section>

      {/* Search */}
      <section>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search articles by title, content, or tags..."
        />
      </section>

      {/* Category Filter */}
      {categories.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Categories
          </h2>
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </section>
      )}

      {/* Articles */}
      <section>
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Loading articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {articles.length === 0
                ? "No articles yet. Start writing!"
                : "No articles match your search."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {searchQuery
                ? `Search Results (${filteredArticles.length})`
                : selectedCategory
                  ? `${selectedCategory} (${filteredArticles.length})`
                  : `All Articles (${filteredArticles.length})`}
            </h2>
            <div className="grid gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
