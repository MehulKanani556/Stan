import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaGem, FaPlay, FaUserFriends, FaQuestionCircle, FaLock, FaCheckCircle, FaTrophy, FaCalendarDay, FaRegClock, FaMedal, FaStar } from "react-icons/fa";
import { MdOutlineOndemandVideo } from "react-icons/md";
import RewardsSkeleton from '../lazyLoader/RewardsSkeleton';
import amazonImg from '../images/Amazon.png'
import yoyoLogo from '../images/YOYO-LOGO.svg'
import stickerImg from '../images/gens-logo1.png'
import cameraImg from '../images/stan-user.jpg'
import posterImg from '../images/game5.jpg'
import mysteryImg from '../images/shadow.jpg'
import {
    getAllRewards,
    getUserRewardBalance,
    redeemReward,
    getUserRedemptionHistory,
    completeTask,
    getAvailableTasks,
    getRewardsLeaderboard
} from '../Redux/Slice/reward.slice'

const gamerTheme = `
  .page-bg {
    background: radial-gradient(1200px 600px at 10% -10%, rgba(98,29,242,0.25), transparent 60%),
                radial-gradient(900px 500px at 100% 10%, rgba(177,145,255,0.18), transparent 60%),
                linear-gradient(180deg, #0c0b11 0%, #0f0d19 100%);
    min-height: 100vh;
  }
  .hero-border {
    border-image: linear-gradient(90deg, rgba(177,145,255,0.6), rgba(98,29,242,0.6)) 1;
  }
  .reward-glow {
    box-shadow: 0 0 24px rgba(177,145,255,0.18), inset 0 0 12px rgba(177,145,255,0.08);
  }
  .glass-card {
    background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08);
    transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  }
  .glass-card:hover { transform: translateY(-2px); border-color: rgba(177,145,255,0.35); box-shadow: 0 12px 40px rgba(98,29,242,0.18); }
  .btn-primary { background: linear-gradient(90deg, #621df2 0%, #b191ff 100%); color: #fff; }
  .btn-primary:hover { filter: brightness(1.05); }
  .btn-soft { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.85); border: 1px solid rgba(255,255,255,0.12); }
  .btn-soft:hover { background: rgba(255,255,255,0.12); }
  .chip { background: linear-gradient(90deg, rgba(177,145,255,0.12), rgba(98,29,242,0.12)); border: 1px solid rgba(177,145,255,0.35); }
  .redeem-progress::-webkit-progress-bar { background: rgba(255,255,255,0.08); border-radius: 9999px; }
  .redeem-progress::-webkit-progress-value { background: linear-gradient(90deg, #b191ff, #621df2); border-radius: 9999px; }
  .redeem-progress { width: 100%; height: 8px; border-radius: 9999px; overflow: hidden; }
`;

// Custom hook for localStorage management
const useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};

// Custom hook for rewards state management
const useRewardsState = () => {
    const [balance, setBalance] = useLocalStorage('rewards:balance', 600);
    const [history, setHistory] = useLocalStorage('rewards:history', []);
    const [streakDay, setStreakDay] = useLocalStorage('rewards:streakDay', 3);
    const [totalEarned, setTotalEarned] = useLocalStorage('rewards:totalEarned', 0);
    const [completedTasks, setCompletedTasks] = useLocalStorage('rewards:completedTasks', []);
    const [completedQuests, setCompletedQuests] = useLocalStorage('rewards:completedQuests', []);
    const [completedDailyTasks, setCompletedDailyTasks] = useLocalStorage('rewards:completedDailyTasks', []);
    const [rewards, setRewards] = useLocalStorage('rewards:rewards', [
        { id: 1, title: 'tbh welcome pack', img: yoyoLogo, price: 500, status: 'unlocked' },
        { id: 2, title: 'Amazon.com $5 gift card', img: amazonImg, price: 1500, status: 'unlocked' },
        { id: 3, title: 'Sticker pack', img: stickerImg, price: 1500, status: 'locked' },
        { id: 4, title: 'Disposable camera', img: cameraImg, price: 3500, status: 'locked' },
        { id: 5, title: 'Gaming poster', img: posterImg, price: 800, status: 'locked' },
        { id: 6, title: 'Mystery loot', img: mysteryImg, price: 1200, status: 'locked' },
    ]);
    const [milestones, setMilestones] = useLocalStorage('rewards:milestones', [
        { id: 'm1', title: 'Bronze Hunter', target: 500, bonus: 40, claimed: false },
        { id: 'm2', title: 'Silver Slayer', target: 1500, bonus: 100, claimed: false },
        { id: 'm3', title: 'Gold Champion', target: 3000, bonus: 220, claimed: false },
        { id: 'm4', title: 'Diamond Legend', target: 6000, bonus: 500, claimed: false },
    ]);

    const [streakClaimedToday, setStreakClaimedToday] = useState(() => {
        const last = localStorage.getItem('rewards:lastStreakClaim');
        const today = new Date().toDateString();
        return last === today;
    });

    return {
        balance, setBalance,
        history, setHistory,
        streakDay, setStreakDay,
        totalEarned, setTotalEarned,
        completedTasks, setCompletedTasks,
        completedQuests, setCompletedQuests,
        completedDailyTasks, setCompletedDailyTasks,
        rewards, setRewards,
        milestones, setMilestones,
        streakClaimedToday, setStreakClaimedToday
    };
};

