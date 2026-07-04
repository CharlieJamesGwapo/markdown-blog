import { compile } from "@mdx-js/mdx";
import { Fragment, ReactElement } from "react";

// Simple markdown to HTML converter for preview
// This is a lightweight alternative that doesn't require full MDX compilation
export function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Escape HTML
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Headers
  html = html.replace(/^### (.*?)$/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*?)$/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*?)$/gim, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Code blocks
  html = html.replace(/```[\w]*\n([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Line breaks
  html = html.replace(/\n\n/g, "</p><p>");
  html = "<p>" + html + "</p>";

  // Lists (basic)
  html = html.replace(/^\* (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

  // Clean up
  html = html.replace(/\r\n/g, "\n");

  return html;
}

// Sanitize HTML to prevent XSS
export function sanitizeHtml(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;

  // Remove any script tags
  const scripts = div.querySelectorAll("script");
  scripts.forEach((script) => script.remove());

  return div.innerHTML;
}

// Get reading time estimate
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Extract excerpt from content
export function extractExcerpt(content: string, length: number = 160): string {
  // Remove markdown syntax
  let text = content
    .replace(/#{1,6}\s/g, "") // headers
    .replace(/\*\*(.+?)\*\*/g, "$1") // bold
    .replace(/\*(.+?)\*/g, "$1") // italic
    .replace(/`(.+?)`/g, "$1") // inline code
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // links
    .replace(/```[\s\S]*?```/g, ""); // code blocks

  // Trim and add ellipsis if needed
  if (text.length > length) {
    return text.substring(0, length).trim() + "...";
  }
  return text.trim();
}

// Parse frontmatter from markdown (for future use)
export function parseFrontmatter(content: string): { metadata: Record<string, string>; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content };
  }

  const metadata: Record<string, string> = {};
  const frontmatterLines = match[1].split("\n");

  frontmatterLines.forEach((line) => {
    const [key, ...valueParts] = line.split(":");
    if (key) {
      metadata[key.trim()] = valueParts.join(":").trim();
    }
  });

  return { metadata, content: match[2] };
}

// Format date
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
