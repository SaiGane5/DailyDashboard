import React, { useEffect, useState } from 'react';
import { Newspaper, ChevronRight, Globe, Tag, Activity } from 'lucide-react';

interface NewsItem {
  article_id: string;
  title: string;
  link: string;
  description: string;
  content: string;
  pubDate: string;
  image_url: string;
  source_name: string;
  source_icon: string;
  category: string[];
  ai_tag?: string[];
  ai_region?: string[];
  ai_org?: string[];
  sentiment: string;
  sentiment_stats: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('top');
  const [activeCountry, setActiveCountry] = useState('us');

  const categories = ['top', 'business', 'technology', 'sports', 'entertainment'];
  const countries = [
    { code: 'us', name: 'USA' },
    { code: 'in', name: 'India' },
    { code: 'ca', name: 'Canada' },
    { code: 'au', name: 'Australia' },
  ];

  // Use your environment variable here
  const api_key = import.meta.env.VITE_NEWS_API_KEY;

  useEffect(() => {
    const fetchNews = async () => {
      if (!api_key) {
        console.error('News API key is not defined');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://newsdata.io/api/1/latest?country=${activeCountry}&category=${activeCategory}&apiKey=${api_key}`
        );
        const data = await response.json();
        setNews(data.results);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [activeCategory, activeCountry]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderSentimentBar = (stats: { positive: number; neutral: number; negative: number }) => (
    <div className="flex h-2 rounded-full overflow-hidden w-full mt-2">
      <div
        style={{ width: `${stats.positive}%` }}
        className="bg-green-500"
      />
      <div
        style={{ width: `${stats.neutral}%` }}
        className="bg-gray-300"
      />
      <div
        style={{ width: `${stats.negative}%` }}
        className="bg-red-500"
      />
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Newspaper className="w-6 h-6" />
            News Feed
          </h2>
          <div className="flex gap-2">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => setActiveCountry(country.code)}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${activeCountry === country.code
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
              >
                <Globe className="w-4 h-4" />
                {country.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 rounded-full text-sm ${activeCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        ) : (
          news.slice(0, 5).map((item) => (
            <a
              key={item.article_id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex gap-4">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-48 h-32 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {item.source_icon && (
                          <img
                            src={item.source_icon}
                            alt={item.source_name}
                            className="w-4 h-4"
                          />
                        )}
                        <span className="text-sm text-gray-500">
                          {item.source_name}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>

                  <div className="mt-3 space-y-2">
                    {/* Entity Tags */}
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(item.ai_region) && item.ai_region.map((region) => (
                        <span key={region} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                          <Globe className="w-3 h-3 mr-1" />
                          {region}
                        </span>
                      ))}
                      {Array.isArray(item.ai_tag) && item.ai_tag.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Sentiment Analysis */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${getSentimentColor(item.sentiment)}`}>
                        <Activity className="w-3 h-3 mr-1" />
                        {item.sentiment}
                      </span>
                      {item.sentiment_stats && renderSentimentBar(item.sentiment_stats)}
                    </div>

                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(item.pubDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}