// Constants for better maintainability
const TASK_TYPES = {
    BASE: 'base',
    DAILY: 'daily',
    WEEKLY: 'weekly'
};

const REWARD_STATUS = {
    LOCKED: 'locked',
    UNLOCKED: 'unlocked',
    REDEEMED: 'redeemed'
};

// Data configuration
const TASKS_CONFIG = {
    base: [
        { id: 1, title: 'Take a quiz', icon: <FaQuestionCircle className="text-purple-300" />, points: 50 },
        { id: 2, title: 'Watch a video', icon: <MdOutlineOndemandVideo className="text-pink-300" />, points: 5 },
        { id: 3, title: 'Refer a friend', icon: <FaUserFriends className="text-emerald-300" />, points: 50 },
    ],
    daily: [
        { id: 'd1', title: 'Login to the app', points: 15, progress: 1, goal: 1 },
        { id: 'd2', title: 'Play any game for 15 minutes', points: 15, progress: 10, goal: 15 },
        { id: 'd3', title: 'Daily Streak Bonus', points: 15, progress: 1, goal: 1 },
    ],
    weekly: [
        { id: 'q1', title: 'Play any game for 60 minutes', progress: 10, goal: 60, reward: 50 },
        { id: 'q2', title: 'Complete 3 daily tasks for 5 days', progress: 2, goal: 5, reward: 45 },
        { id: 'q3', title: 'Login 5 days this week', progress: 3, goal: 5, reward: 40 },
    ]
};

const LEADERBOARD_DATA = [
    { id: 'u1', name: 'ShadowFox', points: 4820 },
    { id: 'u2', name: 'NovaBlade', points: 4330 },
    { id: 'u3', name: 'PixelMage', points: 4105 },
    { id: 'u4', name: 'RiftRunner', points: 3970 },
];

// Reusable UI Components
const StatCard = ({ title, value, icon, className = "" }) => (
    <div className={`glass-card rounded-2xl p-3 sm:p-4 min-w-[110px] sm:min-w-[140px] text-center w-full sm:w-auto ${className}`}>
        <p className='text-white/70 text-xs'>{title}</p>
        <div className='text-purple-300 font-extrabold text-xl sm:text-2xl md:text-3xl mt-1 flex items-center justify-center gap-2'>
            {icon} {value}
        </div>
    </div>
);

const SectionHeader = ({ title, subtitle, icon, className = "" }) => (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
        <h3 className='text-white font-semibold text-base md:text-lg flex items-center gap-2'>
            {icon} {title}
        </h3>
        {subtitle && <span className='text-white/50 text-xs'>{subtitle}</span>}
    </div>
);

const ProgressBar = ({ progress, goal, className = "" }) => {
    const progressPct = Math.min(100, (progress / goal) * 100);
    return (
        <div className={`w-full bg-white/10 rounded-full h-2 overflow-hidden ${className}`}>
            <div className='h-2 bg-gradient-to-r from-[#b191ff] to-[#621df2]' style={{ width: `${progressPct}%` }}></div>
        </div>
    );
};

const PointsDisplay = ({ points, className = "" }) => (
    <div className={`flex items-center gap-1 text-purple-300 text-xs sm:text-sm ${className}`}>
        <FaGem /> <span className='font-semibold'>{points}</span>
    </div>
);

