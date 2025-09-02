import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import shadow from "../images/shadow.jpg";
import hd from "../images/hd.png";
import tap from "../images/tap.jpg";

const MultiHome = () => {
  const containerRef = useRef(null);

  const cards = [
    {
      id: 1,
      title: "Seamless Device Access",
      desc: "Enjoy gaming across smartphones, desktops, and set-top boxes with uninterrupted single sign-on access.",
      img: shadow,
      position: "top-[80px]",
    },
    {
      id: 2,
      title: "Crystal Clear Gaming",
      desc: "High-quality cloud gaming, 1080p resolution, zero hidden fees.",
      img: hd,
      position: "top-[100px]",
    },
    {
      id: 3,
      title: "One-Tap Gaming",
      desc: "Stream games directly from the cloud and start playing in seconds",
      img: tap,
      position: "top-[120px]",
    },
  ];

  return (
    <div className="relative w-full max-w-[95%] md:max-w-[85%] my-5 mx-auto">
      {/* this wrapper is our scroll container */}
      <div ref={containerRef} className="relative h-[300vh]">
        {cards.map((card, i) => (
          <StackingCard
            key={card.id}
            card={card}
            index={i}
            containerRef={containerRef}
          />
        ))}
      </div>
    </div>
  );
};

const StackingCard = ({ card, index, containerRef }) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Define input and output ranges with consistent lengths
  const inputRange = index === 0 
    ? [0, 1]  // For first card, use full range
    : [0 + (index - 1) * 0.2, 0.4 + (index - 1) * 0.2];
  
  const yOutputRange = index === 0 
    ? [0, 0]  // Stay at 0 for first card
    : [100, 0];  // Slide up for subsequent cards
  
  const opacityOutputRange = index === 0
    ? [1, 1]  // Stay fully opaque for first card
    : [0, 1];  // Fade in for subsequent cards

  const y = useTransform(
    scrollYProgress,
    inputRange,
    yOutputRange
  );

  const opacity = useTransform(
    scrollYProgress,
    inputRange,
    opacityOutputRange
  );

  return (
    <motion.div
      className={`sticky ${card.position} flex items-center justify-center`}
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        style={{ y, opacity }}
        className="relative w-full ms:rounded-[35px] rounded-[10px] overflow-hidden shadow-2xl"
      >
        <motion.img
          src={card.img}
          alt={card.title}
          className="w-full h-[80vh] object-cover ds_multi_img"
        />
        <div className={`absolute ${card.position} text-white ms:p-11 p-5`}>
          <h2 className="lg:text-[38px] md:text-[34px] sm:text-[30px] text-[26px] font-[700] drop-shadow-lg">
            {card.title}
          </h2>
          <h4 className="lg:text-[22px] sm:text-[19px] text-[16px] mt-3 leading-relaxed drop-shadow">
            {card.desc}
          </h4>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MultiHome;
