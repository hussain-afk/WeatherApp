import React, { useState } from 'react';
import { WiHumidity, WiWindy, WiThermometer, WiCloudy, WiBarometer, WiSunrise, WiSunset } from 'react-icons/wi';
import { BiSearch, BiMap } from 'react-icons/bi';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env?.VITE_WEATHER_API_KEY || "ab3794d60d6f8d5419229d0963541ef0";
  // console.log('Using API Key:', API_KEY);

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      // console.log(response);

      if (!response.ok) {
        throw new Error('City not found. Try checking your spelling.');
      }

      const data = await response.json();
      // console.log('Weather Data:', data);
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherTheme = () => {
    if (!weather) return 'from-slate-900 via-indigo-950 to-slate-900 text-cyan-400 border-slate-700/20';
    const condition = weather.weather[0].main.toLowerCase();

    if (condition.includes('clear')) {
      return 'from-amber-600 via-orange-600 to-amber-900 text-amber-300 border-amber-500/20 shadow-amber-500/10';
    }
    if (condition.includes('cloud')) {
      console.log('Cloudy condition detected:', condition);
      return 'from-slate-700 via-slate-800 to-slate-900 text-slate-300 border-slate-600/20 shadow-slate-500/10';
    }
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'from-cyan-900 via-blue-950 to-indigo-950 text-cyan-300 border-cyan-500/20 shadow-blue-500/10';
    }
    if (condition.includes('thunderstorm')) {
      return 'from-purple-900 via-slate-950 to-purple-950 text-purple-400 border-purple-500/20 shadow-purple-500/10';
    }
    if (condition.includes('snow')) {
      return 'from-sky-700 via-blue-800 to-slate-900 text-sky-200 border-sky-400/20 shadow-sky-400/10';
    }
    return 'from-slate-900 via-indigo-950 to-slate-900 text-cyan-400 border-slate-700/20';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentTheme = getWeatherTheme();

  return (
    <div className={`min-h-screen bg-gradient-to-tr ${currentTheme.split(' text-')[0]} flex flex-col items-center justify-center p-4 transition-all duration-1000 ease-in-out`}>
      <div className={`w-full max-w-lg bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border ${currentTheme.split(' text-')[1].split(' shadow-')[0]} transition-all duration-1000`}>

        {/* Title Bar */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold tracking-wider uppercase text-white/80 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Weather
          </h1>
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/60 backdrop-blur-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Modern Search Field */}
        <form onSubmit={fetchWeather} className="relative flex items-center mb-8 group">
          <input
            type="text"
            placeholder="Search global cities..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 focus:border-white/30 rounded-2xl pl-12 pr-14 py-4 text-white placeholder-white/40 outline-none transition-all duration-300 shadow-inner text-lg font-light tracking-wide focus:scale-[1.01]"
          />
          <BiMap className="absolute left-4 text-white/40 group-focus-within:text-white/80 transition-colors duration-300" size={22} />
          <button
            type="submit"
            className="absolute right-2.5 bg-white text-slate-900 hover:bg-opacity-90 active:scale-90 p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center shadow-md hover:rotate-12"
          >
            <BiSearch size={20} />
          </button>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin" />
            <p className="text-white/60 tracking-widest text-sm font-light animate-pulse">Syncing weather grid...</p>
          </div>
        )}

        {/* Error Handling with custom Shake Animation */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-center p-4 rounded-2xl text-sm mb-4 backdrop-blur-md animate-shake">
            ⚠️ {error}
          </div>
        )}

        {weather && !loading && (
          <div className="space-y-8 animate-fade-in-up">

            {/* Primary Display Container */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-4xl font-extrabold tracking-tight text-white flex items-baseline gap-1.5">
                  {weather.name}
                  <span className="text-lg font-medium text-white/50 tracking-normal">{weather.sys.country}</span>
                </h2>
                <p className="text-sm tracking-widest text-white/60 uppercase font-semibold mt-1.5">
                  {weather.weather[0].description}
                </p>
              </div>

              {/* Floating Weather Condition Container */}
              <div className="flex items-center gap-2 bg-white/5 pr-6 pl-2 py-1 rounded-3xl border border-white/5 w-fit hover:bg-white/10 transition-all duration-300 group">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt="condition"
                  className="w-20 h-20 filter drop-shadow-[0_4px_10px_rgba(255,255,255,0.15)] animate-float"
                />
                <div>
                  <div className="text-5xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform duration-300">
                    {Math.round(weather.main.temp)}°
                  </div>
                  <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Celsius</span>
                </div>
              </div>
            </div>

            {/* Sun System Analytics Banner */}
            <div className="grid grid-cols-2 gap-3 bg-black/20 p-4 rounded-2xl border border-white/5 shadow-inner">
              <div className="flex items-center gap-3 justify-center border-r border-white/10">
                <WiSunrise className="text-amber-400 animate-pulse" size={32} />
                <div className="text-left">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Sunrise</p>
                  <p className="text-sm font-semibold text-white/90">{formatTime(weather.sys.sunrise)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <WiSunset className="text-orange-400 animate-pulse" size={32} />
                <div className="text-left">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Sunset</p>
                  <p className="text-sm font-semibold text-white/90">{formatTime(weather.sys.sunset)}</p>
                </div>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 px-1">Atmospheric Parameters</p>
              <div className="grid grid-cols-2 gap-4">

                {/* Feels Like */}
                <div className="bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 p-4 rounded-2xl border border-white/5 flex items-center gap-4 group">
                  <div className="p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                    <WiThermometer className={currentTheme.split(' text-')[1].split(' border-')[0]} size={28} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 font-medium">Feels Like</p>
                    <p className="text-lg font-bold text-white">{Math.round(weather.main.feels_like)}°C</p>
                  </div>
                </div>

                {/* Humidity */}
                <div className="bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 p-4 rounded-2xl border border-white/5 flex items-center gap-4 group">
                  <div className="p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                    <WiHumidity className={currentTheme.split(' text-')[1].split(' border-')[0]} size={28} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 font-medium">Humidity</p>
                    <p className="text-lg font-bold text-white">{weather.main.humidity}%</p>
                  </div>
                </div>

                {/* Wind Speed */}
                <div className="bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 p-4 rounded-2xl border border-white/5 flex items-center gap-4 group">
                  <div className="p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                    <WiWindy className={currentTheme.split(' text-')[1].split(' border-')[0]} size={28} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 font-medium">Wind Flow</p>
                    <p className="text-lg font-bold text-white">{weather.wind.speed} <span className="text-xs text-white/50">m/s</span></p>
                  </div>
                </div>

                {/* Barometer Pressure */}
                <div className="bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 p-4 rounded-2xl border border-white/5 flex items-center gap-4 group">
                  <div className="p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                    <WiBarometer className={currentTheme.split(' text-')[1].split(' border-')[0]} size={28} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 font-medium">Pressure</p>
                    <p className="text-lg font-bold text-white">{weather.main.pressure} <span className="text-xs text-white/50">hPa</span></p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;