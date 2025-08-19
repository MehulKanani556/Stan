import React from 'react';

const GameCard = ({ image, title, price, status }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-800 transition-all duration-200 cursor-pointer group">
    <img
      src={image}
      alt={title}
      className="w-16 h-20 rounded-md object-cover flex-shrink-0 group-hover:ring-2 group-hover:ring-purple-500 transition-all"
      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x80/2d2d2d/ffffff?text=Game"; }}
    />
    <div className="min-w-0 flex-1">
      <h3 className="text-white text-sm font-medium truncate">{title}</h3>
      <div className="flex items-center gap-2 mt-1">
        {price && (
          price === "Free" ? (
            <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">FREE</span>
          ) : (
            <span className="text-gray-300 text-xs">{price}</span>
          )
        )}
        {status && <span className="text-purple-400 text-xs italic">{status}</span>}
      </div>
    </div>
  </div>
);

function TopGames() {
  const sections = [
    {
      title: "Top Add-Ons",
      items: [
        { image: "https://placehold.co/64x80/1a1a1a/e0e0e0?text=Bundle", title: "Bee Positive Pack", price: "₹332" },
        { image: "https://placehold.co/64x80/2c2c2c/e0e0e0?text=Pack", title: "Hexed & Haunted Pack", price: "₹1,332" },
        { image: "https://placehold.co/64x80/3d3d3d/e0e0e0?text=RL", title: "Rocket League S19 Veteran", price: "₹369" },
        { image: "https://placehold.co/64x80/4f4f4f/e0e0e0?text=RL", title: "Rocket League Rocketeer", price: "₹1,479" },
        { image: "https://placehold.co/64x80/5a5a5a/e0e0e0?text=DLC", title: "Cyberpunk: Phantom Liberty", price: "₹1,499" },
        { image: "https://placehold.co/64x80/6a6a6a/e0e0e0?text=DLC", title: "Shadow Realms Expansion", price: "₹899" },
      ],
    },
    {
      title: "Top Free Games",
      items: [
        { image: "https://placehold.co/64x80/0d0d0d/e0e0e0?text=Fortnite", title: "Fortnite Battle Royale", price: "Free" },
        { image: "https://placehold.co/64x80/202020/e0e0e0?text=RL", title: "Rocket League", price: "Free" },
        { image: "https://placehold.co/64x80/333333/e0e0e0?text=Genshin", title: "Genshin Impact", price: "Free" },
        { image: "https://placehold.co/64x80/454545/e0e0e0?text=Honkai", title: "Honkai: Star Rail", price: "Free" },
        { image: "https://placehold.co/64x80/585858/e0e0e0?text=ZZZ", title: "Zenless Zone Zero", price: "Free" },
        { image: "https://placehold.co/64x80/6b6b6b/e0e0e0?text=Apex", title: "Apex Legends", price: "Free" },
      ],
    },
    {
      title: "Top New",
      items: [
        { image: "https://placehold.co/64x80/1c1c1c/e0e0e0?text=Beta", title: "Battlefield 6 Open Beta", status: "Live Now" },
        { image: "https://placehold.co/64x80/2e2e2e/e0e0e0?text=Demo", title: "Prologue Demo", status: "Live Now" },
        { image: "https://placehold.co/64x80/414141/e0e0e0?text=Demo", title: "Hell Is Us Demo", status: "Live Now" },
        { image: "https://placehold.co/64x80/545454/e0e0e0?text=Demo", title: "Half Sword Demo", status: "Try Now" },
        { image: "https://placehold.co/64x80/666666/e0e0e0?text=FC25", title: "EA SPORTS FC™ 25", status: "Demo" },
        { image: "https://placehold.co/64x80/797979/e0e0e0?text=Demo", title: "Mystic Forge Demo", status: "Coming Soon" },
      ],
    },
  ];
  
  return (
    <div className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, i) => (
            <div key={i} className="bg-gray-950 p-5 rounded-xl border border-gray-800  transition-colors">
              <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-800 text-purple-400">{section.title}</h2>
              <div className="grid gap-3">
                {section.items.map((item, j) => (
                  <GameCard key={j} {...item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopGames;