import React from "react";
import guide1 from "../images/guide1.jpg";
import guide2 from "../images/guide2.png";
import guide3 from "../images/guide3.jpg";
import { useDispatch } from "react-redux";
import { chatToggleFunc } from "../Redux/Slice/user.slice";
import { Link } from "react-router-dom";

function Guides() {
  return (
    <div className="font-inter text-white">
      <SupportPage />
    </div>
  );
}

const SupportPage = () => {

  const dispatch = useDispatch()

  return (
    <div className="w-full ">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-800 via-purple-900/60 to-[#332a77] text-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 drop-shadow-lg">
            Game Guides
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed">
            Stuck with downloads, payments, or just getting started?
            This is your one-stop hub for help, guides, and troubleshooting.
          </p>
        </div>
      </section>


      {/* Sections - Modified to alternate as requested */}
      <SectionWrapper
        title="Getting Started"
        description="New to the store? Learn how to browse, buy, and play your favorite titles."
        img={guide1}
        items={[
          { title: "Browse Games", text: "Search or filter to discover new titles and reviews." },
          { title: "Purchase Games", text: "pay securely with cards or digital wallets." },
          { title: "Download & Install", text: "Head to your Library, hit download, and start playing." },
        ]}
        // First section - image on the right
        flip={true}
      />

      <SectionWrapper
        title="Troubleshooting"
        description="Common issues solved quickly — no stress, just play."
        img={guide2}
        items={[
          { title: "Download Issues", text: "Check your connection or restart the download." },
          { title: "Crashes", text: "Update your drivers and verify your game files." },
          { title: "Payment Failed", text: "Confirm details or try another method." },
        ]}
        // Second section - image on the left
        flip={false}
      />

      <SectionWrapper
        title="Account Management"
        description="Control your profile, preferences, and login details with ease."
        img={guide3}
        items={[
          { title: "Create Account", text: "Sign up in minutes and set up your profile." },
          { title: "Update Settings", text: "Change email, password, or preferences anytime." },
          { title: "Recover Password", text: "Reset via the Forgot Password link on login." },
        ]}
        flip={true}
      />

      <section className="relative py-6 sm:py-8 md:py-16 lg:py-20  overflow-hidden w-[95%] md:w-[85%] mx-auto">
        <div className="absolute inset-0 bg-purple-500/10 blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center text-white">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold mb-4 tracking-wide">
            Still Need Help?{" "}
            <span className="text-purple-400">We’ve Got You</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto sm:mb-12 mb-6 text-base sm:text-lg">
            Our team is here to get you back in the game quickly. Choose the option that works best for you:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left">
            <div className="group bg-gradient-to-b from-purple-900/40 to-black/40 p-6 rounded-2xl border border-purple-500/30 shadow-md hover:shadow-purple-500/30 hover:border-purple-400 transition transform hover:-translate-y-1">
              <h3 className="font-semibold text-lg md:text-xl mb-3">
                Email
              </h3>
              <a
                href="mailto:info@yoyokhel.com"
                className="text-purple-400 group-hover:text-purple-300 font-medium hover:underline break-all"
              >
                info@yoyokhel.com
              </a>
            </div>

            <div className="group bg-gradient-to-b from-purple-900/40 to-black/40 p-6 rounded-2xl border border-purple-500/30 shadow-md hover:shadow-purple-500/30 hover:border-purple-400 transition transform hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg md:text-xl mb-3">
                  Chat With Us
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  You will have all answers of your questions
                </p>
              </div>
              <button onClick={() => dispatch(chatToggleFunc(true))} className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-semibold transition">
                Start Chat
              </button>
            </div>

            <div className="group bg-gradient-to-b from-purple-900/40 to-black/40 p-6 rounded-2xl border border-purple-500/30 shadow-md hover:shadow-purple-500/30 hover:border-purple-400 transition transform hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg md:text-xl mb-3">
                  FAQs
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Find answers to common questions
                </p>
              </div>
              <Link
                to="/faqs"
                className="w-full text-center py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-semibold transition inline-block"
              >
                View FAQs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const SectionWrapper = ({ title, description, img, items, flip }) => {



  return (
    <section className="py-6 md:py-10  w-[95%] md:w-[85%] mx-auto">
      <div className={`w-full max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${flip ? "md:grid-flow-dense" : ""}`}>

        {/* Content */}
        <div className={`${flip ? "md:col-start-2" : ""} order-2 md:order-1`}>
          <h2 className="text-2xl md:text-3xl font-bold text-purple-400 mb-4">{title}</h2>
          <p className="text-gray-300 mb-6">{description}</p>
          <ul className="space-y-4">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="bg-black/40 p-4 rounded-lg border border-purple-500/30 hover:border-purple-400 transition"
              >
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Image */}
        <div className={`${flip ? "md:col-start-1 md:row-start-1" : ""} order-1 md:order-2`}>
          <div className="w-full h-[300px] md:h-[350px] overflow-hidden rounded-xl border border-purple-500/30 shadow-lg">
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};


export default Guides;