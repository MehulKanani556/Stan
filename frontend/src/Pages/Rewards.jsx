import React, { useEffect, useMemo, useState, useCallback } from 'react'
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
import { enqueueSnackbar } from 'notistack';
import {
    getAllRewards,
    getUserRewardBalance,
    redeemReward,
    getUserRedemptionHistory,
    completeTask,
    getAvailableTasks,
    getRewardsLeaderboard,
    getUserGamePlayTime,
    getAllTasks
} from '../Redux/Slice/reward.slice'
import axiosInstance from '../Utils/axiosInstance'


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
        <>
            <section className='w-full'>
                <RewardsExperience />
            </section>
        </>
    )
}

const RewardsExperience = () => {
    const dispatch = useDispatch();
    const rewards = useSelector((state) => state.reward.rewards);
    const user = useSelector((state) => state.user.currentUser);
    const userBalance = useSelector((state) => state.reward.userBalance);
    const recentTransactions = useSelector((state) => state.reward.recentTransactions) || [];
    const redemptionHistory = useSelector((state) => state.reward.redemptionHistory);
    const availableTasks = useSelector((state) => state.reward.availableTasks) || [];
    const leaderboard = useSelector((state) => state.reward.leaderboard) || [];
    const allTasksState = useSelector((state)=>state.reward.allTasks);
    const userGamePlayTime = useSelector((state)=>state.reward.userGamePlayTime);

    // console.log("Reward state:", allTasksState);

    console.log("HIHI" , userGamePlayTime);
    


    const [streakDay, setStreakDay] = useState(3);
    const [completedTasks, setCompletedTasks] = useState(new Set());
    const [completedQuests, setCompletedQuests] = useState(new Set());
    const [streakClaimedToday, setStreakClaimedToday] = useState(false);
    const [showAllTasks, setShowAllTasks] = useState(false);
    const [completedDailyTasks, setCompletedDailyTasks] = useState(new Set());
    const [claimedDailyTasks, setClaimedDailyTasks] = useState(new Set());
    const [claimedWeeklyTasks, setClaimedWeeklyTasks] = useState(new Set());
    const [loadingTaskClaim, setLoadingTaskClaim] = useState(false);
    const [referralPoints, setReferralPoints] = useState(0);
    const [referralHistory, setReferralHistory] = useState([]);
    const [isClaimingReferral, setIsClaimingReferral] = useState(false);
    const [showAll, setShowAll] = useState(false);

    // Calculate total earned from recent transactions
    const totalEarned = recentTransactions
        .filter(transaction => transaction.type === 'earn')
        .reduce((total, transaction) => total + (transaction.amount || 0), 0);

    useEffect(() => {
        const last = localStorage.getItem('rewards:lastStreakClaim');
        const today = new Date().toDateString();
        if (last === today) setStreakClaimedToday(true);
    }, []);

    // Persisted completion state
    const STORAGE_KEYS = useMemo(() => ({
        daily: 'rewards:completedDailyTasks',
        weekly: 'rewards:completedWeeklyTasks',
        earn: 'rewards:completedEarnTasks',
    }), []);


    // Fetch claimed daily and weekly tasks from backend on mount
    useEffect(() => {
        const fetchClaimed = async () => {
            setLoadingTaskClaim(true);
            try {
                const res = await axiosInstance.get('/user/task-claim');
                const daily = res.data?.result?.daily?.claimedTasks || [];
                const weekly = res.data?.result?.weekly?.claimedTasks || [];
                setClaimedDailyTasks(new Set(daily));
                setClaimedWeeklyTasks(new Set(weekly));
            } catch (e) {
                setClaimedDailyTasks(new Set());
                setClaimedWeeklyTasks(new Set());
            } finally {
                setLoadingTaskClaim(false);
            }
        };
        fetchClaimed();
    }, []);

    // Load referral data
    const loadReferralData = useCallback(async () => {
        try {
            if (!user?._id) {
                console.log('No user ID available, skipping referral data load');
                return;
            }

            console.log('Loading referral data for user:', user._id);
            console.log('User referral history:', user.referralHistory);
            console.log('User fan coin transactions:', user.fanCoinTransactions);

            // Calculate total possible referral points
            const totalReferrals = user.referralHistory ? user.referralHistory.length : 0;
            const totalPossiblePoints = totalReferrals * 50;

            // Calculate already claimed referral points
            const claimedReferralPoints = user.fanCoinTransactions
                ? user.fanCoinTransactions
                    .filter(t => t.type === 'REFERRAL')
                    .reduce((total, transaction) => total + (transaction.amount || 0), 0)
                : 0;

            // Calculate pending points
            const pendingPoints = Math.max(0, totalPossiblePoints - claimedReferralPoints);

            console.log('Referral calculation:', {
                totalReferrals,
                totalPossiblePoints,
                claimedReferralPoints,
                pendingPoints
            });

            setReferralPoints(pendingPoints);
            setReferralHistory(user.referralHistory || []);
        } catch (error) {
            console.error('Error loading referral data:', error);
        }
    }, [user]);

    // Load initial data
    useEffect(() => {
        dispatch(getAllRewards({ page: 1, limit: 20 }));
        dispatch(getUserRewardBalance());
        dispatch(getUserRedemptionHistory({ page: 1, limit: 10 }));
        dispatch(getAvailableTasks());
        dispatch(getUserGamePlayTime());
        dispatch(getAllTasks());
        dispatch(getRewardsLeaderboard({ page: 1, limit: 10 }));
    }, [dispatch]);

    // Load referral data when user data is available
    useEffect(() => {
        if (user?._id) {
            loadReferralData();
        }
    }, [loadReferralData]);

    // ---- Gameplay time helpers ----
    const playedMinutesToday = useMemo(() => {
        try {
            const entries = userGamePlayTime?.time || [];
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            return entries
                .filter(e => {
                    const d = new Date(e?.date);
                    return d >= start && d <= end;
                })
                .reduce((sum, e) => sum + (Number(e?.durationMinutes) || 0), 0);
        } catch {
            return 0;
        }
    }, [userGamePlayTime]);
    const playedMinutesThisWeek = useMemo(() => {
        try {
            const entries = userGamePlayTime?.time || [];
            const now = new Date();
            // Set to Monday as start of week
            const day = now.getDay(); // 0=Sun,1=Mon,...
            const diffToMonday = (day + 6) % 7; // days since Monday
            const start = new Date(now);
            start.setHours(0, 0, 0, 0);
            start.setDate(start.getDate() - diffToMonday);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            return entries
                .filter(e => {
                    const d = new Date(e?.date);
                    return d >= start && d <= end;
                })
                .reduce((sum, e) => sum + (Number(e?.durationMinutes) || 0), 0);
        } catch {
            return 0;
        }
    }, [userGamePlayTime]);

    // Use API tasks or fallback to default tasks
    // const baseTasks = availableTasks.length > 0 ? availableTasks.slice(0, 3).map(task => ({
    //     id: task.id || task._id,
    //     title: task.title || task.name,
    //     icon: <FaQuestionCircle className="text-purple-300" />, // Default icon
    //     points: task.points || task.reward
    // })) : [
    //     { id: 1, title: 'Take a quiz', icon: <FaQuestionCircle className="text-purple-300" />, points: 50 },
    //     { id: 2, title: 'Watch a video', icon: <MdOutlineOndemandVideo className="text-pink-300" />, points: 5 },
    //     { id: 3, title: 'Refer a friend', icon: <FaUserFriends className="text-emerald-300" />, points: 50 },
    // ];

    // const dailyTasks = [
    //     { id: 'd1', title: 'Login to the app', points: 15, progress: 1, goal: 1 },
    //     { id: 'd2', title: 'Play any game for 15 minutes', points: 15, progress: 10, goal: 15 },
    //     { id: 'd3', title: 'Daily Streak Bonus', points: 15, progress: 1, goal: 1 },
    // ];

    // const iconCycle = [
    //     <FaQuestionCircle className="text-purple-300" />,
    //     <MdOutlineOndemandVideo className="text-pink-300" />,
    //     <FaUserFriends className="text-emerald-300" />,
    // ];

    // const moreTasks = Array.from({ length: 13 }).map((_, i) => ({
    //     id: 100 + i,
    //     title: `Bonus task #${i + 1}`,
    //     icon: iconCycle[i % iconCycle.length],
    //     points: [25, 40, 75, 100, 120][i % 5]
    // }));

    // const allTasks = [...baseTasks];
    // const tasksToShow = showAllTasks ? allTasks : baseTasks;

    // const weeklyQuests = [
    //     { id: 'q1', title: 'Play any game for 60 minutes', progress: 10, goal: 60, reward: 50 },
    //     { id: 'q2', title: 'Complete 3 daily tasks for 5 days', progress: 2, goal: 5, reward: 45 },
    //     { id: 'q3', title: 'Login 5 days this week', progress: streakDay, goal: 5, reward: 40 },
    // ];

    // Use API rewards or fallback to default rewards
    // const rewardsData = rewards.length > 0 ? rewards.map(reward => ({
    //     id: reward._id,
    //     title: reward.title,
    //     img: reward.image || yoyoLogo,
    //     price: reward.price,
    //     status: reward.isRedeemed ? 'redeemed' : (userBalance >= reward.price ? 'unlocked' : 'locked')
    // })) : [
    //     { id: 1, title: 'tbh welcome pack', img: yoyoLogo, price: 500, status: 'redeemed' },
    //     { id: 2, title: 'Amazon.com $5 gift card', img: amazonImg, price: 1500, status: 'unlocked' },
    //     { id: 3, title: 'Sticker pack', img: stickerImg, price: 1500, status: 'locked' },
    //     { id: 4, title: 'Disposable camera', img: cameraImg, price: 3500, status: 'locked' },
    //     { id: 5, title: 'Gaming poster', img: posterImg, price: 800, status: 'locked' },
    //     { id: 6, title: 'Mystery loot', img: mysteryImg, price: 1200, status: 'locked' },
    // ];

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

    const addHistory = (type, amount, label) => {
        // History is now managed by Redux state
        // This function is kept for compatibility but data comes from recentTransactions
    };

    const earnPoints = (amount, label) => {
        // Points are now managed by Redux state
        // This function is kept for compatibility but balance comes from userBalance
    };

    const tryRedeem = (item) => {
        if (item.status !== 'unlocked') return;
        if (userBalance < item.price) return;
        if (!window.confirm(`Redeem ${item.title} for ${item.price} points?`)) return;
        dispatch(redeemReward(item._id));
    };

    const claimStreak = () => {
        const today = new Date().toDateString();
        if (streakClaimedToday) return;
        const reward = 20;
        earnPoints(reward, 'Daily Streak');
        setStreakDay(d => Math.min(d + 1, 7));
        setStreakClaimedToday(true);
        localStorage.setItem('rewards:lastStreakClaim', today);
    };

    const completeDailyTask = async (task) => {
        const isPlayTimeTask = /play any game for/i.test(task?.title || '');
        const goal = Number(task?.limit || task?.goal || 0);
        const progress = isPlayTimeTask ? playedMinutesToday : Number(task?.progress || 0);
        const key = task?._id || task?.id;
        if (!key) return;
        if (claimedDailyTasks.has(key)) return;
        if (!(progress >= goal && goal > 0)) return;
        setLoadingTaskClaim(true);
        try {
            await axiosInstance.post('/user/task-claim', { taskId: key, type: 'daily' });
            setClaimedDailyTasks(prev => new Set(prev).add(key));
            // dispatch(completeTask({ taskId: key, points: task?.reward, title: task?.title }));
            enqueueSnackbar('Task claimed!', { variant: 'success' });
        } catch (e) {
            enqueueSnackbar('Failed to claim task', { variant: 'error' });
        } finally {
            setLoadingTaskClaim(false);
        }
    };

    const completeWeeklyTask = async (task) => {
        const isPlayTimeTask = /play any game for/i.test(task?.title || '');
        const goal = Number(task?.limit || task?.goal || 0);
        const progress = isPlayTimeTask ? playedMinutesThisWeek : Number(task?.progress || 0);
        const key = task?._id || task?.id;
        if (!key) return;
        if (claimedWeeklyTasks.has(key)) return;
        if (!(progress >= goal && goal > 0)) return;
        setLoadingTaskClaim(true);
        try {
            await axiosInstance.post('/user/task-claim', { taskId: key, type: 'weekly' });
            setClaimedWeeklyTasks(prev => new Set(prev).add(key));
            // dispatch(completeTask({ taskId: key, points: task?.reward, title: task?.title }));
            enqueueSnackbar('Weekly quest claimed!', { variant: 'success' });
        } catch (e) {
            enqueueSnackbar('Failed to claim weekly quest', { variant: 'error' });
        } finally {
            setLoadingTaskClaim(false);
        }
    };

    const claimMilestone = (mid) => {
        setMilestones(prev => prev.map(m => {
            if (m.id === mid && !m.claimed && totalEarned >= m.target) {
                earnPoints(m.bonus, `${m.title} Milestone`);
                return { ...m, claimed: true };
            }
            return m;
        }));
    };

    const handleTaskComplete = (task) => {        
        if (completedTasks.has(task.id)) return;
        dispatch(completeTask({ taskId: task._id, points: task.reward, title: task.title }));
        setCompletedTasks(prev => new Set(prev).add(task.id));
    };

    const completeQuest = (q) => {
        const isPlayTimeTask = /play any game for/i.test(q?.title || '');
        const goal = Number(q?.limit || q?.goal || 0);
        const progress = isPlayTimeTask ? playedMinutesThisWeek : Number(q?.progress || 0);
        const key = q?._id || q?.id;
        if (!key) return;
        if (completedQuests.has(key)) return;
        if (!(progress >= goal && goal > 0)) return; // require goal met
        dispatch(completeTask({ taskId: key, points: q?.reward, title: q?.title }));
        setCompletedQuests(prev => {
            const next = new Set(prev);
            next.add(key);
            try { localStorage.setItem(STORAGE_KEYS.weekly, JSON.stringify(Array.from(next))); } catch {}
            return next;
        });
    };

    const userId = useMemo(() => {
        try { return localStorage.getItem('userId') || '' } catch { return '' }
    }, []);
    // console.log("user", user);
    const referralLink = useMemo(() => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        return `${origin}/register?ref=${user?.referralCode}`;
    }, [userId]);

    const handleCopyReferral = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            enqueueSnackbar('Referral link copied!', { variant: 'success' });
        } catch (e) {
            console.warn('Clipboard copy failed, showing prompt fallback');
            window.prompt('Copy your referral link:', referralLink);
        }
    };
    


    // Handle claiming referral points
    const handleClaimReferralPoints = async () => {
        console.log('Claim referral points clicked. Current referral points:', referralPoints);
        console.log('Is claiming referral:', isClaimingReferral);
        
        if (referralPoints === 0 || isClaimingReferral) {
            console.log('Cannot claim: referralPoints =', referralPoints, 'isClaimingReferral =', isClaimingReferral);
            return;
        }

        setIsClaimingReferral(true);
        try {
            console.log('Calling backend API to claim referral bonus...');
            // Call the backend API to claim referral bonus
            const response = await axiosInstance.post('/fan-coins/referral-bonus');

            console.log('Backend response:', response.data);

            if (response.data.success) {
                console.log('Successfully claimed referral points:', response.data.result?.bonusCoins);
                // Update local state
                setReferralPoints(0);
                // Refresh user balance and referral data
                dispatch(getUserRewardBalance());
                loadReferralData();
                alert(`Successfully claimed ${response.data.result?.bonusCoins || 0} referral points!`);
            } else {
                console.log('Backend returned error:', response.data.message);
                alert(response.data.message || 'Failed to claim referral points');
            }
        } catch (error) {
            console.error('Error claiming referral points:', error);
            alert(error.response?.data?.message || 'Failed to claim referral points. Please try again.');
        } finally {
            setIsClaimingReferral(false);
        }
    };

    useEffect(() => {
        // Get today's date as a string (e.g., '2025-09-17')
        const today = new Date().toISOString().slice(0, 10);

        // Get saved data from localStorage
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.daily) || '{}');
        if (saved.date !== today) {
            // If date is not today, reset completed tasks
            setCompletedDailyTasks(new Set());
            localStorage.setItem(STORAGE_KEYS.daily, JSON.stringify({ date: today, tasks: [] }));
        } else {
            // If date matches, load completed tasks
            setCompletedDailyTasks(new Set(saved.tasks || []));
        }
    }, [STORAGE_KEYS]);

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
                            <div className='glass-card rounded-2xl p-3 sm:p-4 min-w-[11 0px] sm:min-w-[140px] text-center w-full sm:w-auto'>
                                <p className='text-white/70 text-xs'>Current Balance</p>
                                <div className='text-purple-300 font-extrabold text-xl sm:text-2xl md:text-3xl mt-1 flex items-center justify-center gap-2'><FaGem /> {userBalance.toFixed(2)}</div>
                            </div>
                            <div className='glass-card rounded-2xl p-3 sm:p-4 min-w-[11 0px] sm:min-w-[140px] text-center w-full sm:w-auto'>
                                <p className='text-white/70 text-xs'>Total Earned</p>
                                <div className='text-purple-300 font-extrabold text-xl sm:text-2xl md:text-3xl mt-1'>{totalEarned.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top grid */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-10 md:items-stretch'>
                    {/* My Points */}
                    <div className='glass-card rounded-2xl p-4 sm:p-6 md:p-7 reward-glow h-fit md:col-span-1'>
                        <h3 className='text-white font-semibold text-base md:text-lg mb-4 sm:mb-5'>My Points</h3>
                        <div className='bg-[#171423] rounded-xl p-4 sm:p-6 md:p-7 flex flex-col items-center justify-center border border-white/10'>
                            <FaGem className='text-purple-300 text-3xl sm:text-4xl md:text-5xl mb-3' />
                            <div className='text-purple-300 font-extrabold text-3xl sm:text-4xl md:text-5xl'>{userBalance.toFixed(2)}</div>
                            <p className='text-white/80 text-sm md:text-base mt-1'>Your Balance</p>
                            <p className='text-white/50 text-xs md:text-sm text-center mt-3'>Earn points, unlock rewards, and flex your status.</p>
                            <p className='text-white/40 text-xs md:text-sm mt-2'>Total earned: {totalEarned.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Earn more points */}
                    <div className='glass-card rounded-2xl p-4 sm:p-6 md:p-7 md:col-span-1 reward-glow'>
                        <div className='flex items-center justify-between mb-4 sm:mb-5'>
                            <h3 className='text-white font-semibold text-base md:text-lg'>Earn more points</h3>
                            <span className='text-white/50 text-xs'>Daily refresh</span>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            {(showAll
                              ? allTasksState?.earntask
                              : allTasksState?.earntask?.slice(0, 2)
                            )?.map((task) => {
                              const done = completedTasks.has(task._id);
                              return (
                                <div
                                  key={task._id}
                                  className="flex items-center justify-between bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10"
                                >
                                  <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-black/40 flex items-center justify-center">
                                      {task?.icon}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-white font-medium text-sm sm:text-base truncate">
                                        {task?.title}
                                      </p>
                                      <div className="flex items-center gap-2 text-purple-300 text-xs sm:text-sm">
                                        <FaGem /> <span>{task?.reward}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleTaskComplete(task)}
                                    disabled={done}
                                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap ${
                                      done
                                        ? "btn-soft cursor-not-allowed opacity-60"
                                        : "btn-primary"
                                    }`}
                                  >
                                    {done ? "Completed" : "Earn"}
                                  </button>
                                </div>
                              );
                            })}
                          
                            {allTasksState?.earntask?.length > 2 && (
                              <button
                                onClick={() => setShowAll((v) => !v)}
                                className="w-full px-4 py-2 rounded-xl text-sm font-semibold btn-soft"
                              >
                                {showAll
                                  ? "Show less"
                                  : `View ${allTasksState?.earntask?.length - 2} More`}
                              </button>
                            )}
                       </div>

                    </div>
                </div>

                {/* Refer a friend */}
                <div className='mt-6 sm:mt-10 grid grid-cols-1'>
                    <div className='glass-card rounded-2xl p-4 sm:p-6 reward-glow'>
                        <div className='flex items-center justify-between mb-3'>
                            <h3 className='text-white font-semibold text-base md:text-lg flex items-center gap-2'><FaUserFriends className='text-emerald-300' /> Invite friends, earn coins</h3>
                            <span className='text-white/60 text-xs'>+50 on signup</span>
                        </div>
                        <p className='text-white/70 text-sm mb-3'>Share your link. When a friend registers, you earn referral coins.</p>
                        <div className='flex flex-col sm:flex-row gap-2'>
                            <input readOnly value={referralLink} className='flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm' />
                            <button onClick={handleCopyReferral} className='btn-primary px-4 py-2 rounded-lg text-sm font-semibold'>Copy link</button>
                        </div>

                        <div className='flex items-center justify-between mb-3'>
                            <h3 className='text-white font-semibold text-base md:text-lg flex items-center gap-2'><FaTrophy className='text-yellow-300' /> Referral Points</h3>
                            <span className='text-white/60 text-xs'>Claim your rewards</span>
                        </div>
                        <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                            <div className='flex items-center justify-between mb-3'>
                                <div>
                                    <p className='text-white font-medium text-sm'>Pending Referral Points</p>
                                    <p className='text-white/70 text-xs'>Earned from successful referrals</p>
                                </div>
                                <div className='text-right'>
                                    <div className='text-yellow-300 font-extrabold text-2xl flex items-center gap-2'>
                                        <FaGem /> {referralPoints}
                                    </div>
                                    <p className='text-white/60 text-xs'>Points available</p>
                                </div>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='text-white/70 text-sm'>
                                    {referralHistory.length} successful referral{referralHistory.length !== 1 ? 's' : ''}
                                    {referralPoints > 0 && (
                                        <span className='block text-yellow-300 text-xs mt-1'>
                                            {referralPoints} points ready to claim
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={handleClaimReferralPoints}
                                    disabled={referralPoints === 0 || isClaimingReferral}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${referralPoints === 0 || isClaimingReferral
                                        ? 'btn-soft cursor-not-allowed opacity-60'
                                        : 'btn-primary'
                                        }`}
                                >
                                    {isClaimingReferral ? 'Claiming...' : referralPoints === 0 ? 'All Claimed' : 'Claim Points'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Daily streak + Weekly quests */}
                <div className='mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8'>
                    <div className='glass-card rounded-2xl p-4 sm:p-6 reward-glow'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-white font-semibold text-base md:text-lg flex items-center gap-2'><FaCalendarDay className='text-purple-300' /> Daily Tasks</h3>
                            <span className='text-white/70 text-xs'>Day {streakDay}/7</span>
                        </div>
                        <div className='space-y-3'>
                            {allTasksState?.dailytask?.map(task => {
                                const isPlayTimeTask = /play any game for/i.test(task?.title || '');
                                const goal = Number(task?.limit || task?.goal || 0);
                                const progress = isPlayTimeTask ? playedMinutesToday : Number(task?.progress || 0);
                                const progressPct = goal > 0 ? Math.min(100, (progress / goal) * 100) : 0;
                                const claimed = claimedDailyTasks.has(task?._id || task?.id);
                                const canComplete = progress >= goal && !claimed;
                                return (
                                    <div key={task._id} className='bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10'>
                                        <div className='flex items-center justify-between mb-2'>
                                            <p className='text-white font-medium text-xs sm:text-sm'>{task?.title}</p>
                                            <div className='flex items-center gap-1 text-purple-300 text-xs sm:text-sm'>
                                                <FaGem /> {task?.reward}
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-between mb-2'>
                                            {isPlayTimeTask && (
                                                <span className='text-white/60 text-xs'>{progress}/{goal} min</span>
                                            )}
                                            {!isPlayTimeTask && goal > 0 && (
                                                <span className='text-white/60 text-xs'>{progress}/{goal}</span>
                                            )}
                                            <span className='text-white/50 text-xs'>{Math.round(progressPct)}%</span>
                                        </div>
                                        <div className='w-full bg-white/10 rounded-full h-2 overflow-hidden mb-3'>
                                            <div className='h-2 bg-gradient-to-r from-[#b191ff] to-[#621df2]' style={{ width: `${progressPct}%` }}></div>
                                        </div>
                                        <button
                                            onClick={() => completeDailyTask(task)}
                                            disabled={!canComplete || loadingTaskClaim}
                                            className={`w-full py-2 rounded-lg text-xs sm:text-sm font-semibold ${claimed ? 'btn-soft cursor-not-allowed opacity-60' : canComplete ? 'btn-primary' : 'btn-soft cursor-not-allowed opacity-60'}`}
                                        >
                                            {claimed ? 'Claimed' : canComplete ? (loadingTaskClaim ? 'Claiming...' : 'Claim') : 'In Progress'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className='glass-card rounded-2xl p-4 sm:p-6 lg:col-span-2 reward-glow'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-white font-semibold text-base md:text-lg flex items-center gap-2'><FaRegClock className='text-pink-300' /> Weekly Quests</h3>
                            <span className='text-white/50 text-xs'>Resets Monday</span>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4'>
                            {allTasksState?.weeklytask?.map(q => {
                                const isPlayTimeTask = /play any game for/i.test(q?.title || '');
                                const goal = Number(q?.limit || q?.goal || 0);
                                const progress = isPlayTimeTask ? playedMinutesThisWeek : Number(q?.progress || 0);
                                const progressPct = goal > 0 ? Math.min(100, (progress / goal) * 100) : 0;
                                const claimed = claimedWeeklyTasks.has(q?._id || q?.id);
                                const canComplete = progress >= goal && !claimed;
                                return (
                                    <div key={q._id || q.id} className='bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10'>
                                        <p className='text-white font-medium text-sm sm:text-base'>{q.title}</p>
                                        <div className='flex items-center justify-between mt-2'>
                                            {isPlayTimeTask && (
                                                <span className='text-white/60 text-xs'>{progress}/{goal} min</span>
                                            )}
                                            {!isPlayTimeTask && goal > 0 && (
                                                <span className='text-white/60 text-xs'>{progress}/{goal}</span>
                                            )}
                                            <div className='flex items-center gap-1 text-purple-300 text-xs sm:text-sm'><FaGem /> {q.reward}</div>
                                        </div>
                                        <div className='mt-3 w-full bg-white/10 rounded-full h-2 overflow-hidden'>
                                            <div className='h-2 bg-gradient-to-r from-[#b191ff] to-[#621df2]' style={{ width: `${progressPct}%` }}></div>
                                        </div>
                                        <button onClick={() => completeWeeklyTask(q)} disabled={!canComplete || loadingTaskClaim} className={`mt-3 sm:mt-4 w-full py-2 rounded-lg text-xs sm:text-sm font-semibold ${claimed ? 'btn-soft cursor-not-allowed opacity-60' : canComplete ? 'btn-primary' : 'btn-soft cursor-not-allowed opacity-60'}`}>
                                            {claimed ? 'Claimed' : canComplete ? (loadingTaskClaim ? 'Claiming...' : 'Claim Reward') : 'In Progress'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Redeem */}
                <div className='mt-8 sm:mt-12'>
                    <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-white font-semibold text-base md:text-lg'>Redeem</h3>
                        <span className='text-white/50 text-xs'>Choose your loot</span>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
                        {allTasksState?.milestone?.map(item => (
                            <div key={item?._id} className='glass-card rounded-2xl p-3 sm:p-4 md:p-5 reward-glow'>
                                <div className='bg-white/10 h-28 sm:h-32 md:h-40 rounded-xl mb-3 sm:mb-4 flex items-center justify-center relative overflow-hidden'>
                                    {item.status === 'locked' && (
                                        <div className='absolute top-2 sm:top-3 left-2 sm:left-3 text-[10px] sm:text-xs bg-black/60 text-white px-2 py-1 rounded-md z-10 flex items-center gap-1'>
                                            <FaLock className='text-white/80' /> Locked
                                        </div>
                                    )}
                                    {item.status !== 'locked' && (
                                        <div className='absolute top-2 sm:top-3 left-2 sm:left-3 text-[10px] sm:text-xs bg-black/60 text-white px-2 py-1 rounded-md z-10'>
                                            Unlocked
                                        </div>
                                    )}
                                    {item.status === 'redeemed' && (
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
                                        <progress value={Math.min(userBalance, item.price)} max={item.price} className='redeem-progress'></progress>
                                    </div>
                                    <button
                                        onClick={() => tryRedeem(item)}
                                        disabled={item.status !== 'unlocked' || userBalance < item.price}
                                        className={`mt-3 sm:mt-4 w-full py-2 rounded-xl text-xs sm:text-sm font-semibold ${item.status === 'redeemed' ? 'btn-soft cursor-not-allowed opacity-60' : (item.status === 'unlocked' && userBalance >= item.price) ? 'btn-primary' : 'btn-soft cursor-not-allowed opacity-60'}`}
                                    >
                                        {item.status === 'redeemed' ? 'Redeemed' : 'Redeem'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

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

                {/* Milestones & Badges */}
                <div className='mt-8 sm:mt-12'>
                    <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-white font-semibold text-base md:text-lg flex items-center gap-2'><FaMedal className='text-purple-300' /> Milestones & Badges</h3>
                        <span className='text-white/50 text-xs'>Lifetime progress</span>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
                        {milestones.map(m => {
                            const pct = Math.min(100, (totalEarned / m.target) * 100);
                            const canClaim = !m.claimed && totalEarned >= m.target;
                            return (
                                <div key={m.id} className='glass-card rounded-2xl p-4 sm:p-5 reward-glow'>
                                    <div className='flex items-center gap-2 sm:gap-3 mb-2'>
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${canClaim ? 'bg-purple-300 text-white' : m.claimed ? 'bg-emerald-400 text-black' : 'bg-white/10 text-white'}`}>
                                            <FaStar className='text-xs sm:text-sm' />
                                        </div>
                                        <div className='min-w-0 flex-1'>
                                            <p className='text-white font-semibold text-sm sm:text-base'>{m.title}</p>
                                            <span className='text-white/60 text-xs'>Target: {m.target}</span>
                                        </div>
                                    </div>
                                    <div className='w-full bg-white/10 rounded-full h-2 overflow-hidden'>
                                        <div className='h-2 bg-gradient-to-r from-[#b191ff] to-[#621df2]' style={{ width: `${pct}%` }}></div>
                                    </div>
                                    <div className='flex items-center justify-between mt-2 sm:mt-3'>
                                        <span className='text-white/70 text-xs'>Bonus</span>
                                        <div className='flex items-center gap-1 text-purple-300 text-xs sm:text-sm'><FaGem /> {m.bonus}</div>
                                    </div>
                                    <button
                                        onClick={() => claimMilestone(m.id)}
                                        disabled={!canClaim}
                                        className={`mt-3 sm:mt-4 w-full py-2 rounded-xl text-xs sm:text-sm font-semibold ${canClaim ? 'btn-primary' : 'btn-soft cursor-not-allowed opacity-60'}`}
                                    >
                                        {m.claimed ? 'Claimed' : canClaim ? 'Claim Bonus' : 'In Progress'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <p className='text-white/60 text-xs mt-3'>Total Earned so far: {totalEarned}</p>
                </div>
            </div>
        </section>
    )
}


