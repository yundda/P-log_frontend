import React, { useState, useEffect } from 'react';
import '../../style/weather.scss';

const API_KEY = 'da450c832635d5d57538d8acdd43e25f';
// const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeatherByLocation = () => {
      if (!navigator.geolocation) {
        alert('이 브라우저는 위치 정보를 지원하지 않습니다.');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;

          try {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`,
            );
            const data = await res.json();
            if (data.cod === 200) {
              setWeather(data);
            } else {
              alert('날씨 정보를 가져오는 데 실패했습니다.');
            }
          } catch (error) {
            alert('오류가 발생했습니다.');
          } finally {
            setLoading(false);
          }
        },
        error => {
          alert('위치 정보를 가져올 수 없습니다.');
          setLoading(false);
        },
      );
    };

    getWeatherByLocation();
  }, []);

  return (
    <div className="weather-container max-w-md mx-auto mt-10 p-4 rounded-2xl shadow-lg bg-plog-main2">
      <h1 className="text-2xl font-bold text-center mb-4 text-plog-main4">
        날씨 정보
      </h1>
      {loading ? (
        <p className="text-center text-gray-500">불러오는 중...</p>
      ) : weather ? (
        <div className="weather-content p-4 text-gray-800">
          <h2 className="text-xl font-semibold mb-2">{weather.name}</h2>
          <p>날씨: {weather.weather[0].description}</p>
          <p>온도: {weather.main.temp}°C</p>
          <p>습도: {weather.main.humidity}%</p>
          <p>풍속: {weather.wind.speed} m/s</p>
        </div>
      ) : (
        <p className="text-center text-red-500">
          날씨 정보를 불러올 수 없습니다.
        </p>
      )}
    </div>
  );
}
