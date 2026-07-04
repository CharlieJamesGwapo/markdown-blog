// Article interface for type safety
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: number;
  updatedAt: number;
  slug: string;
}

const ARTICLES_KEY = "markdown-blog-articles";

// Get all articles
export function getAllArticles(): Article[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(ARTICLES_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Get article by slug
export function getArticleBySlug(slug: string): Article | null {
  const articles = getAllArticles();
  return articles.find((a) => a.slug === slug) || null;
}

// Get article by ID
export function getArticleById(id: string): Article | null {
  const articles = getAllArticles();
  return articles.find((a) => a.id === id) || null;
}

// Create article
export function createArticle(article: Omit<Article, "id" | "createdAt" | "updatedAt" | "slug">): Article {
  const id = Date.now().toString();
  const slug = generateSlug(article.title);
  const now = Date.now();

  const newArticle: Article = {
    ...article,
    id,
    slug,
    createdAt: now,
    updatedAt: now,
  };

  const articles = getAllArticles();
  articles.push(newArticle);
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));

  return newArticle;
}

// Update article
export function updateArticle(id: string, updates: Partial<Omit<Article, "id" | "createdAt" | "slug">>): Article | null {
  const articles = getAllArticles();
  const index = articles.findIndex((a) => a.id === id);

  if (index === -1) return null;

  articles[index] = {
    ...articles[index],
    ...updates,
    updatedAt: Date.now(),
  };

  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  return articles[index];
}

// Delete article
export function deleteArticle(id: string): boolean {
  const articles = getAllArticles();
  const filtered = articles.filter((a) => a.id !== id);

  if (filtered.length === articles.length) return false;

  localStorage.setItem(ARTICLES_KEY, JSON.stringify(filtered));
  return true;
}

// Get all categories
export function getAllCategories(): string[] {
  const articles = getAllArticles();
  const categories = new Set(articles.map((a) => a.category).filter(Boolean));
  return Array.from(categories).sort();
}

// Get all tags
export function getAllTags(): string[] {
  const articles = getAllArticles();
  const tags = new Set<string>();
  articles.forEach((a) => a.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

// Get articles by category
export function getArticlesByCategory(category: string): Article[] {
  const articles = getAllArticles();
  return articles.filter((a) => a.category === category).sort((a, b) => b.createdAt - a.createdAt);
}

// Get articles by tag
export function getArticlesByTag(tag: string): Article[] {
  const articles = getAllArticles();
  return articles.filter((a) => a.tags.includes(tag)).sort((a, b) => b.createdAt - a.createdAt);
}

// Search articles
export function searchArticles(query: string): Article[] {
  const articles = getAllArticles();
  const lowerQuery = query.toLowerCase();

  return articles
    .filter(
      (a) =>
        a.title.toLowerCase().includes(lowerQuery) ||
        a.excerpt.toLowerCase().includes(lowerQuery) ||
        a.content.toLowerCase().includes(lowerQuery) ||
        a.tags.some((t) => t.toLowerCase().includes(lowerQuery))
    )
    .sort((a, b) => b.createdAt - a.createdAt);
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Export sample data for testing
export function initializeSampleData(): void {
  if (getAllArticles().length === 0) {
    const sampleArticles: Omit<Article, "id" | "createdAt" | "updatedAt" | "slug">[] = [
      {
        title: "Welcome to Markdown Blog",
        excerpt: "Your first article on this amazing markdown blogging platform",
        content: `# Welcome to Markdown Blog

This is your first article! You can write anything using **Markdown**.

## What You Can Do

- Create articles with **bold** text
- Use *italics*
- Create \`code snippets\`
- Add [links](https://example.com)
- Create lists and more!

### Code Example

\`\`\`typescript
interface Article {
  title: string;
  content: string;
}
\`\`\`

Enjoy writing!`,
        category: "Getting Started",
        tags: ["welcome", "tutorial"],
        author: "Admin",
      },
    ];

    sampleArticles.forEach((article) => createArticle(article));
  }
}
