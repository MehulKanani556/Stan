import React, { memo, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { useDispatch, useSelector } from "react-redux";
import { getHomeTrailer } from "../Redux/Slice/game.slice";
import TrailerSkeleton from "../lazyLoader/TrailerSkeleton";
import { NavLink } from "react-router-dom";

const Trailer = () => {
  const swiperRef = useRef(null);
  const videoRefs = useRef([]);
  const { trailer, loading, error } = useSelector((state) => state?.game);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    // if (!trailer) {
      dispatch(getHomeTrailer()).then((value) => {
        if (value?.meta?.requestStatus === "fulfilled") {
          setLoader(false)
        }
      });
    // }

  }, [dispatch]);

  const handleSlideChange = (swiper) => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === swiper.activeIndex) {
          video.currentTime = 0;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn("Video play interrupted:", error);
            });
          }
        } else {
          video.pause();
        }
      }
    });
  };

  return (
    <div className="">
      {loader && <TrailerSkeleton />}
      {!loader && <Swiper
        className="ds_trailer"
        modules={[Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        loop={true}
        onSlideChange={handleSlideChange}
      >
        {trailer?.map((element, index) => (
          <SwiperSlide key={element?._id || index}>
            <div className="flex justify-center xl:h-[900px] lg:h-[850px] md:h-[750px] ms:h-[550px] h-[400px] relative">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={element?.trailer}
                autoPlay={index === 0}
                muted
                loop
                className="w-full h-full object-cover shadow-lg bg-black"
                onError={(e) => {
                  console.error("Video failed to load:", element?.trailer);
                  e.target.style.display = "none";
                }}
              />
              <div className="absolute xl:w-1/3 ms:w-1/2 md:top-[40%] ms:top-[25%] top-[15px] left-[20px]">
                <h2
                  className="ms:text-[40px] text-[24px] text-gray-300 font-[700]"
                  style={{ fontFamily: "arial, cursive" }}
                >
                  {element?.title || "Untitled"}
                </h2>
                <p className="mt-2 ms:text-[16px] text-[14px]">
                  {element.description || "No description available"}
                </p>
                {element?.link && (
                  <NavLink
                    to={"/store"}
                    className="bg-white rounded-[5px] border-[1px] block text-center border-white text-black ms:w-[150px] w-[100px] py-2 mt-5 hover:bg-transparent hover:text-white ease-in-out transition-all duration-300"
                  >
                    View More
                  </NavLink>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>}
    </div>
  );
};

export default memo(Trailer);
