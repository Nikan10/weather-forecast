"use client";
import { useEffect, useState } from "react";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  const [city, setCity] = useState("Kabul");

  const [dailyData, setDailyData] = useState({});
  const [weeklyData, setWeeklyData] = useState({});

  const [isFilled, setIsFilled] = useState(false);

  const [wishList, setWishList] = useState(
    JSON.parse(localStorage.getItem("wishList"))
  );
  const [weatherData, setWeatherData] = useState(null);
  const [citiesWeatherData, setCitiesWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("today");

  const api_key = "7a4754754d94433b9ce181533240911";

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setCity(event.target.value);
    }
  };


  async function fetchCitiesWeatherData(specificCity) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${specificCity}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data for ${specificCity}`);
    }

    const data = await response.json();
    return data;
  }

  useEffect(() => {
    const fetchAllWeatherData = async () => {
      const cities = ["Dubai", "London", "New York", "Tokyo", "Sydney"];
      try {
        const results = await Promise.all(cities.map(fetchCitiesWeatherData));
        setCitiesWeatherData(results);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAllWeatherData();

    const fetchHourlyWeather = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${city}&hours=24`
        );
        const data = await response.json();

        console.log("Hourly Forecast:", data.forecast.forecastday[0].hour);
        setDailyData(data.forecast.forecastday[0].hour);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchHourlyWeather();
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${city}&aqi=no`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        setWeatherData(data);
        console.log("weather data", weatherData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchWeather();

    const fetchWeatherData = async () => {
      const days = 7;

      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${city}&days=${days}`
      );
      const data = await response.json();
      console.log("week", data);
      setWeeklyData(data);
    };

    fetchWeatherData();
  }, [city]);

  useEffect(() => {
    
    if (
      wishList.some(
        (item) => item.location.name === weatherData?.location?.name
      )
    ) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, [weatherData, wishList]);

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleWishlist = (weatherData) => {
    try {
      const existingWishlist =
        JSON.parse(localStorage.getItem("wishList")) || [];

      const existingItemIndex = existingWishlist.findIndex(
        (item) => item.location.name === weatherData.location.name
      );

      if (existingItemIndex !== -1) {
        existingWishlist.splice(existingItemIndex, 1);
      } else {
        existingWishlist.push(weatherData);
      }

      localStorage.setItem("wishList", JSON.stringify(existingWishlist));
    } catch (error) {
      console.error("Error handling wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleClick = () => {
    setIsFilled(!isFilled);
    handleWishlist(weatherData);
  };

  const setTimeFormat = (time) => {
    const dateTimeString = time;

    const timePart = dateTimeString.split(" ")[1];

    const [hours, minutes] = timePart.split(":").map(Number);

    const isPM = hours >= 12;
    const hour12 = hours % 12 || 12;

    const formattedTime = `${hour12}:${minutes.toString().padStart(2, "0")} ${
      isPM ? "PM" : "AM"
    }`;
    return formattedTime;
  };

  if (error) return <p>Error: {error}</p>;

  if (!weatherData) return <p>Loading...</p>;

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left */}
        <div className="bg-primary-main shadow-sm rounded-xl p-6">
          {/* Search Bar */}
          <div className="relative mb-8">
            <input
              type="text"
              onKeyDown={handleKeyDown}
              placeholder="Search for places..."
              className="w-full text-white pl-10 pr-4 py-2 rounded-xl bg-primary-light border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <button className="absolute right-3 top-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
              <FiRefreshCw className="text-gray-400" />
            </button>
          </div>

          {/* Current Weather */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto sm:w-48 sm:h-48">
              <img
                src={weatherData?.current?.condition?.icon}
                alt="weather"
                className="w-full h-full"
              />
            </div>

            <div className="mt-8">
              <h1 className="text-5xl sm:text-8xl text-gray-100">
                {weatherData?.current?.temp_c}
                <span>
                  °<sup>c</sup>
                </span>
              </h1>
              <p className="text-gray-400 mt-4 text-lg sm:text-xl">
                {weekdays[new Date(weatherData?.location?.localtime).getDay()]},{" "}
                {weatherData?.location?.localtime.split(" ")[1]}
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <p className="text-gray-400 dark:text-gray-300">
                  {weatherData?.current?.condition?.text}
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center justify-center mt-8 p-4 bg-primary-light rounded-xl">
              <button
                onClick={handleClick}
                className="p-2 mr-2 rounded-full hover:bg-gray-500 text-white hover:text-red-500 transition-colors duration-200 shadow-md"
              >
                {isFilled ? (
                  <FaHeart size={24} color="red" />
                ) : (
                  <FaRegHeart size={24} color="white" />
                )}
              </button>
              <p className="text-gray-100">
                {weatherData?.location?.name}, {weatherData?.location?.country}
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="md:col-span-2">
          <div
            className="flex flex-row gap-4 cursor-pointer mb-4 pb-2 overflow-x-auto hide-scrollbar scrollbar-thin scrollbar-track-primary-dark scrollbar-thumb-primary-light
    hover:scrollbar-thumb-light
    [&::-webkit-scrollbar]:h-2
    [&::-webkit-scrollbar-track]:rounded-full
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-primary-light
    [&::-webkit-scrollbar-track]:bg-primary-dark
    [&::-webkit-scrollbar-thumb:hover]:bg-light"
          >
            {citiesWeatherData &&
              citiesWeatherData.map((city, i) => (
                <div
                  key={i}
                  onClick={() => setCity(city?.location?.name)}
                  className="flex flex-row items-center justify-between border border-primary-light shadow-sm w-[200px] flex-shrink-0 text-center py-2 px-3 bg-primary-main rounded-md hover:bg-primary-light transition-colors duration-300"
                >
                  <p className="text-gray-300 text-sm">
                    {city?.location?.name}
                  </p>
                  <img
                    src={city?.current?.condition?.icon}
                    alt="weather"
                    className="w-8 h-8 sm:w-10 sm:h-10 mx-2"
                  />
                  <p className="text-gray-300">{city?.current?.temp_c}°C</p>
                </div>
              ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-3">
            {/* Today Button */}
            <button
              onClick={() => setActiveTab("today")}
              className={`px-4 py-2 border-b-2 transition-colors duration-300 ${
                activeTab === "today"
                  ? "text-gray-100 border-blue-500"
                  : "text-gray-400 dark:text-gray-500 border-transparent"
              }`}
            >
              Today
            </button>

            {/* Week Button */}
            <button
              onClick={() => setActiveTab("week")}
              className={`px-4 py-2 border-b-2 transition-colors duration-300 ${
                activeTab === "week"
                  ? "text-gray-100 border-blue-500"
                  : "text-gray-400 dark:text-gray-500 border-transparent"
              }`}
            >
              Week
            </button>
          </div>

          <div
            className="flex flex-row gap-4 mb-4 pb-2 pt-2 overflow-x-auto scrollbar-thin scrollbar-track-primary-dark scrollbar-thumb-primary-light
    hover:scrollbar-thumb-light
    [&::-webkit-scrollbar]:h-2
    [&::-webkit-scrollbar-track]:rounded-full
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-primary-light
    [&::-webkit-scrollbar-track]:bg-primary-dark
    [&::-webkit-scrollbar-thumb:hover]:bg-light"
          >
            {activeTab === "week"
              ? weeklyData &&
                weeklyData?.forecast?.forecastday.map((forecastday, i) => (
                  <div
                    key={i}
                    className=" shadow-sm min-w-[100px] sm:min-w-[120px] text-center p-4 bg-primary-main rounded-xl"
                  >
                    <p className="text-gray-400">
                      {new Date(forecastday?.date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </p>
                    <img
                      src={forecastday?.day?.condition?.icon}
                      alt="weather"
                      className="w-8 h-8 sm:w-12 sm:h-12 mx-auto my-2"
                    />
                    <p className="text-gray-100 font-semibold">
                      {forecastday?.day?.avgtemp_c}°C
                    </p>
                  </div>
                ))
              : dailyData.length > 0 &&
                dailyData.map((forecasthour, i) => (
                  <div
                    key={i}
                    className=" shadow-sm min-w-[100px] sm:min-w-[120px] text-center p-4 bg-primary-main rounded-xl"
                  >
                    <p className="text-gray-400 text-sm">
                      {setTimeFormat(forecasthour?.time)}
                    </p>
                    <img
                      src={forecasthour?.condition?.icon}
                      alt="weather"
                      className="w-8 h-8 sm:w-12 sm:h-12 mx-auto my-2"
                    />
                    <p className="text-gray-100 font-semibold">
                      {forecasthour?.temp_c}°C
                    </p>
                  </div>
                ))}
          </div>

          {/* Today's Highlights */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4">
            Today's Highlights
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* UV Index */}
            <div className="bg-primary-main p-6 h-[7rem] rounded-xl shadow-sm">
              <h3 className="text-gray-400 mb-2">UV Index</h3>
              <div className="text-2xl sm:text-3xl font-bold text-gray-100">
                {weatherData?.current?.uv}
              </div>
            </div>

            {/* Wind Status */}
            <div className="bg-primary-main p-6 h-[7rem] rounded-xl shadow-sm">
              <h3 className="text-gray-400 mb-2">Wind Status</h3>
              <div className="text-2xl sm:text-3xl font-bold text-gray-100">
                {weatherData?.current?.wind_kph}
                <span className="text-lg sm:text-xl font-normal"> km/h</span>
              </div>
            </div>

            {/* Sunrise & Sunset */}
            <div className="bg-primary-main p-6 h-[7rem] rounded-xl shadow-sm">
              <h3 className="text-gray-400 mb-2">Pressure</h3>
              <div className="text-2xl sm:text-3xl font-bold text-gray-100">
                {weatherData?.current?.pressure_in}
              </div>
            </div>

            {/* Humidity */}
            <div className="bg-primary-main p-6 h-[7rem] rounded-xl shadow-sm">
              <h3 className="text-gray-400 mb-2">Humidity</h3>
              <div className="text-2xl sm:text-3xl font-bold text-gray-100">
                {weatherData?.current?.humidity}
                <span className="text-lg sm:text-xl font-normal">%</span>
              </div>
            </div>

            {/* Visibility */}
            <div className="bg-primary-main p-6 h-[7rem] rounded-xl shadow-sm">
              <h3 className="text-gray-400 mb-2">Visibility</h3>
              <div className="text-2xl sm:text-3xl font-bold text-gray-100">
                {weatherData?.current?.vis_km}
                <span className="text-lg sm:text-xl font-normal"> km</span>
              </div>
            </div>

            {/* Air Quality */}
            <div className="bg-primary-main p-6 h-[7rem] rounded-xl shadow-sm">
              <h3 className="text-gray-400 mb-2">Cloud</h3>
              <div className="text-2xl sm:text-3xl font-bold text-gray-100">
                {weatherData?.current?.cloud}
                <span className="text-lg sm:text-xl font-normal">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Link href="/wishlist" style={{ textDecoration: "none" }}>
        <button
          className="p-2 rounded-full bg-white hover:bg-gray-500 fixed bottom-6 right-6 shadow-md"
        >
          <FaRegHeart size={28} color="red" />
        </button>
      </Link>
    </main>
  );
}
