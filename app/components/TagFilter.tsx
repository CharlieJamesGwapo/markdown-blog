"use client";

interface TagFilterProps {
  tags: string[];
  selected: Set<string>;
  onChange: (tags: Set<string>) => void;
}

export default function TagFilter({
  tags,
  selected,
  onChange,
}: TagFilterProps) {
  const toggleTag = (tag: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(tag)) {
      newSelected.delete(tag);
    } else {
      newSelected.add(tag);
    }
    onChange(newSelected);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            selected.has(tag)
              ? "bg-emerald-500 text-white dark:bg-emerald-600"
              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