const ActionButton = ({ 
    onClick, 
    disabled, 
    children, 
    variant = 'primary', 
    size = 'md',
    className = "" 
}) => {
    const baseClasses = "font-semibold rounded-lg transition-all duration-200";
    const sizeClasses = {
        sm: "px-3 py-2 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };
    const variantClasses = {
        primary: "btn-primary",
        soft: "btn-soft",
        disabled: "btn-soft cursor-not-allowed opacity-60"
    };
    
    const buttonClass = `${baseClasses} ${sizeClasses[size]} ${
        disabled ? variantClasses.disabled : variantClasses[variant]
    } ${className}`;

    return (
        <button onClick={onClick} disabled={disabled} className={buttonClass}>
            {children}
        </button>
    );
};

// Task Components
const TaskCard = ({ task, onComplete, completed, className = "" }) => (
    <div className={`flex items-center justify-between bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 ${className}`}>
        <div className='flex items-center gap-3 sm:gap-4'>
            <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-black/40 flex items-center justify-center'>
                {task.icon}
            </div>
            <div className='min-w-0 flex-1'>
                <p className='text-white font-medium text-sm sm:text-base truncate'>{task.title}</p>
                <PointsDisplay points={task.points} />
            </div>
        </div>
        <ActionButton
            onClick={() => onComplete(task)}
            disabled={completed}
            variant={completed ? 'disabled' : 'primary'}
            size="sm"
        >
            {completed ? 'Completed' : 'Earn'}
        </ActionButton>
    </div>
);

const DailyTaskCard = ({ task, onComplete, completedDailyTasks, className = "" }) => {
    const progressPct = Math.min(100, (task.progress / task.goal) * 100);
    const canComplete = task.progress >= task.goal && !completedDailyTasks.has(task.id);
    const done = completedDailyTasks.has(task.id);
    
    return (
        <div className={`bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 ${className}`}>
            <div className='flex items-center justify-between mb-2'>
                <p className='text-white font-medium text-xs sm:text-sm'>{task.title}</p>
                <PointsDisplay points={task.points} />
            </div>
            <div className='flex items-center justify-between mb-2'>
                <span className='text-white/60 text-xs'>{task.progress}/{task.goal}</span>
                <span className='text-white/50 text-xs'>{Math.round(progressPct)}%</span>
            </div>
            <ProgressBar progress={task.progress} goal={task.goal} className="mb-3" />
            <ActionButton
                onClick={() => onComplete(task)}
                disabled={!canComplete}
                variant={done ? 'disabled' : canComplete ? 'primary' : 'disabled'}
                size="sm"
                className="w-full"
            >
                {done ? 'Completed' : canComplete ? 'Claim' : 'In Progress'}
            </ActionButton>
        </div>
    );
};

const QuestCard = ({ quest, onComplete, completedQuests, className = "" }) => {
    const progressPct = Math.min(100, (quest.progress / quest.goal) * 100);
    const canComplete = quest.progress >= quest.goal && !completedQuests.has(quest.id);
    const done = completedQuests.has(quest.id);
    
    return (
        <div className={`bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 ${className}`}>
            <p className='text-white font-medium text-sm sm:text-base'>{quest.title}</p>
            <div className='flex items-center justify-between mt-2'>
                <span className='text-white/60 text-xs'>{quest.progress}/{quest.goal}</span>
                <PointsDisplay points={quest.reward} />
            </div>
            <ProgressBar progress={quest.progress} goal={quest.goal} className="mt-3" />
            <ActionButton
                onClick={() => onComplete(quest)}
                disabled={!canComplete}
                variant={done ? 'disabled' : canComplete ? 'soft' : 'disabled'}
                size="sm"
                className="mt-3 sm:mt-4 w-full"
            >
                {done ? 'Completed' : canComplete ? 'Claim Reward' : 'In Progress'}
            </ActionButton>
        </div>
    );
};

const RewardCard = ({ item, balance, onRedeem, className = "" }) => (
    <div className={`glass-card rounded-2xl p-3 sm:p-4 md:p-5 reward-glow ${className}`}>
        <div className='bg-white/10 h-28 sm:h-32 md:h-40 rounded-xl mb-3 sm:mb-4 flex items-center justify-center relative overflow-hidden'>
            {item.status === REWARD_STATUS.LOCKED && (
                <div className='absolute top-2 sm:top-3 left-2 sm:left-3 text-[10px] sm:text-xs bg-black/60 text-white px-2 py-1 rounded-md z-10 flex items-center gap-1'>
                    <FaLock className='text-white/80' /> Locked
                </div>
            )}
            {item.status !== REWARD_STATUS.LOCKED && (
                <div className='absolute top-2 sm:top-3 left-2 sm:left-3 text-[10px] sm:text-xs bg-black/60 text-white px-2 py-1 rounded-md z-10'>
                    Unlocked
                </div>
            )}
            {item.status === REWARD_STATUS.REDEEMED && (
                <div className='absolute top-2 sm:top-3 right-2 sm:right-3 text-[10px] sm:text-xs bg-emerald-600/80 text-white px-2 py-1 rounded-md flex items-center gap-1 z-10'>
                    <FaCheckCircle /> Redeemed
                </div>
            )}
            {item.img ? (
                <img src={item.img} alt={item.title} className='absolute inset-0 w-full h-full object-cover opacity-70' />
            ) : (
                <FaPlay className='text-white/30 text-2xl sm:text-3xl' />
            )}
        </div>
        <div>
            <p className='text-white text-sm sm:text-base font-medium line-clamp-2 break-words'>{item.title}</p>
            <div className='mt-2 sm:mt-3 flex items-center gap-2 text-purple-300'>
                <FaGem />
                <span className='font-semibold text-sm sm:text-base'>{item.price}</span>
            </div>
            <div className='mt-2 sm:mt-3'>
                <progress value={Math.min(balance, item.price)} max={item.price} className='redeem-progress'></progress>
            </div>
            <ActionButton
                onClick={() => onRedeem(item)}
                disabled={item.status !== REWARD_STATUS.UNLOCKED || balance < item.price}
                variant={item.status === REWARD_STATUS.REDEEMED ? 'disabled' : 
                        (item.status === REWARD_STATUS.UNLOCKED && balance >= item.price) ? 'primary' : 'disabled'}
                size="sm"
                className="mt-3 sm:mt-4 w-full"
            >
                {item.status === REWARD_STATUS.REDEEMED ? 'Redeemed' : 'Redeem'}
            </ActionButton>
        </div>
    </div>
);

const LeaderboardCard = ({ user, index, className = "" }) => (
    <div className={`bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 flex items-center justify-between ${className}`}>
        <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
            <div className='shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ring-2 ring-white/20 bg-purple-600 text-white'>
                {index + 1}
            </div>
            <div className='min-w-0 flex-1'>
                <p className='text-white font-medium text-sm sm:text-base truncate'>{user.name}</p>
                <span className='text-white/60 text-xs'>Top Player</span>
            </div>
        </div>
        <PointsDisplay points={user.points} />
    </div>
);

const MilestoneCard = ({ milestone, totalEarned, onClaim, className = "" }) => {
    const pct = Math.min(100, (totalEarned / milestone.target) * 100);
    const canClaim = !milestone.claimed && totalEarned >= milestone.target;
    
    return (
        <div className={`glass-card rounded-2xl p-4 sm:p-5 reward-glow ${className}`}>
            <div className='flex items-center gap-2 sm:gap-3 mb-2'>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                    canClaim ? 'bg-purple-300 text-white' : 
                    milestone.claimed ? 'bg-emerald-400 text-black' : 'bg-white/10 text-white'
                }`}>
                    <FaStar className='text-xs sm:text-sm' />
                </div>
                <div className='min-w-0 flex-1'>
                    <p className='text-white font-semibold text-sm sm:text-base'>{milestone.title}</p>
                    <span className='text-white/60 text-xs'>Target: {milestone.target}</span>
                </div>
            </div>
            <ProgressBar progress={totalEarned} goal={milestone.target} />
            <div className='flex items-center justify-between mt-2 sm:mt-3'>
                <span className='text-white/70 text-xs'>Bonus</span>
                <PointsDisplay points={milestone.bonus} />
            </div>
            <ActionButton
                onClick={() => onClaim(milestone.id)}
                disabled={!canClaim}
                variant={canClaim ? 'primary' : 'disabled'}
                size="sm"
                className="mt-3 sm:mt-4 w-full"
            >
                {milestone.claimed ? 'Claimed' : canClaim ? 'Claim Bonus' : 'In Progress'}
            </ActionButton>
        </div>
    );
};

const ActivityItem = ({ item, className = "" }) => (
    <div className={`flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-2 sm:p-3 ${className}`}>
        <div className='min-w-0 flex-1'>
            <p className='text-white text-xs sm:text-sm truncate'>{item.label}</p>
            <span className='text-white/50 text-xs'>{item.time}</span>
        </div>
        <div className={`${item.type === 'earn' ? 'text-emerald-300' : 'text-rose-300'} font-semibold text-xs sm:text-sm`}>
            {item.type === 'earn' ? '+' : '-'}{item.amount}
        </div>
    </div>
);

// Section Components
const HeroSection = ({ balance, totalEarned }) => (
    <div className='relative mt-6 sm:mt-10 md:mt-16 rounded-2xl sm:rounded-3xl bg-white/5 overflow-hidden'>
        <div className='absolute inset-0 opacity-40' style={{ 
            background: "radial-gradient(800px 200px at 50% -20%, rgba(177,145,255,0.35), transparent), radial-gradient(600px 200px at 100% 0%, rgba(98,29,242,0.25), transparent)" 
        }}></div>
        <div className='relative z-10 px-4 sm:px-6 md:px-10 py-8 sm:py-10 md:py-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6'>
            <div className='w-full lg:w-auto'>
                <div className='inline-flex items-center gap-2 chip text-purple-200 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full mb-3'>
                    <FaGem /> Level up your loot
                </div>
                <h1 className='text-white font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight'>Rewards Hub</h1>
                <p className='text-white/70 mt-2 md:mt-3 max-w-2xl text-sm sm:text-base'>Grind quests, stack streaks, and redeem epic goodies. All your progress and perks live here.</p>
            </div>
            <div className='flex flex-row sm:flex-row items-center gap-2 sm:gap-6 w-full lg:w-auto'>
                <StatCard title="Current Balance" value={balance} icon={<FaGem />} />
                <StatCard title="Total Earned" value={totalEarned} icon={null} />
            </div>
        </div>
    </div>
);

const PointsSection = ({ balance, totalEarned }) => (
    <div className='glass-card rounded-2xl p-4 sm:p-6 md:p-7 reward-glow h-fit md:col-span-1'>
        <h3 className='text-white font-semibold text-base md:text-lg mb-4 sm:mb-5'>My Points</h3>
        <div className='bg-[#171423] rounded-xl p-4 sm:p-6 md:p-7 flex flex-col items-center justify-center border border-white/10'>
            <FaGem className='text-purple-300 text-3xl sm:text-4xl md:text-5xl mb-3' />
            <div className='text-purple-300 font-extrabold text-3xl sm:text-4xl md:text-5xl'>{balance}</div>
            <p className='text-white/80 text-sm md:text-base mt-1'>Your Balance</p>
            <p className='text-white/50 text-xs md:text-sm text-center mt-3'>Earn points, unlock rewards, and flex your status.</p>
            <p className='text-white/40 text-xs md:text-sm mt-2'>Total earned: {totalEarned}</p>
        </div>
    </div>
);

const TasksSection = ({ tasks, onComplete, completedTasks, showAll, onToggleShowAll, totalTasks }) => (
    <div className='glass-card rounded-2xl p-4 sm:p-6 md:p-7 md:col-span-1 reward-glow'>
        <SectionHeader title="Earn more points" subtitle="Daily refresh" />
        <div className='space-y-3 sm:space-y-4'>
            {tasks.map(task => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={onComplete}
                    completed={completedTasks.has(task.id)}
                />
            ))}
            <ActionButton
                onClick={onToggleShowAll}
                variant="soft"
                size="md"
                className="w-full"
            >
                {showAll ? 'Show less' : `View ${totalTasks} More`}
            </ActionButton>
        </div>
    </div>
);

const DailyTasksSection = ({ tasks, onComplete, completedDailyTasks, streakDay }) => (
    <div className='glass-card rounded-2xl p-4 sm:p-6 reward-glow'>
        <SectionHeader 
            title="Daily Tasks" 
            subtitle={`Day ${streakDay}/7`}
            icon={<FaCalendarDay className='text-purple-300' />}
        />
        <div className='space-y-3'>
            {tasks.map(task => (
                <DailyTaskCard
                    key={task.id}
                    task={task}
                    onComplete={onComplete}
                    completedDailyTasks={completedDailyTasks}
                />
            ))}
        </div>
    </div>
);

const WeeklyQuestsSection = ({ quests, onComplete, completedQuests }) => (
    <div className='glass-card rounded-2xl p-4 sm:p-6 lg:col-span-2 reward-glow'>
        <SectionHeader 
            title="Weekly Quests" 
            subtitle="Resets Monday"
            icon={<FaRegClock className='text-pink-300' />}
        />
        <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4'>
            {quests.map(quest => (
                <QuestCard
                    key={quest.id}
                    quest={quest}
                    onComplete={onComplete}
                    completedQuests={completedQuests}
                />
            ))}
        </div>
    </div>
);

const RewardsSection = ({ rewards, balance, onRedeem }) => (
    <div className='mt-8 sm:mt-12'>
        <SectionHeader title="Redeem" subtitle="Choose your loot" />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
            {rewards.map(item => (
                <RewardCard
                    key={item.id}
                    item={item}
                    balance={balance}
                    onRedeem={onRedeem}
                />
            ))}
        </div>
    </div>
);

const LeaderboardSection = ({ leaderboard }) => (
    <div className='glass-card rounded-2xl p-4 sm:p-6 reward-glow lg:col-span-2'>
        <SectionHeader 
            title="Leaderboard" 
            subtitle="Top this week"
            icon={<FaTrophy className='text-purple-300' />}
        />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
            {leaderboard.map((user, idx) => (
                <LeaderboardCard key={user.id} user={user} index={idx} />
            ))}
        </div>
    </div>
);

const ActivitySection = ({ history }) => (
    <div className='glass-card rounded-2xl p-4 sm:p-6 reward-glow'>
        <h3 className='text-white font-semibold text-base md:text-lg mb-4'>Recent Activity</h3>
        <div className='space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-auto pr-1'>
            {history.length === 0 && <p className='text-white/60 text-sm'>No activity yet. Start earning points!</p>}
            {history.map(item => (
                <ActivityItem key={item.id} item={item} />
            ))}
        </div>
    </div>
);

const MilestonesSection = ({ milestones, totalEarned, onClaim }) => (
    <div className='mt-8 sm:mt-12'>
        <SectionHeader 
            title="Milestones & Badges" 
            subtitle="Lifetime progress"
            icon={<FaMedal className='text-purple-300' />}
        />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
            {milestones.map(milestone => (
                <MilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                    totalEarned={totalEarned}
                    onClaim={onClaim}
                />
            ))}
        </div>
        <p className='text-white/60 text-xs mt-3'>Total Earned so far: {totalEarned}</p>
    </div>
);

// Main component
export default function Rewards() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = gamerTheme;
        document.head.appendChild(style);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => {
            document.head.removeChild(style);
            clearTimeout(timer);
        };
    }, []);

    if (isLoading) {
        return <RewardsSkeleton />;
    }

    return (
        <section className='w-full'>
            <RewardsExperience />
        </section>
    )
}

const RewardsExperience = () => {
    const dispatch = useDispatch();
    const rewards = useSelector((state) => state.reward.rewards);
    const userBalance = useSelector((state) => state.reward.userBalance);
    const recentTransactions = useSelector((state) => state.reward.recentTransactions) || [];
    const redemptionHistory = useSelector((state) => state.reward.redemptionHistory);
    const availableTasks = useSelector((state) => state.reward.availableTasks) || [];
    const leaderboard = useSelector((state) => state.reward.leaderboard) || [];

    console.log("Reward state:", { recentTransactions });

    // Add missing state variables
    const [balance, setBalance] = useState(userBalance || 600);
    const [totalEarned, setTotalEarned] = useState(0);
    const [history, setHistory] = useState([]);
    const [rewardsState, setRewards] = useState(rewards || []);
    const [streakDay, setStreakDay] = useState(3);
    const [completedTasks, setCompletedTasks] = useState(new Set());
    const [completedQuests, setCompletedQuests] = useState(new Set());
    const [streakClaimedToday, setStreakClaimedToday] = useState(false);
    const [showAllTasks, setShowAllTasks] = useState(false);
    const [completedDailyTasks, setCompletedDailyTasks] = useState(new Set());

    // Calculate total earned from recent transactions
    const calculatedTotalEarned = recentTransactions
        .filter(transaction => transaction.type === 'earn')
        .reduce((total, transaction) => total + (transaction.amount || 0), 0);

    // Update balance when userBalance changes
    useEffect(() => {
        setBalance(userBalance || 600);
    }, [userBalance]);

    // Update total earned when recent transactions change
    useEffect(() => {
        setTotalEarned(calculatedTotalEarned);
    }, [calculatedTotalEarned]);

    // Update rewards when API rewards change
    useEffect(() => {
        setRewards(rewards || []);
    }, [rewards]);

    useEffect(() => {
        setRewards(prev => prev.map(r => {
            if (r.id === 1 && r.status === REWARD_STATUS.REDEEMED) {
                const wasActuallyRedeemed = Array.isArray(history) && history.some(h => h.type === 'redeem' && h.label === r.title);
                return wasActuallyRedeemed ? r : { ...r, status: REWARD_STATUS.UNLOCKED };
            }
            return r;
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Convert arrays to Sets for better performance
    const completedTasksSet = useMemo(() => new Set(completedTasks), [completedTasks]);
    const completedQuestsSet = useMemo(() => new Set(completedQuests), [completedQuests]);
    const completedDailyTasksSet = useMemo(() => new Set(completedDailyTasks), [completedDailyTasks]);
    
    // Load initial data
    useEffect(() => {
        dispatch(getAllRewards({ page: 1, limit: 20 }));
        dispatch(getUserRewardBalance());
        dispatch(getUserRedemptionHistory({ page: 1, limit: 10 }));
        dispatch(getAvailableTasks());
        dispatch(getRewardsLeaderboard({ page: 1, limit: 10 }));
    }, [dispatch]);

    // Use API tasks or fallback to default tasks
    const baseTasks = availableTasks.length > 0 ? availableTasks.slice(0, 3).map(task => ({
        id: task.id || task._id,
        title: task.title || task.name,
        icon: <FaQuestionCircle className="text-purple-300" />, // Default icon
        points: task.points || task.reward
    })) : [
        { id: 1, title: 'Take a quiz', icon: <FaQuestionCircle className="text-purple-300" />, points: 50 },
        { id: 2, title: 'Watch a video', icon: <MdOutlineOndemandVideo className="text-pink-300" />, points: 5 },
        { id: 3, title: 'Refer a friend', icon: <FaUserFriends className="text-emerald-300" />, points: 50 },
    ];

    const dailyTasks = [
        { id: 'd1', title: 'Login to the app', points: 15, progress: 1, goal: 1 },
        { id: 'd2', title: 'Play any game for 15 minutes', points: 15, progress: 10, goal: 15 },
        { id: 'd3', title: 'Daily Streak Bonus', points: 15, progress: 1, goal: 1 },
    ];

    // Generate additional tasks
    const iconCycle = [
        <FaQuestionCircle className="text-purple-300" />,
        <MdOutlineOndemandVideo className="text-pink-300" />,
        <FaUserFriends className="text-emerald-300" />,
    ];

    const moreTasks = useMemo(() => Array.from({ length: 13 }).map((_, i) => ({
        id: 100 + i,
        title: `Bonus task #${i + 1}`,
        icon: iconCycle[i % iconCycle.length],
        points: [25, 40, 75, 100, 120][i % 5]
    })), []);

    const allTasks = useMemo(() => [...TASKS_CONFIG.base, ...moreTasks], [moreTasks]);
    const tasksToShow = useMemo(() => showAllTasks ? allTasks : TASKS_CONFIG.base, [showAllTasks, allTasks]);

    // Update weekly quests with current streak
    const weeklyQuests = useMemo(() => TASKS_CONFIG.weekly.map(quest => 
        quest.id === 'q3' ? { ...quest, progress: streakDay } : quest
    ), [streakDay]);

    // Callback functions
    const addHistory = useCallback((type, amount, label) => {
        setHistory(prev => [{ 
            id: Date.now(), 
            type, 
            amount, 
            label, 
            time: new Date().toLocaleString() 
        }, ...prev].slice(0, 15));
    }, []);

    const earnPoints = useCallback((amount, label) => {
        setBalance(prev => prev + amount);
        setTotalEarned(prev => prev + amount);
        addHistory('earn', amount, label);
    }, [addHistory]);

    const tryRedeem = useCallback((item) => {
        if (item.status !== REWARD_STATUS.UNLOCKED) return;
        if (balance < item.price) return;
        if (!window.confirm(`Redeem ${item.title} for ${item.price} points?`)) return;
        
        setBalance(prev => prev - item.price);
        addHistory('redeem', item.price, item.title);
        
        setRewards(prev => prev.map(r => 
            r.id === item.id ? { ...r, status: REWARD_STATUS.REDEEMED } : r
        ));
    }, [balance, addHistory]);
    
    // Use API rewards or fallback to default rewards
    const rewardsData = rewardsState.length > 0 ? rewardsState.map(reward => ({
        id: reward._id || reward.id,
        title: reward.title,
        img: reward.image || yoyoLogo,
        price: reward.price,
        status: reward.isRedeemed ? 'redeemed' : (balance >= reward.price ? 'unlocked' : 'locked')
    })) : [
        { id: 1, title: 'tbh welcome pack', img: yoyoLogo, price: 500, status: 'redeemed' },
        { id: 2, title: 'Amazon.com $5 gift card', img: amazonImg, price: 1500, status: 'unlocked' },
        { id: 3, title: 'Sticker pack', img: stickerImg, price: 1500, status: 'locked' },
        { id: 4, title: 'Disposable camera', img: cameraImg, price: 3500, status: 'locked' },
        { id: 5, title: 'Gaming poster', img: posterImg, price: 800, status: 'locked' },
        { id: 6, title: 'Mystery loot', img: mysteryImg, price: 1200, status: 'locked' },
    ];

    // Use API leaderboard or fallback to default leaderboard
    const leaderboardData = leaderboard.length > 0 ? leaderboard.map(user => ({
        id: user._id || user.id,
        name: user.username || user.name,
        points: user.points || user.balance
    })) : [
        { id: 'u1', name: 'ShadowFox', points: 4820 },
        { id: 'u2', name: 'NovaBlade', points: 4330 },
        { id: 'u3', name: 'PixelMage', points: 4105 },
        { id: 'u4', name: 'RiftRunner', points: 3970 },
    ];

    const milestonesInit = [
        { id: 'm1', title: 'Bronze Hunter', target: 500, bonus: 40, claimed: false },
        { id: 'm2', title: 'Silver Slayer', target: 1500, bonus: 100, claimed: false },
        { id: 'm3', title: 'Gold Champion', target: 3000, bonus: 220, claimed: false },
        { id: 'm4', title: 'Diamond Legend', target: 6000, bonus: 500, claimed: false },
    ];
    const [milestones, setMilestones] = useState(milestonesInit);

    const completeDailyTask = useCallback((task) => {
        if (completedDailyTasksSet.has(task.id)) return;
        if (task.progress < task.goal) return;
        earnPoints(task.points, task.title);
        setCompletedDailyTasks(prev => [...prev, task.id]);
    }, [completedDailyTasksSet, earnPoints]);

    const claimMilestone = useCallback((mid) => {
        setMilestones(prev => prev.map(m => {
            if (m.id === mid && !m.claimed && totalEarned >= m.target) {
                earnPoints(m.bonus, `${m.title} Milestone`);
                return { ...m, claimed: true };
            }
            return m;
        }));
    }, [totalEarned, earnPoints]);

    const handleTaskComplete = (task) => {
        if (completedTasks.has(task.id)) return;
        dispatch(completeTask({ taskId: task.id, points: task.points, title: task.title }));
        setCompletedTasks(prev => new Set(prev).add(task.id));
    };

    const completeQuest = useCallback((q) => {
        if (completedQuestsSet.has(q.id)) return;
        if (q.progress < q.goal) return;
        earnPoints(q.reward, q.title);
        setCompletedQuests(prev => [...prev, q.id]);
    }, [completedQuestsSet, earnPoints]);

    // Check and unlock rewards based on total earned
    useEffect(() => {
        setRewards(prev => prev.map(reward => {
            if (reward.status === REWARD_STATUS.LOCKED && totalEarned >= reward.price) {
                return { ...reward, status: REWARD_STATUS.UNLOCKED };
            }
            return reward;
        }));
    }, [totalEarned]);

    return (
        <section className='pb-12 overflow-x-hidden'>
            <div className='max-w-[90%] md:max-w-[85%] m-auto overflow-x-hidden'>
                {/* Hero */}
                <div className='relative mt-6 sm:mt-10 md:mt-16 rounded-2xl sm:rounded-3xl bg-white/5 overflow-hidden'>
                    <div className='absolute inset-0 opacity-40' style={{ background: "radial-gradient(800px 200px at 50% -20%, rgba(177,145,255,0.35), transparent), radial-gradient(600px 200px at 100% 0%, rgba(98,29,242,0.25), transparent)" }}></div>
                    <div className='relative z-10 px-4 sm:px-6 md:px-10 py-8 sm:py-10 md:py-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6'>
                        <div className='w-full lg:w-auto'>
                            <div className='inline-flex items-center gap-2 chip text-purple-200 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full mb-3'>
                                <FaGem /> Level up your loot
                            </div>
                            <h1 className='text-white font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight'>Rewards Hub</h1>
                            <p className='text-white/70 mt-2 md:mt-3 max-w-2xl text-sm sm:text-base'>Grind quests, stack streaks, and redeem epic goodies. All your progress and perks live here.</p>
                        </div>
                        <div className='flex flex-row sm:flex-row items-center gap-2 sm:gap-6 w-full lg:w-auto'>
                            <div className='glass-card rounded-2xl p-3 sm:p-4 min-w-[110px] sm:min-w-[140px] text-center w-full sm:w-auto'>
                                <p className='text-white/70 text-xs'>Current Balance</p>
                                <div className='text-purple-300 font-extrabold text-xl sm:text-2xl md:text-3xl mt-1 flex items-center justify-center gap-2'><FaGem /> {balance}</div>
                            </div>
                            <div className='glass-card rounded-2xl p-3 sm:p-4 min-w-[110px] sm:min-w-[140px] text-center w-full sm:w-auto'>
                                <p className='text-white/70 text-xs'>Total Earned</p>
                                <div className='text-purple-300 font-extrabold text-xl sm:text-2xl md:text-3xl mt-1'>{totalEarned}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Grid - Points & Tasks */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-10 md:items-stretch'>
                    <PointsSection balance={balance} totalEarned={totalEarned} />
                    <TasksSection 
                        tasks={tasksToShow}
                        onComplete={handleTaskComplete}
                        completedTasks={completedTasksSet}
                        showAll={showAllTasks}
                        onToggleShowAll={() => setShowAllTasks(v => !v)}
                        totalTasks={allTasks.length - TASKS_CONFIG.base.length}
                    />
                    
                </div>

                {/* Daily & Weekly Tasks */}
                <div className='mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8'>
                    <DailyTasksSection 
                        tasks={TASKS_CONFIG.daily}
                        onComplete={completeDailyTask}
                        completedDailyTasks={completedDailyTasksSet}
                        streakDay={streakDay}
                    />
                    <WeeklyQuestsSection 
                        quests={weeklyQuests}
                        onComplete={completeQuest}
                        completedQuests={completedQuestsSet}
                    />
                </div>

                {/* Rewards Section */}
                <RewardsSection 
                    rewards={rewardsData}
                    balance={balance}
                    onRedeem={tryRedeem}
                />

                {/* Leaderboard & Activity */}
                <div className='mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8'>
                    <div className='glass-card rounded-2xl p-4 sm:p-6 reward-glow lg:col-span-2'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-white font-semibold text-base md:text-lg flex items-center gap-2'><FaTrophy className='text-purple-300' /> Leaderboard</h3>
                            <span className='text-white/50 text-xs'>Top this week</span>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
                            {leaderboardData.map((u, idx) => (
                                <div key={u.id} className='bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 flex items-center justify-between'>
                                    <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
                                        <div className='shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ring-2 ring-white/20 bg-purple-600 text-white'>{idx + 1}</div>
                                        <div className='min-w-0 flex-1'>
                                            <p className='text-white font-medium text-sm sm:text-base truncate'>{u.name}</p>
                                            <span className='text-white/60 text-xs'>Top Player</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-1 sm:gap-2 text-purple-300 text-xs sm:text-sm shrink-0'><FaGem /><span className='font-semibold'>{u.points}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='glass-card rounded-2xl p-4 sm:p-6 reward-glow'>
                        <h3 className='text-white font-semibold text-base md:text-lg mb-4'>Recent Activity</h3>
                        <div className='space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-auto pr-1'>
                            {recentTransactions.length === 0 && <p className='text-white/60 text-sm'>No activity yet. Start earning points!</p>}
                            {recentTransactions.map(it => (
                                <div key={it.id} className='flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-2 sm:p-3'>
                                    <div className='min-w-0 flex-1'>
                                        <p className='text-white text-xs sm:text-sm truncate'>{it.description}</p>
                                        <span className='text-white/50 text-xs'>{it.time}</span>
                                    </div>
                                    <div className={`${it.type === 'EARN' ? 'text-emerald-300' : 'text-rose-300'} font-semibold text-xs sm:text-sm`}>{it.type === 'EARN' ? '+' : '-'}{it.amount}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Milestones Section */}
                <MilestonesSection 
                    milestones={milestones}
                    totalEarned={totalEarned}
                    onClaim={claimMilestone}
                />
            </div>
        </section>
    )
}


