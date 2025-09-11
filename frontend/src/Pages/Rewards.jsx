import React, { useEffect, useState } from 'react'
import { FaGem, FaPlay, FaUserFriends, FaQuestionCircle, FaLock, FaCheckCircle, FaTrophy, FaCalendarDay, FaRegClock, FaMedal, FaStar } from "react-icons/fa";
import { MdOutlineOndemandVideo } from "react-icons/md";
import RewardsSkeleton from '../lazyLoader/RewardsSkeleton';


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
  .chip { background: linear-gradient(90deg, rgba(255,221,87,0.12), rgba(255,179,0,0.12)); border: 1px solid rgba(255,179,0,0.35); }
  .redeem-progress::-webkit-progress-bar { background: rgba(255,255,255,0.08); border-radius: 9999px; }
  .redeem-progress::-webkit-progress-value { background: linear-gradient(90deg,#ffd54a,#ffb300); border-radius: 9999px; }
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
            <section className='w-full page-bg'>
                <RewardsExperience />
            </section>
        </>
    )
}

const RewardsExperience = () => {
    const [balance, setBalance] = useState(600);
    const [history, setHistory] = useState([]);
    const [streakDay, setStreakDay] = useState(3);
    const [totalEarned, setTotalEarned] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(new Set());
    const [completedQuests, setCompletedQuests] = useState(new Set());
    const [streakClaimedToday, setStreakClaimedToday] = useState(false);
    const [showAllTasks, setShowAllTasks] = useState(false);

    useEffect(() => {
        const last = localStorage.getItem('rewards:lastStreakClaim');
        const today = new Date().toDateString();
        if (last === today) setStreakClaimedToday(true);
    }, []);

    const baseTasks = [
        { id: 1, title: 'Take a quiz', icon: <FaQuestionCircle className="text-yellow-300" />, points: 500 },
        { id: 2, title: 'Watch a video', icon: <MdOutlineOndemandVideo className="text-pink-300" />, points: 50 },
        { id: 3, title: 'Refer a friend', icon: <FaUserFriends className="text-emerald-300" />, points: 500 },
    ];

    const iconCycle = [
        <FaQuestionCircle className="text-yellow-300" />,
        <MdOutlineOndemandVideo className="text-pink-300" />,
        <FaUserFriends className="text-emerald-300" />,
    ];

    const moreTasks = Array.from({ length: 13 }).map((_, i) => ({
        id: 100 + i,
        title: `Bonus task #${i + 1}`,
        icon: iconCycle[i % iconCycle.length],
        points: [25, 40, 75, 100, 120][i % 5]
    }));

    const allTasks = [...baseTasks, ...moreTasks];
    const tasksToShow = showAllTasks ? allTasks : baseTasks;

    const weeklyQuests = [
        { id: 'q1', title: 'Play any game for 15 minutes', progress: 10, goal: 15, reward: 30 },
        { id: 'q2', title: 'Win 3 matches', progress: 1, goal: 3, reward: 60 },
        { id: 'q3', title: 'Login 5 days this week', progress: streakDay, goal: 5, reward: 45 },
    ];

    const rewards = [
        { id: 1, title: 'tbh welcome pack', img: '', price: 500, status: 'redeemed' },
        { id: 2, title: 'Amazon.com $5 gift card', img: '', price: 600, status: 'unlocked' },
        { id: 3, title: 'Sticker pack', img: '', price: 1500, status: 'locked' },
        { id: 4, title: 'Disposable camera', img: '', price: 3500, status: 'locked' },
        { id: 5, title: 'Gaming poster', img: '', price: 800, status: 'locked' },
        { id: 6, title: 'Mystery loot', img: '', price: 1200, status: 'locked' },
    ];

    const leaderboard = [
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
        setHistory(prev => [{ id: Date.now(), type, amount, label, time: new Date().toLocaleString() }, ...prev].slice(0, 15));
    };

    const earnPoints = (amount, label) => {
        setBalance(prev => prev + amount);
        setTotalEarned(prev => prev + amount);
        addHistory('earn', amount, label);
    };

    const tryRedeem = (item) => {
        if (item.status !== 'unlocked') return;
        if (balance < item.price) return;
        if (!window.confirm(`Redeem ${item.title} for ${item.price} points?`)) return;
        setBalance(prev => prev - item.price);
        addHistory('redeem', item.price, item.title);
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

    const claimMilestone = (mid) => {
        setMilestones(prev => prev.map(m => {
            if (m.id === mid && !m.claimed && totalEarned >= m.target) {
                earnPoints(m.bonus, `${m.title} Milestone`);
                return { ...m, claimed: true };
            }
            return m;
        }));
    };

    const completeTask = (task) => {
        if (completedTasks.has(task.id)) return;
        earnPoints(task.points, task.title);
        setCompletedTasks(prev => new Set(prev).add(task.id));
    };

    const completeQuest = (q) => {
        if (completedQuests.has(q.id)) return;
        if (q.progress < q.goal) return; // require goal met
        earnPoints(q.reward, q.title);
        setCompletedQuests(prev => new Set(prev).add(q.id));
    };

    return (
        <section className='pb-12'>
            <div className='max-w-[95%] md:max-w-[85%] m-auto'>
                {/* Hero */}
                <div className='relative mt-10 md:mt-16 rounded-3xl border hero-border bg-white/5 overflow-hidden'>
                    <div className='absolute inset-0 opacity-40' style={{background:"radial-gradient(800px 200px at 50% -20%, rgba(177,145,255,0.35), transparent), radial-gradient(600px 200px at 100% 0%, rgba(98,29,242,0.25), transparent)"}}></div>
                    <div className='relative z-10 px-6 md:px-10 py-10 md:py-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6'>
                        <div>
                            <div className='inline-flex items-center gap-2 chip text-yellow-200 text-xs md:text-sm font-semibold px-3 py-1 rounded-full mb-3'>
                                <FaGem/> Level up your loot
                            </div>
                            <h1 className='text-white font-extrabold text-3xl md:text-5xl leading-tight tracking-tight'>Rewards Hub</h1>
                            <p className='text-white/70 mt-2 md:mt-3 max-w-2xl'>Grind quests, stack streaks, and redeem epic goodies. All your progress and perks live here.</p>
                        </div>
                        <div className='flex items-center gap-6 w-full lg:w-auto'>
                            <div className='glass-card rounded-2xl p-5 min-w-[180px] text-center'>
                                <p className='text-white/70 text-xs'>Current Balance</p>
                                <div className='text-yellow-300 font-extrabold text-3xl md:text-4xl mt-1 flex items-center justify-center gap-2'><FaGem/> {balance}</div>
                            </div>
                            <div className='glass-card rounded-2xl p-5 min-w-[180px] text-center'>
                                <p className='text-white/70 text-xs'>Total Earned</p>
                                <div className='text-yellow-300 font-extrabold text-3xl md:text-4xl mt-1'>{totalEarned}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top grid */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-10'>
                    {/* My Points */}
                    <div className='glass-card rounded-2xl p-6 md:p-7 reward-glow'>
                        <h3 className='text-white font-semibold text-base md:text-lg mb-5'>My Points</h3>
                        <div className='bg-[#171423] rounded-xl p-6 md:p-7 flex flex-col items-center justify-center border border-white/10'>
                            <FaGem className='text-yellow-300 text-4xl md:text-5xl mb-3' />
                            <div className='text-yellow-300 font-extrabold text-4xl md:text-5xl'>{balance}</div>
                            <p className='text-white/80 text-sm md:text-base mt-1'>Your Balance</p>
                            <p className='text-white/50 text-xs md:text-sm text-center mt-3'>Earn points, unlock rewards, and flex your status.</p>
                            <p className='text-white/40 text-xs md:text-sm mt-2'>Total earned: {totalEarned}</p>
                        </div>
                    </div>

                    {/* Earn more points */}
                    <div className='glass-card rounded-2xl p-6 md:p-7 lg:col-span-2 reward-glow'>
                        <div className='flex items-center justify-between mb-5'>
                            <h3 className='text-white font-semibold text-base md:text-lg'>Earn more points</h3>
                            <span className='text-white/50 text-xs'>Daily refresh</span>
                        </div>
                        <div className='space-y-4'>
                            {tasksToShow.map(task => {
                                const done = completedTasks.has(task.id);
                                return (
                                    <div key={task.id} className='flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10'>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center'>
                                                {task.icon}
                                            </div>
                                            <div>
                                                <p className='text-white font-medium'>{task.title}</p>
                                                <div className='flex items-center gap-2 text-yellow-300 text-sm'>
                                                    <FaGem /> <span>{task.points}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => completeTask(task)} disabled={done} className={`px-4 py-2 rounded-lg text-sm font-semibold ${done ? 'btn-soft cursor-not-allowed opacity-60' : 'btn-primary'}`}>
                                            {done ? 'Completed' : 'Earn'}
                                        </button>
                                    </div>
                                );
                            })}
                            <button onClick={() => setShowAllTasks(v => !v)} className='w-full px-4 py-2 rounded-xl text-sm font-semibold btn-soft'>
                                {showAllTasks ? 'Show less' : `View ${allTasks.length - baseTasks.length} More`}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Daily streak + Weekly quests */}
                <div className='mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8'>
                    <div className='glass-card rounded-2xl p-6 reward-glow'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-white font-semibold text-base md:text-lg flex items-center gap-2'><FaCalendarDay className='text-yellow-300'/> Daily Streak</h3>
                            <span className='text-white/70 text-xs'>Day {streakDay}/7</span>
                        </div>
                        <div className='bg-white/5 rounded-xl p-5 border border-white/10'>
                            <div className='flex items-center justify-between'>
                                <div className='text-white/80 text-sm'>Keep your streak to earn bonus points</div>
                                <div className='flex items-center gap-2 text-yellow-300 chip px-2 py-0.5 rounded-md'><FaGem/><span>+20</span></div>
                            </div>
                            <div className='mt-4'>
                                <div className='w-full bg-white/10 rounded-full h-2 overflow-hidden'>
                                    <div className='h-2 bg-gradient-to-r from-[#b191ff] to-[#621df2]' style={{width: `${(streakDay/7)*100}%`}}></div>
                                </div>
                            </div>
                            <button onClick={claimStreak} disabled={streakClaimedToday} className={`mt-5 w-full py-2 rounded-xl text-sm font-semibold ${streakClaimedToday ? 'btn-soft cursor-not-allowed opacity-60' : 'btn-primary'}`}>
                                {streakClaimedToday ? 'Claimed Today' : 'Claim Daily Bonus'}
                            </button>
                        </div>
                    </div>

                    <div className='glass-card rounded-2xl p-6 lg:col-span-2 reward-glow'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-white font-semibold text-base md:text-lg flex items-center gap-2'><FaRegClock className='text-pink-300'/> Weekly Quests</h3>
                            <span className='text-white/50 text-xs'>Resets Monday</span>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {weeklyQuests.map(q => {
                                const progressPct = Math.min(100, (q.progress / q.goal) * 100);
                                const canComplete = q.progress >= q.goal && !completedQuests.has(q.id);
                                const done = completedQuests.has(q.id);
                                return (
                                    <div key={q.id} className='bg-white/5 rounded-xl p-4 border border-white/10'>
                                        <p className='text-white font-medium'>{q.title}</p>
                                        <div className='flex items-center justify-between mt-2'>
                                            <span className='text-white/60 text-xs'>{q.progress}/{q.goal}</span>
                                            <div className='flex items-center gap-1 text-yellow-300 text-sm'><FaGem/> {q.reward}</div>
                                        </div>
                                        <div className='mt-3 w-full bg-white/10 rounded-full h-2 overflow-hidden'>
                                            <div className='h-2 bg-gradient-to-r from-yellow-400 to-orange-400' style={{width: `${progressPct}%`}}></div>
                                        </div>
                                        <button onClick={() => completeQuest(q)} disabled={!canComplete} className={`mt-4 w-full py-2 rounded-lg text-sm font-semibold ${done ? 'btn-soft cursor-not-allowed opacity-60' : canComplete ? 'btn-soft hover:opacity-100' : 'btn-soft cursor-not-allowed opacity-60'}`}>
                                            {done ? 'Completed' : canComplete ? 'Claim Reward' : 'In Progress'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Redeem */}
                <div className='mt-12'>
                    <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-white font-semibold text-base md:text-lg'>Redeem</h3>
                        <span className='text-white/50 text-xs'>Choose your loot</span>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {rewards.map(item => (
                            <div key={item.id} className='glass-card rounded-2xl p-4 md:p-5 reward-glow'>
                                <div className='bg-white/10 h-36 md:h-40 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden'>
                                    {item.status === 'locked' && (
                                        <div className='absolute top-3 left-3 text-[10px] md:text-xs bg-black/60 text-white px-2 py-1 rounded-md flex items-center gap-1'>
                                            <FaLock className='text-white/80' /> Locked
                                        </div>
                                    )}
                                    {item.status !== 'locked' && (
                                        <div className='absolute top-3 left-3 text-[10px] md:text-xs bg-black/60 text-white px-2 py-1 rounded-md'>
                                            Unlocked
                                        </div>
                                    )}
                                    {item.status === 'redeemed' && (
                                        <div className='absolute top-3 right-3 text-[10px] md:text-xs bg-emerald-600/80 text-white px-2 py-1 rounded-md flex items-center gap-1'>
                                            <FaCheckCircle /> Redeemed
                                        </div>
                                    )}
                                    <FaPlay className='text-white/30 text-3xl' />
                                </div>
                                <div>
                                    <p className='text-white text-sm md:text-base font-medium line-clamp-2'>{item.title}</p>
                                    <div className='mt-3 flex items-center gap-2 text-yellow-300'>
                                        <FaGem />
                                        <span className='font-semibold'>{item.price}</span>
                                    </div>
                                    <div className='mt-3'>
                                        <progress value={Math.min(balance, item.price)} max={item.price} className='redeem-progress'></progress>
                                    </div>
                                    <button
                                        onClick={() => tryRedeem(item)}
                                        disabled={item.status !== 'unlocked' || balance < item.price}
                                        className={`mt-4 w-full py-2 rounded-xl text-sm font-semibold ${item.status === 'redeemed' ? 'btn-soft cursor-not-allowed opacity-60' : (item.status === 'unlocked' && balance >= item.price) ? 'btn-primary' : 'btn-soft cursor-not-allowed opacity-60'}`}
                                    >
                                        {item.status === 'redeemed' ? 'Redeemed' : 'Redeem'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Leaderboard & Activity */}
                <div className='mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8'>
                    <div className='glass-card rounded-2xl p-6 reward-glow lg:col-span-2'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-white font-semibold text-base md:text-lg flex items-center gap-2'><FaTrophy className='text-amber-300'/> Leaderboard</h3>
                            <span className='text-white/50 text-xs'>Top this week</span>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {leaderboard.map((u, idx) => (
                                <div key={u.id} className='bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between'>
                                    <div className='flex items-center gap-3'>
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${idx===0?'bg-amber-400 text-black': idx===1?'bg-slate-300 text-black': idx===2?'bg-amber-700 text-white':'bg-white/10 text-white'}`}>{idx+1}</div>
                                        <div>
                                            <p className='text-white font-medium'>{u.name}</p>
                                            <span className='text-white/60 text-xs'>Top Player</span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2 text-yellow-300'><FaGem/><span className='font-semibold'>{u.points}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='glass-card rounded-2xl p-6 reward-glow'>
                        <h3 className='text-white font-semibold text-base md:text-lg mb-4'>Recent Activity</h3>
                        <div className='space-y-3 max-h-80 overflow-auto pr-1'>
                            {history.length === 0 && <p className='text-white/60 text-sm'>No activity yet. Start earning points!</p>}
                            {history.map(it => (
                                <div key={it.id} className='flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3'>
                                    <div>
                                        <p className='text-white text-sm'>{it.label}</p>
                                        <span className='text-white/50 text-xs'>{it.time}</span>
                                    </div>
                                    <div className={`${it.type==='earn'?'text-emerald-300':'text-rose-300'} font-semibold`}>{it.type==='earn'?'+':'-'}{it.amount}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Milestones & Badges */}
                <div className='mt-12'>
                    <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-white font-semibold text-base md:text-lg flex items-center gap-2'><FaMedal className='text-yellow-300'/> Milestones & Badges</h3>
                        <span className='text-white/50 text-xs'>Lifetime progress</span>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {milestones.map(m => {
                            const pct = Math.min(100, (totalEarned / m.target) * 100);
                            const canClaim = !m.claimed && totalEarned >= m.target;
                            return (
                                <div key={m.id} className='glass-card rounded-2xl p-5 reward-glow'>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${canClaim?'bg-yellow-300 text-black': m.claimed ? 'bg-emerald-400 text-black' : 'bg-white/10 text-white'}`}>
                                            <FaStar />
                                        </div>
                                        <div>
                                            <p className='text-white font-semibold'>{m.title}</p>
                                            <span className='text-white/60 text-xs'>Target: {m.target}</span>
                                        </div>
                                    </div>
                                    <div className='w-full bg-white/10 rounded-full h-2 overflow-hidden'>
                                        <div className='h-2 bg-gradient-to-r from-yellow-300 to-amber-500' style={{width: `${pct}%`}}></div>
                                    </div>
                                    <div className='flex items-center justify-between mt-3'>
                                        <span className='text-white/70 text-xs'>Bonus</span>
                                        <div className='flex items-center gap-1 text-yellow-300 text-sm'><FaGem/> {m.bonus}</div>
                                    </div>
                                    <button
                                        onClick={() => claimMilestone(m.id)}
                                        disabled={!canClaim}
                                        className={`mt-4 w-full py-2 rounded-xl text-sm font-semibold ${canClaim ? 'btn-primary' : 'btn-soft cursor-not-allowed opacity-60'}`}
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


