import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Loader } from 'lucide-react';
import type { Weather as WeatherType } from '../types';
const api_key = process.env.WEATHER_API_KEY
export default function Weather() {
  const [weather, setWeather] = useState<WeatherType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=auto:ip&days=3`
        );
        const data = await response.json();
        setWeather({
          temp: data.current.temp_c,
          condition: data.current.condition.text,
          icon: data.current.condition.icon,
          location: data.location.name,
          forecast: data.forecast.forecastday.map((day: any) => ({
            day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
            temp: day.day.avgtemp_c,
            condition: day.day.condition.text,
            icon: day.day.condition.icon,
          })),
        });
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 1800000); // Update every 30 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse flex items-center justify-center h-full">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {weather.location}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{weather.condition}</p>
        </div>
        <div className="text-4xl font-bold text-gray-800 dark:text-white">
          {Math.round(weather.temp)}°C
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        {weather.forecast.map((day) => (
          <div
            key={day.day}
            className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
          >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {day.day}
            </p>
            <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">
              {Math.round(day.temp)}°C
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {day.condition}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}