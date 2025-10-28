import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaGem, FaPlay, FaUserFriends, FaQuestionCircle, FaLock, FaCheckCircle, FaTrophy, FaCalendarDay, FaRegClock, FaMedal, FaStar } from "react-icons/fa";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { SiScratch } from "react-icons/si";
import RewardsSkeleton from '../lazyLoader/RewardsSkeleton';
import amazonImg from '../images/Amazon.png'
import yoyoLogo from '../images/YOYO-LOGO.svg'
import stickerImg from '../images/gens-logo1.png'
import cameraImg from '../images/stan-user.png'
import posterImg from '../images/game5.jpg'
import mysteryImg from '../images/shadow.jpg'
import gold from '../images/gold.png'
import silver from '../images/silver.png'
import bronze from '../images/bronze.png'
import redeem1 from '../images/redeem.jpg'
import redeem2 from '../images/redeem2.jpg'
import star from '../images/star11.png'

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
    getAllTasks,
    getThresholdClaims,
    claimThresholdTier,
    getTaskClaim,
    claimCompleteTask,
    referralBonus,
    createScratchCard,
    getScratchCard
} from '../Redux/Slice/reward.slice'
import { getuserLogging } from '../Redux/Slice/user.slice';
import ScratchGame from './ScratchGame';
import { useNavigate } from 'react-router-dom'
import { decryptData } from '../Utils/encryption'

import { allorders } from '../Redux/Slice/Payment.slice';

