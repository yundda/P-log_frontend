import React, { useState, useEffect } from 'react';
import '../../style/weather.scss';

// const API_KEY = 'da450c832635d5d57538d8acdd43e25f';
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const CITY_NAME = 'Seoul'; // 고정

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeatherByCity = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}&units=metric&lang=kr`,
        );
        const data = await res.json();
        if (data.cod === 200) {
          setWeather(data);
        } else {
          alert('날씨 정보를 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        alert('날씨 API 호출 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    getWeatherByCity();
  }, []);

  return (
    <div className="weather-container w-[280px] h-40 aspect-square items-center rounded-2xl shadow-lg border-plog-main2 overflow-hidden">
      <div className="p-4 h-full flex flex-col justify-between">
        <h1 className="text-l font-bold text-center text-plog-main4">
          산책 가쟈~ 날씨만 좋다면~
        </h1>
        {loading ? (
          <p className="text-center text-gray-500 mt-4">불러오는 중...</p>
        ) : weather ? (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-800 gap-1 text-sm">
            {/* <h2 className="text-lg font-semibold text-center">
              {weather.name}
            </h2> */}
            <p>🌤️ {weather.weather[0].description}</p>
            <p>🌡️ 온도: {weather.main.temp}°C</p>
            <p>💧 습도: {weather.main.humidity}%</p>
            <p>🍃 풍속: {weather.wind.speed} m/s</p>
          </div>
        ) : (
          <p className="text-center text-red-500 mt-4">
            날씨 정보를 불러올 수 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
