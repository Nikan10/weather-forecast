"use client";

import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

const Wishlist = () => {
  const wishList = JSON.parse(localStorage.getItem("wishList"));
  const [isFilled, setIsFilled] = useState(false);

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];


  const handleClick = (item) => {
    setIsFilled(!isFilled);
    handleWishlist(item);
  };

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

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-7xl mt-6 mx-auto grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {wishList && wishList.length > 0 ? (
          wishList.map((item, i) => {
            let isFilled = false
            if (
              wishList.some(
                (wish) => wish.location.name === item?.location?.name
              )
            ) {
              isFilled = true;
            } else {
              isFilled = false;
            }
            return (
              <div key={i} className="bg-primary-main shadow-sm rounded-xl p-6">
                {/* Current Weather */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto sm:w-48 sm:h-48">
                    <img
                      src={item?.current?.condition?.icon}
                      alt="weather"
                      className="w-full h-full"
                    />
                  </div>

                  <div className="mt-8">
                    <h1 className="text-5xl sm:text-8xl text-gray-100">
                      {item?.current?.temp_c}
                      <span>
                        °<sup>c</sup>
                      </span>
                    </h1>
                    <p className="text-gray-400 mt-4 text-lg sm:text-xl">
                      {weekdays[new Date(item?.location?.localtime).getDay()]},{" "}
                      {item?.location?.localtime.split(" ")[1]}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <p className="text-gray-400 dark:text-gray-300">
                        {item?.current?.condition?.text}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-center mt-8 p-4 bg-primary-light rounded-xl">
                    <button
                      onClick={() => handleClick(item)}
                      className="p-2 mr-2 rounded-full hover:bg-gray-500 text-white hover:text-red-500 transition-colors duration-200 shadow-md"
                    >
                      {isFilled ? (
                        <FaHeart size={24} color="red" />
                      ) : (
                        <FaRegHeart size={24} color="white" />
                      )}
                    </button>
                    <p className="text-gray-100">
                      {item?.location?.name}, {item?.location?.country}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-screen w-full">
            <div className="text-center text-white">No items in the list</div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Wishlist;
