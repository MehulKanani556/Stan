import React, { useEffect, useRef, useState } from "react";
import { PiUser, PiUsersThree, PiHourglass, PiMoneyLight, } from "react-icons/pi";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Filler, } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryByGame, getDashboardStats, getRecentTransactions, getTopCategories, getTopGamesDashboard, getTopPlatform, } from "../Redux/Slice/dashboard.slice";
import { useNavigate } from "react-router-dom";
import { BsCartCheck } from "react-icons/bs";
import { FaWindows, FaXbox } from "react-icons/fa";
import { SiOculus, SiPlaystation } from "react-icons/si";
import { TbDeviceVisionPro } from "react-icons/tb";
import { BsNintendoSwitch } from "react-icons/bs";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function AdminDashboard() {
  const [filter, setFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    DashboardStats,
    CategoryByGame,
    topGames,
    recentTransactions,
    topCategories,
    topPlatform,
  } = useSelector((state) => state.dashboard);

  // Directional hover utilities
  function getDirection(event, element) {
    const baseEl = event?.currentTarget || element;
    if (!baseEl) return "top";
    const rect = baseEl.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const x = (event.clientX - rect.left - w / 2) * (w > h ? h / w : 1);
    const y = (event.clientY - rect.top - h / 2) * (h > w ? w / h : 1);
    const d = Math.round(
      ((Math.atan2(y, x) + Math.PI) / (Math.PI / 2) + 2) % 4
    );
    // 0: right, 1: bottom, 2: left, 3: top
    if (d === 0) return "right";
    if (d === 1) return "bottom";
    if (d === 2) return "left";
    return "top";
  }

  function mapDirToTransform(direction) {
    switch (direction) {
      case "left":
        return "translate3d(-100%, 0, 0)";
      case "right":
        return "translate3d(100%, 0, 0)";
      case "top":
        return "translate3d(0, -100%, 0)";
      case "bottom":
      default:
        return "translate3d(0, 100%, 0)";
    }
  }

  function HoverCard({
    className = "",
    children,
    roundedClass = "rounded-lg",
  }) {
    const cardRef = useRef(null);
    const isLeavingRef = useRef(false);
    const enterRafRef = useRef(0);
    const [overlayTransform, setOverlayTransform] = useState(
      "translate3d(0, 0, 0)"
    );
    const [overlayOpacity, setOverlayOpacity] = useState(0);

    const handleEnter = (e) => {
      const dir = getDirection(e, cardRef.current);
      isLeavingRef.current = false;
      setOverlayOpacity(1);
      setOverlayTransform(mapDirToTransform(dir));
      if (enterRafRef.current) cancelAnimationFrame(enterRafRef.current);
      enterRafRef.current = requestAnimationFrame(() => {
        setOverlayTransform("translate3d(0, 0, 0)");
        enterRafRef.current = 0;
      });
    };

    const handleLeave = (e) => {
      const dir = getDirection(e, cardRef.current);
      isLeavingRef.current = true;
      if (enterRafRef.current) {
        cancelAnimationFrame(enterRafRef.current);
        enterRafRef.current = 0;
      }
      setOverlayOpacity(0);
      setOverlayTransform(mapDirToTransform(dir));
    };

    const handleTransitionEnd = () => {
      if (isLeavingRef.current) {
        setOverlayOpacity(0);
        isLeavingRef.current = false;
      }
    };

    useEffect(() => {
      return () => {
        if (enterRafRef.current) cancelAnimationFrame(enterRafRef.current);
      };
    }, []);

    return (
      <div
        ref={cardRef}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        className={`relative overflow-hidden ${roundedClass} ${className}`}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${roundedClass} bg-white/5 border border-transparent transition-all duration-300 ease-out`}
          style={{
            transform: overlayTransform,
            opacity: overlayOpacity,
            willChange: "transform, opacity",
            zIndex: 1,
          }}
          onTransitionEnd={handleTransitionEnd}
        />
        {children}
      </div>
    );
  }

  const handleToggleExpand = (transactionId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [transactionId]: !prev[transactionId],
    }));
  };

  useEffect(() => {
    dispatch(getDashboardStats(filter));
    dispatch(getCategoryByGame(filter));
    dispatch(getTopGamesDashboard(filter));
    dispatch(getRecentTransactions(filter));
    dispatch(getTopCategories(filter));
    dispatch(getTopPlatform(filter));
  }, [filter, dispatch]);

  const Linechartdata = {
    labels: topPlatform.map((revenue) => revenue.platform),
    datasets: [
      {
        label: "order",
        data: topPlatform.map((revenue) => revenue.totalOrders),
        borderColor: "#6263ED",
        backgroundColor: "6263ED",
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const Linechartoptions = {
    responsive: true,
    showline: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "center",
        labels: {
          color: "#9ca3af",
          usePointStyle: true,
          pointStyle: "line",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        // borderColor: '#374151',
        // borderWidth: 1,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
          color: "rgba(75, 85, 99, 0.3)",
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        display: true,
        min: 0,
        // max: 400,
        ticks: {
          stepSize: 100,
          color: "#9ca3af",
          font: {
            size: 12,
          },
          callback: function (value) {
            return value + ".00";
          },
        },
        grid: {
          display: true,
          color: "rgba(75, 85, 99, 0.3)",
        },
        border: {
          display: false,
        },
      },
    },
  };

  const barchartdata = {
    labels: topCategories
      .slice(0, 5)
      .map((revenue) => revenue.category.categoryName),
    datasets: [
      {
        label: "Order Category",
        data: topCategories.slice(0, 5).map((revenue) => revenue.totalOrders),
        backgroundColor: "#6263ED",
        borderColor: "#6263ED",
        borderWidth: 0,
      },
    ],
  };

  const barchartoptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "center",
        labels: {
          color: "#9ca3af",
          usePointStyle: true,
          pointStyle: "rect",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#374151",
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        stacked: true,
        grid: {
          display: true,
          color: "rgba(75, 85, 99, 0.3)",
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        display: true,
        stacked: true,
        min: 0,
        // max: 5,
        ticks: {
          stepSize: 1,
          color: "#9ca3af",
          font: {
            size: 12,
          },
          callback: function (value) {
            return value;
          },
        },
        grid: {
          display: true,
          color: "rgba(75, 85, 99, 0.3)",
        },
        border: {
          display: false,
        },
      },
    },
  };

  const barchart2data = {
    labels: CategoryByGame?.map((cat) => cat.categoryName) || [],
    datasets: [
      {
        data: CategoryByGame?.map((cat) => cat.gameCount) || [],
        backgroundColor: "#6263ED",
        borderColor: "#00C6FF",
        borderWidth: 0,
      },
    ],
  };

  const barchart2options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: function (context) {
            return `Game : ${context.formattedValue} `;
          },
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        stacked: true,
        grid: {
          display: true,
          color: "rgba(75, 85, 99, 0.3)",
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 12,
          },
          maxRotation: 90, // Rotate labels vertically
          minRotation: 90, // Force vertical rotation
        },
        border: {
          display: false,
        },
      },
      y: {
        display: true,
        stacked: true,
        min: 0,
        // max: 12,
        ticks: {
          stepSize: 2,
          color: "#9ca3af",
          font: {
            size: 12,
          },
          callback: function (value) {
            return value;
          },
        },
        grid: {
          display: true,
          color: "rgba(75, 85, 99, 0.3)",
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="p-5 md:p-10">
      <div className="text-end mb-5">
        <div
          className="inline-block rounded p-[1px]"
          style={{
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
          }}
        >
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded text-sm p-1 sm:p-2 bg-[#141414] text-white focus:outline-none w-full"
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <div
          onClick={() => {
            navigate("/admin/user");
          }}
          className="p-[2px] rounded-lg transition-all hover:scale-[1.02]"
          style={{
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
          }}
        >
          <HoverCard
            className={`bg-[#141414] flex justify-between items-center p-3 md600:p-6 rounded-lg cursor-pointer`}
          >
            <div className="flex items-center justify-between md600:mb-4">
              <PiUser className="w-6 h-6 text-white" />
            </div>
            <div className="text-end">
               <div className="text-2xl md:text-3xl xl:text-2xl 2xl:text-3xl font-bold text-white mb-2">
                {DashboardStats?.totalUsers}
              </div>
              <div className="text-white text-sm">Total Users</div>
            </div>
          </HoverCard>
        </div>
        <div
          onClick={() => {
            navigate("/admin/order");
          }}
          className="p-[2px] rounded-lg transition-all hover:scale-[1.02]"
          style={{
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
          }}
        >
          <HoverCard
            className={`bg-[#141414] flex justify-between items-center p-3 md600:p-6 rounded-lg cursor-pointer`}
          >
            <div className="flex items-center justify-between md600:mb-4">
              <BsCartCheck className="w-6 h-6 text-white" />
            </div>
            <div className="text-end">
               <div className="text-2xl md:text-3xl xl:text-2xl 2xl:text-3xl font-bold text-white mb-2">
                {DashboardStats?.totalOrders}
              </div>
              <div className="text-white text-sm">Total Orders</div>
            </div>
          </HoverCard>
        </div>
        <div
          onClick={() => {
            navigate("/admin/games");
          }}
          className="p-[2px] rounded-lg transition-all hover:scale-[1.02]"
          style={{
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
          }}
        >
          <HoverCard
            className={`bg-[#141414] flex justify-between items-center p-3 md600:p-6 rounded-lg cursor-pointer`}
          >
            <div className="flex items-center justify-between md600:mb-4">
              <PiHourglass className="w-6 h-6 text-white" />
            </div>
            <div className="text-end">
               <div className="text-2xl md:text-3xl xl:text-2xl 2xl:text-3xl font-bold text-white mb-2">
                {DashboardStats?.totalGames}
              </div>
              <div className="text-white text-sm">Total Games</div>
            </div>
          </HoverCard>
        </div>
        <div
          onClick={() => {
            navigate("/admin/order");
          }}
          className="p-[2px] rounded-lg transition-all hover:scale-[1.02]"
          style={{
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
          }}
        >
          <HoverCard
            className={`bg-[#141414] flex justify-between items-center p-3 md600:p-6 rounded-lg cursor-pointer`}
          >
            <div className="flex items-center justify-between md600:mb-4">
              <PiMoneyLight className="w-6 h-6 text-white" />
            </div>
            <div className="text-end">
              <div className="text-2xl md:text-3xl xl:text-2xl 2xl:text-3xl font-bold text-white mb-2">
                {DashboardStats?.totalRevenue}
              </div>
              <div className="text-white text-sm">Total Revenue</div>
            </div>
          </HoverCard>
        </div>
      </div>

      <div className="grid grid-cols-1 mt-6">
        <div
          className="p-[2px] rounded-lg"
          style={{
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
          }}
        >
          <HoverCard className="bg-[#141414] rounded-lg p-3 md600:p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base md600:text-xl font-semibold text-white">
                Category
              </h2>
            </div>

            {/* Donut Chart */}
            <div className="">
              <Bar data={barchart2data} options={barchart2options} />
            </div>
          </HoverCard>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mt-6">
        <div
          className="p-[2px] rounded-lg"
          style={{
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
          }}
        >
          <HoverCard className="bg-[#141414] rounded-lg p-3 md600:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base md600:text-xl font-semibold text-white">
                Top Platform
              </h2>
            </div>

            {/* Line Chart */}
            <div>
              <Line data={Linechartdata} options={Linechartoptions} />
            </div>
          </HoverCard>
        </div>

        <div
          className="p-[2px] rounded-lg"
          style={{
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
          }}
        >
          <HoverCard className="bg-[#141414] rounded-lg p-3 md600:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base md600:text-xl font-semibold text-white">
                Top Category
              </h2>
            </div>

            {/* Bar 1 Chart */}
            <div>
              <Bar data={barchartdata} options={barchartoptions} />
            </div>
          </HoverCard>
        </div>
      </div>

      <div className="grid grid-cols-1">
        <div
          className="mt-6 p-[2px] rounded-lg"
          style={{
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
          }}
        >
          <HoverCard className="bg-[#141414] rounded-lg p-3 md600:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base md600:text-xl font-semibold text-white">
                Top Games
              </h2>
              {/* <button onClick={() => { navigate('/admin/transaction') }} className="text-[#00C6FF] hover:text-[#0072FF] transition-colors duration-300 ease-in-out text-sm font-medium">
                View All
              </button> */}
            </div>

            <div className="h-[250px] overflow-auto scrollbar-hide">
              <table className="w-full">
                <thead className="sticky top-0 bg-[#202020] z-50">
                  <tr>
                    <th className="text-left text-gray-400 font-medium text-sm py-2 px-4">
                      Name
                    </th>
                    <th className="text-left text-gray-400 font-medium text-sm py-2 px-4">
                      Platforms
                    </th>
                    <th className="text-center text-gray-400 font-medium text-sm py-2 px-4 whitespace-nowrap">
                      Total Orders
                    </th>
                    <th className="text-center text-gray-400 font-medium text-sm py-2 px-4 whitespace-nowrap">
                      Total Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topGames.slice(0, 10).map((game, index) => (
                    <tr key={index} className={`border-slate-700/50 border-b`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={game?.game?.cover_image?.url}
                            alt={game?.game?.title}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="text-white font-medium text-sm whitespace-nowrap">
                            {game?.game?.title}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {game.platforms.windows.count > 0 && (
                            <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded font-semibold whitespace-nowrap flex items-center gap-1">
                              <FaWindows className="text-base" />: {game.platforms.windows.count}
                            </span>
                          )}
                          {game.platforms.xbox.count > 0 && (
                            <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded font-semibold whitespace-nowrap flex items-center gap-1">
                              <FaXbox className="text-base" />: {game.platforms.xbox.count}
                            </span>
                          )}
                          {game.platforms.ps5.count > 0 && (
                            <span className="bg-blue-800/20 text-blue-600 text-xs px-2 py-1 rounded font-semibold whitespace-nowrap flex items-center gap-1">
                              <SiPlaystation className="text-base" />: {game.platforms.ps5.count}
                            </span>
                          )}
                          {game.platforms.quest.count > 0 && (
                            <span className="bg-indigo-600/20 text-indigo-400 text-xs px-2 py-1 rounded font-semibold whitespace-nowrap flex items-center gap-1">
                              <SiOculus className="text-base" />: {game.platforms.quest.count}
                            </span>
                          )}
                          {game.platforms.vision_pro.count > 0 && (
                            <span className="bg-gray-700/20 text-gray-400 text-xs px-2 py-1 rounded font-semibold whitespace-nowrap flex items-center gap-1">
                              <TbDeviceVisionPro className="text-base" />:{" "}
                              {game.platforms.vision_pro.count}
                            </span>
                          )}
                          {(game.platforms.nintendo_switch_1.count > 0 || game.platforms.nintendo_switch_2.count > 0) && (
                            <span className="bg-red-600/20 text-red-400 text-xs px-2 py-1 rounded font-semibold whitespace-nowrap flex items-center gap-1">
                              <BsNintendoSwitch className="text-base" />:{" "}
                              {game.platforms.nintendo_switch_1.count +
                                game.platforms.nintendo_switch_2.count}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm text-center">
                        {game.totalOrders}
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm text-center">
                        {game.totalRevenue}
                      </td>
                    </tr>
                  ))}

                  {topGames.length == 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4 text-gray-400"
                      >
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </HoverCard>
        </div>

        <div
          className="mt-6 p-[2px] rounded-lg"
          style={{
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
          }}
        >
          <HoverCard className="bg-[#141414] rounded-lg p-3 md600:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base md600:text-xl font-semibold text-white">
                Recent Orders
              </h2>
              <button
                onClick={() => {
                  navigate("/admin/order");
                }}
                className="text-gray-400 hover:text-white transition-colors duration-300 ease-in-out text-sm font-medium"
              >
                View All
              </button>
            </div>

            <div className="h-[250px] overflow-auto scrollbar-hide">
              <table className="w-full">
                <thead className="sticky top-0 bg-[#202020] z-50">
                  <tr>
                    <th className="text-left text-gray-400 font-medium text-sm py-2 px-4">
                      Order ID
                    </th>
                    <th className="text-left text-gray-400 font-medium text-sm py-2 px-4">
                      Name
                    </th>
                    <th className="text-left text-gray-400 font-medium text-sm py-2 px-4">
                      Items
                    </th>
                    <th className="text-center text-gray-400 font-medium text-sm py-2 px-4 whitespace-nowrap">
                      Total Amount
                    </th>
                    <th className="text-center text-gray-400 font-medium text-sm py-2 px-4">
                      Status
                    </th>
                    <th className="text-center text-gray-400 font-medium text-sm py-2 px-4">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.slice(0, 10).map((transaction, index) => (
                    <tr key={index} className={`border-slate-700/50 border-b`}>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        #{transaction.orderId.slice(-8)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-white font-medium text-sm">
                          {transaction?.fullName}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {transaction?.userEmail}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-xs text-center">
                        {transaction.items && transaction.items.length > 0 ? (
                          <div>
                            {(expandedRows[transaction.orderId]
                              ? transaction.items
                              : transaction.items.slice(0, 1)
                            ).map((item, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center justify-between gap-2 ${idx !== transaction.items.length - 1
                                    ? "mb-2"
                                    : "mb-0"
                                  }`}
                              >
                                <div className="flex gap-2">
                                  {item.gameImage ? (
                                    <img
                                      src={item.gameImage}
                                      alt={item.gameTitle}
                                      className="w-8 h-8 rounded-full object-cover z-0"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-white/10 uppercase text-xs flex items-center justify-center whitespace-nowrap">
                                      <span className="font-semibold">
                                        {item.gameTitle}
                                      </span>
                                    </div>
                                  )}
                                  <div className="text-start whitespace-nowrap">
                                    <span className="font-semibold">
                                      {item.gameTitle}
                                    </span>
                                    <div>
                                      <span className="text-gray-400">
                                        ({item.platform})
                                      </span>
                                      <span className="ml-1 text-green-400">
                                        ${item.price}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {transaction.items.length > 1 && (
                              <div className="text-center mt-2">
                                <button
                                  className="text-gray-400 hover:text-white transition-colors duration-300 ease-in-out text-xs font-medium"
                                  onClick={() =>
                                    handleToggleExpand(transaction.orderId)
                                  }
                                >
                                  {expandedRows[transaction.orderId]
                                    ? "- Show Less"
                                    : "+ Show More"}
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm text-center">
                        ${transaction.totalAmount}
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm text-center">
                        <span
                          className={`${transaction.status == "paid"
                              ? "bg-green-600/20 text-green-400"
                              : ""
                            } text-xs px-2 py-1 rounded font-semibold`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm text-center">
                        {transaction.duration}
                      </td>
                    </tr>
                  ))}

                  {recentTransactions.length == 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4 text-gray-400"
                      >
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </HoverCard>
        </div>
      </div>
    </div>
  );
}