const Trophy = [gold, silver, bronze];
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
    const navigate = useNavigate();
    const rewards = useSelector((state) => state.reward.rewards);
    const user = useSelector((state) => state.user.currentUser);
    const userBalance = useSelector((state) => state.reward.userBalance);
    const thresholdClaims = useSelector((state) => state.reward.thresholdClaims);
    const isClaimingThreshold = useSelector((state) => state.reward.loading.redeem);
    const recentTransactions = useSelector((state) => state.reward.recentTransactions) || [];
    const redemptionHistory = useSelector((state) => state.reward.redemptionHistory);
    const availableTasks = useSelector((state) => state.reward.availableTasks) || [];
    const leaderboard = useSelector((state) => state.reward.leaderboard) || [];
    const allTasksState = useSelector((state) => state.reward.allTasks);
    const scratchLoading = useSelector((state) => state.reward.loading.scratchCard);

    console.log(allTasksState, "allTasksStateeeeee");

    const userGamePlayTime = useSelector((state) => state.reward.userGamePlayTime);
    const userLogging = useSelector((state) => state.user.userLogging)

    // console.log('userLogging', userLogging)
    // console.log("Reward state:", allTasksState);

    // console.log("HIHI", userGamePlayTime);

    useEffect(() => {
        dispatch(getuserLogging())
    }, [])

    const [streakDay, setStreakDay] = useState(3);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [completedQuests, setCompletedQuests] = useState(new Set());
    const [streakClaimedToday, setStreakClaimedToday] = useState(false);
    const [showAllTasks, setShowAllTasks] = useState(false);
    const [completedDailyTasks, setCompletedDailyTasks] = useState(new Set());
    const [claimedDailyTasks, setClaimedDailyTasks] = useState(new Set());
    const [claimedWeeklyTasks, setClaimedWeeklyTasks] = useState(new Set());
    const [claimedMilestoneTasks, setClaimedMilestoneTasks] = useState(new Set());
    const [loadingTaskClaim, setLoadingTaskClaim] = useState(false);
    const [referralPoints, setReferralPoints] = useState(0);
    const [referralHistory, setReferralHistory] = useState([]);
    const [isClaimingReferral, setIsClaimingReferral] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [scratchPercentage, setScratchPercentage] = useState(0);
    const [currentPrize, setCurrentPrize] = useState("");
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const [claimingTier, setClaimingTier] = useState(null);
    const [scratchingTier, setScratchingTier] = useState(null);
    // Add state for task claim data
    const [taskClaimData, setTaskClaimData] = useState({
        daily: [],
        weekly: [],
        milestone: [],
        taskCompletion: { completedDays: [], isWeeklyTaskEligible: false }
    });
    const { orders, loading: ordersLoading } = useSelector((state) => state.payment);
    const anyPurchase = orders?.find((order) => order?.status === 'paid');
    useEffect(() => {
        dispatch(allorders());
    }, []);
    // Calculate total earned from recent transactions
    const totalEarned = recentTransactions
        .filter(transaction => (transaction.type || '').toUpperCase() === 'EARN')
        .reduce((total, transaction) => total + (transaction.amount || 0), 0);

    // Calculate earn balance (sum of all EARN transactions)
    console.log('recentTransactions', recentTransactions)
    const earnBalance = recentTransactions
        .filter(transaction => (transaction.type || '').toUpperCase() === 'EARN')
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

    function getISOWeek(date) {
        const tmp = new Date(date.valueOf());
        const dayNum = (date.getDay() + 6) % 7;
        tmp.setDate(tmp.getDate() - dayNum + 3);
        const firstThursday = tmp.valueOf();
        tmp.setMonth(0, 1);
        if (tmp.getDay() !== 4) {
            tmp.setMonth(0, 1 + ((4 - tmp.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - tmp) / 604800000);
    }
    // Fetch claimed daily, weekly, and milestone tasks from backend on mount
    const taskClaim = useSelector((state => state.reward.taskClaim)) || null;
    useEffect(() => {
        dispatch(getTaskClaim());
    }, [])
    useEffect(() => {
        const fetchClaimed = async () => {
            console.log('taskClaim', taskClaim)
            setLoadingTaskClaim(true);
            try {
                const today = new Date().toISOString().split('T')[0];
                // Set the entire task claim data
                setTaskClaimData({
                    daily: taskClaim?.claim?.daily || [],
                    weekly: taskClaim?.claim?.weekly || [],
                    milestone: taskClaim?.claim?.milestone || { claimedTasks: [] },
                    taskCompletion: taskClaim?.taskCompletion || { completedDays: [], isWeeklyTaskEligible: false }
                });
                setCompletedTasks(taskClaim?.claim.earn || [])
                // Maintain backward compatibility with existing state
                const todayDaily = taskClaim?.claim?.daily?.find(d => {
                    // Clean the date string (remove any whitespace/newlines) and compare
                    const cleanDate = d.date?.trim();
                    return cleanDate === today;
                });


                // Weekly claimed (this week only)
                const now = new Date();
                const year = now.getFullYear();
                const week = getISOWeek(now);
                const weekStr = `${year}-W${String(week).padStart(2, '0')}`;

                const currentWeek = taskClaim?.claim?.weekly?.find(w => w.week === weekStr);
                const weeklyTasksThisWeek = currentWeek?.claimedTasks || [];

                const dailyTasksToday = todayDaily?.claimedTasks || [];
                const daily = taskClaim?.claim?.daily?.flatMap(d => d.claimedTasks || []);
                const weekly = taskClaim?.claimedTasks || [];
                const milestone = taskClaim?.claim?.milestone?.claimedTasks || [];

                // console.log("dailyTasksToday", weeklyTasksThisWeek,dailyTasksToday);

                console.log('weeklyTasksThisWeek', weeklyTasksThisWeek);

                setClaimedDailyTasks(new Set(dailyTasksToday));
                setClaimedWeeklyTasks(new Set(weeklyTasksThisWeek));
                setClaimedMilestoneTasks(new Set(milestone));
            } catch (e) {
                // Reset to default state if fetch fails
                setTaskClaimData({
                    daily: [],
                    weekly: [],
                    milestone: [],
                    taskCompletion: { completedDays: [], isWeeklyTaskEligible: false }
                });
                setClaimedDailyTasks(new Set());
                setClaimedWeeklyTasks(new Set());
                setClaimedMilestoneTasks(new Set());
            } finally {
                setLoadingTaskClaim(false);
            }
        };
        fetchClaimed();
    }, [taskClaim]);

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
        dispatch(getThresholdClaims());
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


    // Use API leaderboard only (no static fallback)
    const leaderboardData = (Array.isArray(leaderboard) && leaderboard.length > 0)
        ? leaderboard.map((user, idx) => ({
            key: user._id || user.id || user.rank || idx,
            name: user.username || user.name,
            points: typeof user.points === 'number' ? user.points : (user.balance || 0),
            rank: user.rank || (idx + 1)
        }))
        : [];

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

    const tryRedeem = async (item) => {
        if (item.status !== 'unlocked') return;
        if (userBalance < item.price) return;
        if (!window.confirm(`Redeem ${item.title} for ${item.price} points?`)) return;
        try {
            await dispatch(redeemReward(item._id)).unwrap();
            // Refresh balance, history, and rewards list to reflect latest state
            dispatch(getUserRewardBalance());
            dispatch(getUserRedemptionHistory({ page: 1, limit: 10 }));
            dispatch(getAllRewards({ page: 1, limit: 20 }));
        } catch (_) {
            // errors are handled via snackbar in the thunk
        }
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
        const isLoggingTask = /Login to the app/i.test(task?.title || '')
        const isStreakTask = /Daily Streak Bonus/i.test(task?.title || '')
        let goal = 0;
        let progress = 0;
        if (isPlayTimeTask) {
            goal = Number(task?.limit || task?.goal || 0);
            progress = isPlayTimeTask ? playedMinutesToday : Number(task?.progress || 0);
        }
        if (isLoggingTask) {
            const today = new Date();
            goal = Number(task?.limit || task?.goal || 0);
            progress = isSameDay(new Date(userLogging?.lastLoggingDate), today) ? 1 : 0;
        }
        if (isStreakTask) {
            goal = Number(task?.limit || task?.goal || 0)
            progress = 1;
        }
        // const goal = Number(task?.limit || task?.goal || 0);
        // const progress = isPlayTimeTask ? playedMinutesToday : Number(task?.progress || 0);
        const key = task?._id || task?.id;

        // Check if task is already claimed for today
        const today = new Date().toISOString().split('T')[0];
        const dailyClaimData = taskClaimData?.daily?.find(d => d.date === today);
        const isTaskClaimedToday = dailyClaimData?.claimedTasks?.includes(key);

        if (!key) return;
        if (isTaskClaimedToday) return;
        if (!(progress >= goal && goal > 0)) return;

        setLoadingTaskClaim(true);
        try {
            const response = await dispatch(claimCompleteTask({ taskId: key, type: 'daily', rewards: task?.reward }))
            // Update local state to reflect the new claim
            if (response.payload.success) {
                setTaskClaimData(prevData => {
                    const hasToday = (prevData.daily || []).some(d => d.date === today);

                    const updatedDaily = hasToday
                        ? prevData.daily.map(d =>
                            d.date === today
                                ? { ...d, claimedTasks: [...(d.claimedTasks || []), key] }
                                : d
                        )
                        : [
                            ...(prevData.daily || []),
                            { date: today, claimedTasks: [key] } // ✅ create new entry if today not found
                        ];

                    return {
                        ...prevData,
                        daily: updatedDaily
                    };
                });
                enqueueSnackbar('Task claimed!', { variant: 'success' });
            }
        } catch (e) {
            enqueueSnackbar('Failed to claim task', { variant: 'error' });
        } finally {
            setLoadingTaskClaim(false);
            dispatch(getUserRewardBalance());

        }
    };

    const completeWeeklyTask = async (task) => {
        const isPlayTimeTask = /play any game for/i.test(task?.title || '');
        const isLoggingTask = /Login 4 days this week/i.test(task?.title || '')
        const is3DayTask = /Complete 3 daily tasks/i.test(task?.title || '')
        const goal = Number(task?.limit || task?.goal || 0);
        const progress = isPlayTimeTask ? playedMinutesThisWeek :
            isLoggingTask ? (userLogging?.weeklyLogging || 0) :
                is3DayTask ? (taskClaimData?.taskCompletion?.completedDays?.filter(
                    day => day.taskCount >= 3
                ).length || 0) :
                    Number(task?.progress || 0);
        const key = task?._id || task?.id;

        // Get current week in YYYY-Www format
        const currentWeek = getCurrentWeek();

        // Check if task is already claimed for this week
        const currentWeekData = taskClaimData?.weekly?.find(w => w.week === currentWeek);
        const isTaskClaimedThisWeek = currentWeekData?.claimedTasks?.includes(key);
        console.log(currentWeekData);
        if (!key) return;
        if (isTaskClaimedThisWeek) return;

        // Special handling for 3 daily tasks for 5 days task
        if (is3DayTask) {
            // Check if user is eligible for the weekly task
            if (!taskClaimData?.taskCompletion?.isWeeklyTaskEligible) {
                enqueueSnackbar('Not eligible for this task yet', { variant: 'warning' });
                return;
            }
        }
        // General task completion check
        if (!(progress >= goal && goal > 0)) return;

        setLoadingTaskClaim(true);
        try {
            const response = await dispatch(claimCompleteTask({ taskId: key, type: 'weekly', rewards: task?.reward }))
            if (response.payload.success) {
                console.log('daily task response', response.payload.success);
                setTaskClaimData(prevData => {
                    const existingWeekIndex = prevData.weekly.findIndex(w => w.week === currentWeek);

                    let updatedWeekly;

                    if (existingWeekIndex !== -1) {
                        // Update existing week
                        updatedWeekly = prevData.weekly.map((w, i) =>
                            i === existingWeekIndex
                                ? { ...w, claimedTasks: [...(w.claimedTasks || []), key] }
                                : w
                        );
                    } else {
                        // Add new week
                        updatedWeekly = [
                            ...prevData.weekly,
                            { week: currentWeek, claimedTasks: [key] }
                        ];
                    }

                    console.log('updatedWeekly', updatedWeekly);

                    return {
                        ...prevData,
                        weekly: updatedWeekly
                    };
                });
                enqueueSnackbar('Weekly quest claimed!', { variant: 'success' });
            }

        } catch (e) {
            enqueueSnackbar('Failed to claim weekly quest', { variant: 'error' });
        } finally {
            setLoadingTaskClaim(false);
            dispatch(getUserRewardBalance());

        }
    };
    const claimMilestone = async (milestone) => {
        // Check if milestone task is already claimed
        const isTaskClaimedMilestone = taskClaimData?.milestone?.claimedTasks?.includes(milestone?._id || milestone?.id);

        if (isTaskClaimedMilestone) return;
        setLoadingTaskClaim(true);
        try {
            const response = await dispatch(claimCompleteTask({ taskId: milestone?._id, type: 'milestone', rewards: milestone?.reward }))
            // Update local state to reflect the new claim
            if (response.payload.success) {

                setTaskClaimData(prevData => {
                    const updatedMilestone = [
                        ...(prevData.milestone || []),
                        {
                            claimedTasks: [...(prevData.milestone?.claimedTasks || []), milestone?._id]
                        }
                    ];

                    return {
                        ...prevData,
                        milestone: updatedMilestone
                    };
                });
                enqueueSnackbar('Milestone claimed!', { variant: 'success' });
            }
        } catch (e) {
            enqueueSnackbar('Failed to claim milestone', { variant: 'error' });
        } finally {
            setLoadingTaskClaim(false);
            dispatch(getUserRewardBalance());
        }
    };

    // Utility function to get current week in YYYY-Www format
    const getCurrentWeek = () => {
        const currentDate = new Date();
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(((currentDate - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
        return `${currentDate.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
    };

    const handleTaskComplete = async (task) => {
        if (completedTasks?.includes(task.id)) return;
        setLoadingTaskClaim(true);
        try {
            if (task?.title === 'Take a quiz') {
                if (!hasPlayedQuiz) {
                    navigate('/quizRewards');
                    return;
                }
                const score = Number(quizScore || 0);
                if (!score) {
                    enqueueSnackbar('Finish the quiz to get a score to claim.', { variant: 'warning' });
                    return;
                }
                await dispatch(completeTask({ taskId: task._id, taskType: 'quiz', points: score, title: task.title, completed: true })).unwrap();
                try { localStorage.removeItem('quiz:lastScore'); } catch { }
            }
            else if (task?.title === 'Buy a game') {
                if (anyPurchase) {
                    await dispatch(completeTask({ taskId: task._id, taskType: 'buy', points: task.reward, title: task.title, completed: true })).unwrap();
                }
                else {
                    navigate('/store')
                    return;
                }
            }
            else {
                await dispatch(completeTask({ taskId: task._id, points: task.reward, title: task.title })).unwrap();
            }
            setCompletedTasks(prev => prev.includes(task._id) ? prev : [...prev, task._id]);
            // Refresh balance and recent transactions so Total Earned updates immediately
            dispatch(getUserRewardBalance());
        } catch (e) {
            enqueueSnackbar(e?.message || 'Failed to claim points', { variant: 'error' });
        } finally {
            setLoadingTaskClaim(false);
        }
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
            try { localStorage.setItem(STORAGE_KEYS.weekly, JSON.stringify(Array.from(next))); } catch { }
            return next;
        });
    };

    const userId = useMemo(() => {
        try { return localStorage.getItem('userId') || '' } catch { return '' }
    }, []);
    const hasPlayedQuiz = useMemo(() => {
        try { return localStorage.getItem(`quizPlayed:${userId}`) === '1' } catch { return false }
    }, [userId]);
    const quizScore = useMemo(() => {
        try {
            const score = Number(localStorage.getItem('quiz:lastScore') || 0);
            console.log('Quiz score retrieved:', score);
            return score;
        } catch {
            console.log('Error retrieving quiz score');
            return 0;
        }
    }, [hasPlayedQuiz]);
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
            const response = dispatch(referralBonus());

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


    function isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    // Helper function to check if a daily task is claimed for today
    const isDailyTaskClaimed = (taskId) => {
        const today = new Date().toISOString().split('T')[0];
        const dailyClaimData = taskClaimData?.daily?.find(d => d.date === today) || null
        console.log('dailyClaimData?.claimedTasks?.includes(String(taskId))', taskClaimData)
        return dailyClaimData?.claimedTasks?.includes(String(taskId)) || false;
    };

    // Helper function to check if a weekly task is claimed for current week

    const isWeeklyTaskClaimed = (taskId) => {
        const currentWeek = getCurrentWeek();
        console.log('taskClaimDataweekly123', taskClaimData)

        let currentWeekData = taskClaimData?.weekly?.find(w => w.week === currentWeek) || null;
        console.log('currentWeekDatacurrentWeekData', currentWeekData);
        return currentWeekData?.claimedTasks?.includes(String(taskId)) || false;
    };

    // Helper function to check if a milestone task is claimed
    const isMilestoneTaskClaimed = (taskId) => {
        let milestoneWithTask = taskClaimData?.milestone?.find(m => m.claimedTasks.includes(String(taskId)));
        return !!milestoneWithTask;
    };

    return (
        <section className='ms:pb-12 pb-6 overflow-x-hidden'>
            <div className='max-w-[95%] md:max-w-[85%] m-auto overflow-x-hidden'>
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
                    {console.log('userBalance', userBalance)}
                    {/* <div className='glass-card rounded-2xl p-4 sm:p-6 md:p-7 reward-glow h-fit md:col-span-1'>
                        <h3 className='text-white font-semibold text-base md:text-lg mb-4 sm:mb-5'>My Points</h3>
                        <div className='bg-[#171423] rounded-xl p-4 sm:p-6 md:p-7 flex flex-col items-center justify-center border border-white/10'>
                            <FaGem className='text-purple-300 text-3xl sm:text-4xl md:text-5xl mb-3' />
                            <div className='text-purple-300 font-extrabold text-3xl sm:text-4xl md:text-5xl'>{userBalance.toFixed(2)}</div>
                            <p className='text-white/80 text-sm md:text-base mt-1'>Your Balance</p>
                            <p className='text-white/50 text-xs md:text-sm text-center mt-3'>Earn points, unlock rewards, and flex your status.</p>
                            <p className='text-white/40 text-xs md:text-sm mt-2'>Total earned: {earnBalance.toFixed(2)}</p>
                            <p className='text-emerald-300 text-xs md:text-sm mt-2'>Earn Balance: {earnBalance.toFixed(2)}</p>
                        </div>
                    </div> */}

                    {/* Earn more points */}
                    <div className='glass-card rounded-2xl p-4 sm:p-6 md:p-7 md:col-span-1 reward-glow'>
                        <div className='flex items-center justify-between mb-4 sm:mb-5'>
                            <h3 className='text-white font-semibold text-base md:text-lg'>Earn more points</h3>
                            <span className='text-white/50 text-xs'>1 Time Play</span>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            {(showAll
                                ? allTasksState?.earntask
                                : allTasksState?.earntask?.slice(0, 2)
                            )?.map((task) => {
                                console.log('anyPurchase', completedTasks);
                                const done = completedTasks?.includes(task._id);

                                return (
                                    <div
                                        key={task._id}
                                        className="flex flex-wrap items-center justify-between bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 gap-4"
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-black/40 flex items-center justify-center">
                                                <img src={star} alt="star" className="w-full h-full object-cover" />
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
                                        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto'>
                                            <button
                                                onClick={async () => {
                                                    if (task?.title === 'Take a quiz') {
                                                        if (!hasPlayedQuiz) {
                                                            navigate('/quizRewards');
                                                        } else {
                                                            await handleTaskComplete(task);
                                                        }
                                                    } else {
                                                        await handleTaskComplete(task);
                                                    }
                                                }}
                                                disabled={done || loadingTaskClaim || (task?.title === 'Take a quiz' && hasPlayedQuiz && quizScore === 0)}
                                                className={`px-4 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap w-full sm:w-auto text-center ${done || loadingTaskClaim || (task?.title === 'Take a quiz' && hasPlayedQuiz && quizScore === 0)
                                                    ? 'btn-soft cursor-not-allowed opacity-60'
                                                    : 'btn-primary'
                                                    }`}
                                            >
                                                {loadingTaskClaim
                                                    ? "Claiming..."
                                                    : done
                                                        ? "All Claimed"
                                                        : task?.title === 'Take a quiz'
                                                            ? (hasPlayedQuiz
                                                                ? (quizScore > 0 ? `Claim ${quizScore}` : 'Play Quiz')
                                                                : 'Play Quiz'
                                                            )
                                                            : task?.title === 'Watch a video'
                                                                ? 'Watch Video'
                                                                : task?.title === 'Refer a friend'
                                                                    ? 'Refer Friend'
                                                                    : task?.title === 'Login to the app'
                                                                        ? 'Login'
                                                                        : task?.title === 'Play any game for 15 minutes'
                                                                            ? 'Play Game'
                                                                            : task?.title === 'Daily streak bonus'
                                                                                ? 'Daily Streak'
                                                                                : 'Claim Points'
                                                }
                                            </button>
                                        </div>
                                    </div>
                                )
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

                    {/* Refer a friend */}
                    <div className=' grid grid-cols-1'>
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
                                const isLoggingTask = /Login to the app/i.test(task?.title || '')
                                const isStreakTask = /Daily Streak Bonus/i.test(task?.title || '')
                                let goal = 0;
                                let progress = 0;
                                let progressPct = 0;
                                let claimed = false;
                                let canComplete = false;
                                if (isPlayTimeTask) {
                                    goal = Number(task?.limit || task?.goal || 0);
                                    progress = isPlayTimeTask ? playedMinutesToday : Number(task?.progress || 0);
                                    progressPct = goal > 0 ? Math.min(100, (progress / goal) * 100) : 0;
                                    claimed = claimedDailyTasks.has(task?._id || task?.id);
                                    canComplete = progress >= goal && !claimed;

                                    console.log('Play Time Task Debug:', {
                                        taskId: task?._id,
                                        goal,
                                        progress,
                                        progressPct,
                                        claimed,
                                        canComplete,
                                        isDailyTaskClaimed: isDailyTaskClaimed(task?._id),
                                        loadingTaskClaim,
                                        claimedDailyTasks
                                    });
                                }
                                if (isLoggingTask) {
                                    const today = new Date();
                                    goal = Number(task?.limit || task?.goal || 0);
                                    progress = isSameDay(new Date(userLogging?.lastLoggingDate), today) ? 1 : 0;
                                    progressPct = isSameDay(new Date(userLogging?.lastLoggingDate), today) ? 100 : 0;
                                    claimed = claimedDailyTasks.has(task?._id || task?.id);
                                    canComplete = progress === 1 && !claimed;
                                }
                                if (isStreakTask) {
                                    goal = Number(task?.limit || task?.goal || 0)
                                    progress = 1;
                                    progressPct = 100;
                                    claimed = claimedDailyTasks.has(task?._id || task?.id);
                                    canComplete = !claimed;
                                }

                                // Login to the app logic
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
                                            disabled={!canComplete || loadingTaskClaim || isDailyTaskClaimed(task?._id)}
                                            className={`w-full py-2 rounded-lg text-xs sm:text-sm font-semibold ${isDailyTaskClaimed(task?._id) ? 'btn-soft cursor-not-allowed opacity-60' : canComplete ? 'btn-primary' : 'btn-soft cursor-not-allowed opacity-60'}`}
                                        >
                                            {isDailyTaskClaimed(task?._id) ? 'Claimed' : canComplete ? (loadingTaskClaim ? 'Claiming...' : 'Claim') : 'In Progress'}
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
                                const isLoggingTask = /Login 4 days this week/i.test(q?.title || '')
                                const is3DayTask = /Complete 3 daily tasks/i.test(q?.title || '')
                                let goal = 0;
                                let progress = 0;
                                let progressPct = 0;
                                let canComplete = false;
                                let claimed = false;
                                console.log('claimedWeeklyTasks', claimedWeeklyTasks)
                                if (isPlayTimeTask) {
                                    goal = Number(q?.limit || q?.goal || 0);
                                    progress = isPlayTimeTask ? playedMinutesThisWeek : Number(q?.progress || 0);
                                    progressPct = goal > 0 ? Math.min(100, (progress / goal) * 100) : 0;
                                    claimed = claimedWeeklyTasks.has(String(q?._id || q?.id));
                                    console.log("dailyTasksTodaay", claimedWeeklyTasks, claimed, progress, goal);
                                    canComplete = progress >= goal && !claimed;
                                }
                                if (isLoggingTask) {
                                    goal = Number(q?.limit || q?.goal || 0);
                                    progress = userLogging?.weeklyLogging ? Number(userLogging?.weeklyLogging || 0) : 0;
                                    progressPct = goal > 0 ? Math.min(100, (progress / goal) * 100) : 0;
                                    claimed = claimedWeeklyTasks.has(String(q?._id || q?.id));
                                    canComplete = progress >= goal && !claimed;
                                    console.log('progerss', claimed)
                                }
                                if (is3DayTask) {
                                    // Logic for tracking 3 daily tasks for 5 days
                                    goal = Number(q?.limit || q?.goal || 5);
                                    progress = taskClaimData?.taskCompletion?.completedDays?.filter(
                                        day => day.taskCount >= 3
                                    ).length || 0;
                                    progressPct = goal > 0 ? Math.min(100, (progress / goal) * 100) : 0;
                                    claimed = claimedWeeklyTasks.has(String(q?._id || q?.id));
                                    // Ensure the claim button shows when 5 days with 3+ tasks are completed
                                    canComplete = progress >= goal && !claimed &&
                                        taskClaimData?.taskCompletion?.isWeeklyTaskEligible;
                                }

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
                                        <button
                                            onClick={() => completeWeeklyTask(q)}
                                            disabled={!canComplete || loadingTaskClaim || isWeeklyTaskClaimed(q?._id)}
                                            className={`mt-3 sm:mt-4 w-full py-2 rounded-lg text-xs sm:text-sm font-semibold ${isWeeklyTaskClaimed(q?._id) ? 'btn-soft cursor-not-allowed opacity-60' : canComplete ? 'btn-primary' : 'btn-soft cursor-not-allowed opacity-60'}`}
                                        >
                                            {isWeeklyTaskClaimed(q?._id) ? 'Claimed' : canComplete ? (loadingTaskClaim ? 'Claiming...' : 'Claim Reward') : 'In Progress'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Redeem */}
                <div className="mt-6 sm:mt-8 lg:mt-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
                        <h3 className="text-white font-semibold text-base sm:text-lg md:text-xl">Redeem</h3>
                        <span className="text-white/50 text-xs sm:text-sm">Choose your loot</span>
                    </div>

                    {/* Responsive Rewards Grid */}
                    <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 reward-glow">
                        {/* Mobile: Horizontal Scroll */}
                        <div className="block sm:hidden">
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                                {[
                                    {
                                        tier: 100,
                                        label: '+5 Fan',
                                        type: 'fan',
                                        key: 'm100',
                                        image: redeem1,
                                        description: 'Boost your fan points instantly.',
                                    },
                                    {
                                        tier: 200,
                                        label: '+10 Fan',
                                        type: 'fan',
                                        key: 'm200',
                                        image: redeem1,
                                        description: 'Double the rewards for active fans.',
                                    },
                                    {
                                        tier: 500,
                                        label: '+25 Fan',
                                        type: 'fan',
                                        key: 'm500',
                                        image: redeem1,
                                        description: 'Big reward boost for loyal fans.',
                                    },
                                    {
                                        tier: 1000,
                                        label: '1 Scratch Card',
                                        type: 'scratch',
                                        key: 's1000',
                                        image: redeem2,
                                        description: 'Try your luck! 🎉 Winning chance: 5%',
                                    },
                                    {
                                        tier: 2000,
                                        label: '1 Scratch Card',
                                        type: 'scratch',
                                        key: 's2000',
                                        image: redeem2,
                                        description: 'Premium scratch card 💎 Winning chance: 15%',
                                    },
                                ].map((reward, index) => {
                                    const claimed = reward.type === 'fan' ? !!thresholdClaims?.[reward.key] : false;
                                    const canClaim =
                                        reward.type === 'fan'
                                            ? !claimed && userBalance >= reward.tier
                                            : userBalance >= reward.tier;

                                    const isThisButtonLoading =
                                        reward.type === 'fan'
                                            ? isClaimingThreshold && claimingTier === reward.tier
                                            : scratchLoading && scratchingTier === reward.tier;

                                    const isDisabled =
                                        reward.type === 'fan'
                                            ? claimed || userBalance < reward.tier || isThisButtonLoading
                                            : userBalance < reward.tier || isThisButtonLoading;

                                    return (
                                        <div
                                            key={index}
                                            className="flex-shrink-0 w-32 bg-white/5 border border-white/10 rounded-lg p-3 text-center hover:bg-white/10 transition"
                                        >
                                            <img
                                                src={reward.image}
                                                alt={`Reward ${reward.tier}`}
                                                className="w-full h-20 object-cover mx-auto mb-2 rounded"
                                            />
                                            <p className="text-white/70 text-[10px]">Spend {reward.tier}</p>
                                            <p className="text-emerald-300 font-medium text-xs">{reward.label}</p>
                                            <p className="text-white/50 text-[9px] mt-1 leading-tight">
                                                {reward.description}
                                            </p>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        if (isDisabled) return;

                                                        if (reward.type === 'fan') {
                                                            setClaimingTier(reward.tier);
                                                            await dispatch(claimThresholdTier(reward.tier)).unwrap();
                                                            dispatch(getUserRewardBalance());
                                                            dispatch(getThresholdClaims());
                                                        } else {
                                                            setScratchingTier(reward.tier);
                                                            await dispatch(createScratchCard({ amount: reward.tier })).unwrap();
                                                            dispatch(getScratchCard());
                                                            dispatch(getUserRewardBalance());
                                                            enqueueSnackbar('Scratch card purchased!', { variant: 'success' });
                                                        }
                                                    } catch (e) {
                                                        enqueueSnackbar(e?.message || 'Failed to claim reward', {
                                                            variant: 'error',
                                                        });
                                                    } finally {
                                                        if (reward.type === 'fan') {
                                                            setClaimingTier(null);
                                                        } else {
                                                            setScratchingTier(null);
                                                        }
                                                    }
                                                }}
                                                disabled={isDisabled}
                                                className={`mt-2 w-full py-1 rounded text-[10px] font-semibold transition ${reward.type === 'fan'
                                                    ? claimed
                                                        ? 'btn-soft cursor-not-allowed opacity-60'
                                                        : canClaim && !isThisButtonLoading
                                                            ? 'btn-primary'
                                                            : 'btn-soft cursor-not-allowed opacity-60'
                                                    : userBalance < reward.tier || isThisButtonLoading
                                                        ? 'btn-soft cursor-not-allowed opacity-60'
                                                        : 'btn-primary'
                                                    }`}
                                            >
                                                {reward.type === 'fan'
                                                    ? claimed
                                                        ? 'Claimed'
                                                        : isThisButtonLoading
                                                            ? 'Claiming...'
                                                            : 'Claim'
                                                    : isThisButtonLoading
                                                        ? 'Processing...'
                                                        : 'Purchase'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tablet and Desktop: Grid Layout */}
                        <div className="hidden sm:block">
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
                                {[
                                    {
                                        tier: 100,
                                        label: '+5 Fan',
                                        type: 'fan',
                                        key: 'm100',
                                        image: redeem1,
                                        description: 'Boost your fan points instantly.',
                                    },
                                    {
                                        tier: 200,
                                        label: '+10 Fan',
                                        type: 'fan',
                                        key: 'm200',
                                        image: redeem1,
                                        description: 'Double the rewards for active fans.',
                                    },
                                    {
                                        tier: 500,
                                        label: '+25 Fan',
                                        type: 'fan',
                                        key: 'm500',
                                        image: redeem1,
                                        description: 'Big reward boost for loyal fans.',
                                    },
                                    {
                                        tier: 1000,
                                        label: '1 Scratch Card',
                                        type: 'scratch',
                                        key: 's1000',
                                        image: redeem2,
                                        description: 'Try your luck! 🎉 Winning chance: 5%',
                                    },
                                    {
                                        tier: 2000,
                                        label: '1 Scratch Card',
                                        type: 'scratch',
                                        key: 's2000',
                                        image: redeem2,
                                        description: 'Premium scratch card 💎 Winning chance: 15%',
                                    },
                                ].map((reward, index) => {
                                    const claimed = reward.type === 'fan' ? !!thresholdClaims?.[reward.key] : false;
                                    const canClaim =
                                        reward.type === 'fan'
                                            ? !claimed && userBalance >= reward.tier
                                            : userBalance >= reward.tier;

                                    const isThisButtonLoading =
                                        reward.type === 'fan'
                                            ? isClaimingThreshold && claimingTier === reward.tier
                                            : scratchLoading && scratchingTier === reward.tier;

                                    const isDisabled =
                                        reward.type === 'fan'
                                            ? claimed || userBalance < reward.tier || isThisButtonLoading
                                            : userBalance < reward.tier || isThisButtonLoading;

                                    return (
                                        <div
                                            key={index}
                                            className="bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 text-center hover:bg-white/10 transition"
                                        >
                                            <img
                                                src={reward.image}
                                                alt={`Reward ${reward.tier}`}
                                                className="w-full h-24 sm:h-28 md:h-32 object-cover mx-auto mb-3 rounded"
                                            />
                                            <p className="text-white/70 text-xs">Spend {reward.tier}</p>
                                            <p className="text-emerald-300 font-medium text-sm">{reward.label}</p>
                                            <p className="text-white/50 text-[11px] mt-1 leading-snug">
                                                {reward.description}
                                            </p>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        if (isDisabled) return;

                                                        if (reward.type === 'fan') {
                                                            setClaimingTier(reward.tier);
                                                            await dispatch(claimThresholdTier(reward.tier)).unwrap();
                                                            dispatch(getUserRewardBalance());
                                                            dispatch(getThresholdClaims());
                                                        } else {
                                                            setScratchingTier(reward.tier);
                                                            await dispatch(createScratchCard({ amount: reward.tier })).unwrap();
                                                            dispatch(getScratchCard());
                                                            dispatch(getUserRewardBalance());
                                                            enqueueSnackbar('Scratch card purchased!', { variant: 'success' });
                                                        }
                                                    } catch (e) {
                                                        enqueueSnackbar(e?.message || 'Failed to claim reward', {
                                                            variant: 'error',
                                                        });
                                                    } finally {
                                                        if (reward.type === 'fan') {
                                                            setClaimingTier(null);
                                                        } else {
                                                            setScratchingTier(null);
                                                        }
                                                    }
                                                }}
                                                disabled={isDisabled}
                                                className={`mt-3 w-full py-1.5 rounded-md text-xs sm:text-sm font-semibold transition ${reward.type === 'fan'
                                                    ? claimed
                                                        ? 'btn-soft cursor-not-allowed opacity-60'
                                                        : canClaim && !isThisButtonLoading
                                                            ? 'btn-primary'
                                                            : 'btn-soft cursor-not-allowed opacity-60'
                                                    : userBalance < reward.tier || isThisButtonLoading
                                                        ? 'btn-soft cursor-not-allowed opacity-60'
                                                        : 'btn-primary'
                                                    }`}
                                            >
                                                {reward.type === 'fan'
                                                    ? claimed
                                                        ? 'Claimed'
                                                        : isThisButtonLoading
                                                            ? 'Claiming...'
                                                            : 'Claim'
                                                    : isThisButtonLoading
                                                        ? 'Processing...'
                                                        : 'Purchase'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
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
                                <div
                                    key={u.key || u.id || idx}
                                    className='bg-white/5 rounded-xl p-3 sm:p-4 border flex items-center justify-between'
                                    style={{
                                        borderColor:
                                            idx === 0
                                                ? '#FFD700'
                                                : idx === 1
                                                    ? '#C0C0C0'
                                                    : idx === 2
                                                        ? '#CD7F32'
                                                        : 'rgba(255,255,255,0.06)',
                                        borderWidth: '1px',
                                        borderStyle: 'solid'
                                    }}
                                >
                                    <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
                                        {Trophy[idx] ? (
                                            <img className='w-8 h-8 sm:w-9 sm:h-9 ' src={Trophy[idx]}></img>
                                        ) : (
                                            <div className='shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ring-2 ring-white/20 bg-purple-600 text-white'>
                                                {idx + 1}
                                            </div>
                                        )}
                                        <div className='min-w-0 flex-1'>
                                            <p className='text-white font-medium text-sm sm:text-base truncate'>{decryptData(u.name)}</p>
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
                        <div className='space-y-2 sm:space-y-3 max-h-40 sm:max-h-72 overflow-auto pr-1'>
                            {recentTransactions.length === 0 && <p className='text-white/60 text-sm'>No activity yet. Start earning points!</p>}
                            {recentTransactions.map(it => (
                                <div key={it.id} className='flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-2 sm:p-3'>
                                    <div className='min-w-0 flex-1'>
                                        <p className='text-white text-xs sm:text-sm truncate'>{it.description}</p>
                                        <span className='text-white/50 text-xs'>{it.claimedAt}</span>
                                    </div>
                                    <div className={`${it.type === 'EARN' ? 'text-emerald-300' : 'text-rose-300'} font-semibold text-xs sm:text-sm`}>{it.type === 'EARN' ? '+' : '-'}{it.amount.toFixed(2)}</div>
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
                    {console.log("allTasksState.milestone", allTasksState)}
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 gap-4 sm:gap-6'>
                        {(allTasksState?.milestone || []).map(m => {
                            const pct = Math.min(100, (totalEarned / m.target) * 100);
                            const claimed = claimedMilestoneTasks.has(m._id || m.id);
                            const canClaim = !claimed && totalEarned >= m.target;

                            return (
                                <div key={m._id} className='glass-card rounded-2xl p-4 sm:p-5 reward-glow'>
                                    <div className='flex items-center gap-2 sm:gap-3 mb-2'>
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${canClaim ? 'bg-purple-300 text-white' : claimed ? 'bg-emerald-400 text-black' : 'bg-white/10 text-white'}`}>
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
                                        <div className='flex items-center gap-1 text-purple-300 text-xs sm:text-sm'><FaGem /> {m.reward}</div>
                                    </div>
                                    <button
                                        onClick={() => claimMilestone(m)}
                                        disabled={!canClaim || loadingTaskClaim || isMilestoneTaskClaimed(m._id)}
                                        className={`mt-3 sm:mt-4 w-full py-2 rounded-xl text-xs sm:text-sm font-semibold ${isMilestoneTaskClaimed(m._id) ? 'btn-soft cursor-not-allowed opacity-60' : canClaim ? 'btn-primary' : 'btn-soft cursor-not-allowed opacity-60'}`}
                                    >
                                        {isMilestoneTaskClaimed(m._id) ? 'Claimed' : canClaim ? (loadingTaskClaim ? 'Claiming...' : 'Claim Bonus') : 'In Progress'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <p className='text-white/60 text-xs mt-3'>Total Earned so far: {totalEarned}</p>
                </div>

                {/* ***** Scratch Card ***** */}
                <ScratchGame />
            </div>
        </section>
    )
}



