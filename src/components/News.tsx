import React, { useEffect, useState } from 'react';
import { Newspaper, ChevronRight } from 'lucide-react';
import type { NewsItem } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const api_key = process.env.NEWS_API_KEY;
export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('business');

  const categories = ['business', 'technology', 'sports', 'entertainment'];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&category=${activeCategory}&apiKey=${api_key}`
        );
        const data = await response.json();
        setNews(
          data.articles.map((article: any) => ({
            id: crypto.randomUUID(),
            title: article.title,
            summary: article.description,
            url: article.url,
            category: activeCategory,
            publishedAt: new Date(article.publishedAt).toLocaleString(),
          }))
        );
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [activeCategory]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Newspaper className="w-6 h-6" />
          News Feed
        </h2>
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                activeCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        ) : (
          news.slice(0, 5).map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {item.summary}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {item.publishedAt}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}