import React, { useState } from "react";

const faqs = [
  {
    question: "What is YOYO and how does it work?",
    answer:
      "YOYO is a comprehensive gaming platform that allows you to discover, play, and purchase games. You can earn rewards through gameplay, referrals, and daily activities, chat with other gamers, and build your gaming profile.",
  },
  {
    question: "What types of games are available on YOYO?",
    answer:
      "YOYO offers a wide variety of games including action, adventure, puzzle, strategy, and more. We regularly update our game library with new releases and popular titles across different platforms.",
  },
  {
    question: "Can I play games for free on YOYO?",
    answer:
      "Yes! YOYO offers many free games that you can play without any cost. Some premium games may require purchase, but we also provide free trials and demo versions.",
  },
  {
    question: "How do I find games that match my interests?",
    answer:
      "Use our category filters, browse trending and popular games, or check out our personalized recommendations based on your gaming history and preferences.",
  },
  {
    question: "When does referral reward get credited to my account?",
    answer: "The referral reward gets credited to your account within 24 hours.",
  },
  {
    question: "What should I do if my referral reward is not credited?",
    answer:
      "In the event that your referral reward is not credited, please reach out to our support team. We are here to assist you.",
  },
  {
    question: "Can I get a refund for purchased games?",
    answer:
      "Refund policies vary by game and are subject to our terms of service. Generally, refunds are available within a limited time frame if the game hasn’t been played extensively.",
  },
  {
    question: "How does the chat system work?",
    answer:
      "GGTalks is our real-time chat system where you can connect with other gamers. You can send messages, see when someone is typing, and build your gaming community.",
  },
  {
    question: "Is my chat private and secure?",
    answer:
      "Yes, all chats are private between users. We implement strong security measures to protect your conversations and personal information.",
  },
  {
    question: "How do I update my profile information?",
    answer:
      "Go to your Profile page and click the edit button next to any field you want to update. You can modify your personal details, gaming preferences, and profile picture.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-[95%] md:max-w-[85%] mx-auto py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 underline underline-offset-4">
        Frequently Asked Questions
      </h1>

      <div className="space-y-4 sm:pt-5"> {/* adds spacing between each accordion */}
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-700  shadow-lg"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center py-5 px-4 md:px-6 text-left text-white font-semibold"
            >
              <span>{faq.question}</span>
              <span
                className={`transform transition-transform duration-300 ${
                  openIndex === index ? "rotate-45 text-pink-400" : "rotate-0"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                </svg>
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out mx-4 md:mx-6 ${
                openIndex === index ? "max-h-40 pb-4 border-t-[1px]  border-slate-700" : "max-h-0  border-slate-700"
              }`}
            >
              <p className="text-sm text-slate-300 mt-3">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
