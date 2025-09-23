import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { completeTask } from '../Redux/Slice/reward.slice'
import { useNavigate } from 'react-router-dom'

// Self-contained quiz data
const DEFAULT_QUESTIONS = [
    { id: 1, question: 'Which company developed the game Minecraft?', options: ['Mojang', 'Epic Games', 'Valve', 'Ubisoft'], answerIndex: 0 },
    { id: 2, question: 'What is the highest-selling video game of all time?', options: ['GTA V', 'Tetris', 'Wii Sports', 'Minecraft'], answerIndex: 3 },
    { id: 3, question: 'Which console is known for the game The Last of Us?', options: ['Xbox', 'PlayStation', 'Nintendo Switch', 'PC Only'], answerIndex: 1 },
    { id: 4, question: 'In gaming, what does FPS stand for?', options: ['Frames Per Second', 'First Person Shooter', 'Fast Play Session', 'Final Player Score'], answerIndex: 0 },
    { id: 5, question: 'Which game features the location Hyrule?', options: ['The Witcher', 'Elden Ring', 'The Legend of Zelda', 'Dark Souls'], answerIndex: 2 },
    { id: 6, question: 'Which series features the character Master Chief?', options: ['Halo', 'Doom', 'Borderlands', 'Destiny'], answerIndex: 0 },
    { id: 7, question: 'Which company created the PlayStation?', options: ['Nintendo', 'Sony', 'Microsoft', 'Sega'], answerIndex: 1 },
    { id: 8, question: 'Which game popularized the battle royale genre?', options: ['PUBG', 'Apex Legends', 'Fortnite', 'H1Z1'], answerIndex: 0 },
    { id: 9, question: 'Which game studio developed The Witcher 3?', options: ['Bethesda', 'CD Projekt Red', 'BioWare', 'FromSoftware'], answerIndex: 1 },
    { id: 10, question: 'What is the name of Mario’s dinosaur companion?', options: ['Toad', 'Koopa', 'Yoshi', 'Birdo'], answerIndex: 2 },
    { id: 11, question: 'In Pokémon, what type is Pikachu?', options: ['Fire', 'Water', 'Electric', 'Grass'], answerIndex: 2 },
    { id: 12, question: 'Which game features the city of Los Santos?', options: ['GTA V', 'Sleeping Dogs', 'Watch Dogs', 'Saints Row'], answerIndex: 0 },
    { id: 13, question: 'Which developer is known for the Souls series?', options: ['FromSoftware', 'Naughty Dog', 'Rockstar', 'Ubisoft'], answerIndex: 0 },
    { id: 14, question: 'Which console is made by Microsoft?', options: ['PlayStation', 'Xbox', 'Switch', 'Dreamcast'], answerIndex: 1 },
    { id: 15, question: 'What is Link’s primary weapon in Zelda?', options: ['Gunblade', 'Master Sword', 'Axe', 'Spear'], answerIndex: 1 },
    { id: 16, question: 'Which game introduced the character Geralt of Rivia?', options: ['Skyrim', 'The Witcher', 'Dragon Age', 'Dark Souls'], answerIndex: 1 },
    { id: 17, question: 'Which game engine powers Fortnite?', options: ['Unity', 'Unreal Engine', 'Source', 'id Tech'], answerIndex: 1 },
    { id: 18, question: 'Which series has the character Solid Snake?', options: ['Splinter Cell', 'Metal Gear', 'Hitman', 'Deus Ex'], answerIndex: 1 },
    { id: 19, question: 'What does MMO stand for?', options: ['Massive Multiplayer Online', 'Multi Match Online', 'Mega Multiplayer Online', 'Mixed Multiplayer Option'], answerIndex: 0 },
    { id: 20, question: 'Which franchise features the character Kratos?', options: ['God of War', 'Devil May Cry', 'Bayonetta', 'Darksiders'], answerIndex: 0 },
    { id: 21, question: 'Which game is set in Night City?', options: ['Cyberpunk 2077', 'Deus Ex', 'Control', 'Watch Dogs 2'], answerIndex: 0 },
    { id: 22, question: 'Which platformer stars a blue hedgehog?', options: ['Crash', 'Sonic', 'Rayman', 'Spyro'], answerIndex: 1 },
    { id: 23, question: 'What is the currency in The Witcher 3?', options: ['Gil', 'Zenny', 'Crowns', 'Ruples'], answerIndex: 2 },
    { id: 24, question: 'Which series features the character Samus Aran?', options: ['Metroid', 'Star Fox', 'F-Zero', 'Kid Icarus'], answerIndex: 0 },
    { id: 25, question: 'Which game popularized the phrase “the cake is a lie”?', options: ['Portal', 'Half-Life 2', 'BioShock', 'Prey'], answerIndex: 0 },
    { id: 26, question: 'Which developer created Overwatch?', options: ['Valve', 'Blizzard', 'Riot', 'Epic'], answerIndex: 1 },
    { id: 27, question: 'Which series features the region of Tamriel?', options: ['Dragon Age', 'The Elder Scrolls', 'Baldur’s Gate', 'Divinity'], answerIndex: 1 },
    { id: 28, question: 'Which game features the character Aloy?', options: ['Horizon Zero Dawn', 'Control', 'Returnal', 'Nier: Automata'], answerIndex: 0 },
    { id: 29, question: 'Which game mode drops 100 players onto an island?', options: ['MOBA', 'Battle Royale', 'Arena', 'Survival'], answerIndex: 1 },
    { id: 30, question: 'Which series includes Rainbow Six Siege?', options: ['Tom Clancy’s', 'Battlefield', 'Call of Duty', 'Medal of Honor'], answerIndex: 0 },
    { id: 31, question: 'Which company created the Switch console?', options: ['Sony', 'Sega', 'Nintendo', 'Atari'], answerIndex: 2 },
    { id: 32, question: 'Which game features the character Arthur Morgan?', options: ['GTA IV', 'Red Dead Redemption 2', 'Mafia III', 'LA Noire'], answerIndex: 1 },
    { id: 33, question: 'What genre is League of Legends?', options: ['MOBA', 'MMO', 'RTS', 'Battle Royale'], answerIndex: 0 },
    { id: 34, question: 'Which game features the location Rapture?', options: ['Dishonored', 'BioShock', 'Prey', 'System Shock'], answerIndex: 1 },
    { id: 35, question: 'Which game uses the Nook Miles currency?', options: ['Stardew Valley', 'Animal Crossing: New Horizons', 'The Sims 4', 'Terraria'], answerIndex: 1 },
    { id: 36, question: 'Which character says “Hey! Listen!”?', options: ['Navi (Zelda)', 'Cortana (Halo)', 'Clank (Ratchet)', 'Fi (Zelda)'], answerIndex: 0 },
    { id: 37, question: 'Which company created the Steam platform?', options: ['Valve', 'Epic', 'Ubisoft', 'EA'], answerIndex: 0 },
    { id: 38, question: 'Which game features the character Geralt’s horse named?', options: ['Shadowfax', 'Roach', 'Agro', 'Epona'], answerIndex: 1 },
    { id: 39, question: 'What does NPC stand for?', options: ['Non-Playable Character', 'Network Player Controller', 'New Player Character', 'Non-Primary Character'], answerIndex: 0 },
    { id: 40, question: 'Which franchise includes the map Dust II?', options: ['Valorant', 'Counter-Strike', 'Overwatch', 'Apex Legends'], answerIndex: 1 },
    { id: 41, question: 'Which game is known for the phrase “You Died”?', options: ['Dark Souls', 'Sekiro', 'Bloodborne', 'Demon’s Souls'], answerIndex: 0 },
    { id: 42, question: 'Which company makes the Xbox Game Pass?', options: ['Sony', 'Nintendo', 'Microsoft', 'EA'], answerIndex: 2 },
    { id: 43, question: 'Which racing series features the track Rainbow Road?', options: ['Forza', 'Gran Turismo', 'Mario Kart', 'Need for Speed'], answerIndex: 2 },
    { id: 44, question: 'Which game features the character Lara Croft?', options: ['Uncharted', 'Tomb Raider', 'Prince of Persia', 'Assassin’s Creed'], answerIndex: 1 },
    { id: 45, question: 'Which game features the location Midgar?', options: ['Final Fantasy VII', 'Chrono Trigger', 'Persona 5', 'Xenoblade'], answerIndex: 0 },
    { id: 46, question: 'Which game’s companion cube is iconic?', options: ['Portal', 'Half-Life', 'Prey', 'Control'], answerIndex: 0 },
    { id: 47, question: 'Which series features Vault-Tec?', options: ['Metro', 'Fallout', 'S.T.A.L.K.E.R.', 'Borderlands'], answerIndex: 1 },
    { id: 48, question: 'Which game features the sport Rocket-powered car soccer?', options: ['Trackmania', 'Rocket League', 'Burnout', 'Wipeout'], answerIndex: 1 },
    { id: 49, question: 'Which game mode is 5v5 hero-based shooter?', options: ['Valorant', 'Battlefield', 'PUBG', 'ARMA'], answerIndex: 0 },
    { id: 50, question: 'Which game features the town Pelican Town?', options: ['Stardew Valley', 'Spiritfarer', 'Moonlighter', 'Don’t Starve'], answerIndex: 0 },
]

const SECONDS_PER_QUESTION = 20

const formatTime = (s) => `${Math.floor(s / 60)}:${`${s % 60}`.padStart(2, '0')}`

export default function QuizGame({
    questions = DEFAULT_QUESTIONS,
    secondsPerQuestion = SECONDS_PER_QUESTION,
    shuffle = true,
    limit = 10,
}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userId = useMemo(() => {
        try { return localStorage.getItem('userId') || '' } catch { return '' }
    }, [])
    const [started, setStarted] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(secondsPerQuestion)
    const [finished, setFinished] = useState(false)
    const [answers, setAnswers] = useState([]) // {questionId, selectedIndex, correctIndex, isCorrect, timeTaken}
    const [showResultModal, setShowResultModal] = useState(false)
    const [rewardEarned, setRewardEarned] = useState(0)

    const timerRef = useRef(null)
    const [sessionQuestions, setSessionQuestions] = useState([])
    const [hasPlayed, setHasPlayed] = useState(false)

    useEffect(() => {
        try {
            const playedKey = `quizPlayed:${userId}`
            const already = typeof window !== 'undefined' && localStorage.getItem(playedKey) === '1'
            setHasPlayed(!!already)
        } catch { setHasPlayed(false) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    const sampleQuestions = useCallback(() => {
        const pool = questions.map(q => ({ ...q }))
        if (shuffle) {
            for (let i = pool.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1))
                const tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp
            }
        }
        return pool.slice(0, Math.max(1, Math.min(limit, pool.length)))
    }, [questions, shuffle, limit])

    const totalQuestions = sessionQuestions.length || Math.min(limit, questions.length)

    const resetQuestionState = () => {
        setSelectedIndex(null)
        setTimeLeft(secondsPerQuestion)
    }

    const startQuiz = () => {
        if (hasPlayed) return
        setSessionQuestions(sampleQuestions())
        setStarted(true)
        setFinished(false)
        setCurrentIndex(0)
        setScore(0)
        setAnswers([])
        setTimeLeft(secondsPerQuestion)
        setShowResultModal(false)
        setRewardEarned(0)
    }

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }

    // Timer lifecycle
    useEffect(() => {
        if (!started || finished) return () => { }
        stopTimer()
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // time up -> auto submit as incorrect
                    handleSubmit(null, true)
                    return secondsPerQuestion
                }
                return prev - 1
            })
        }, 1000)
        return () => stopTimer()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [started, currentIndex, finished])

    const handleSubmit = (choiceIndex, dueToTimeout = false) => {
        const q = sessionQuestions[currentIndex]
        const correctIndex = q.answerIndex
        const isCorrect = choiceIndex === correctIndex

        const timeTaken = secondsPerQuestion - timeLeft
        const newAnswer = {
            questionId: q.id,
            selectedIndex: choiceIndex,
            correctIndex,
            isCorrect,
            timeTaken,
            timedOut: dueToTimeout,
        }
        setAnswers((prev) => [...prev, newAnswer])
        if (isCorrect) setScore((s) => s + 1)

        // Move next after a short delay for UX
        setTimeout(() => {
            if (currentIndex + 1 >= totalQuestions) {
                setFinished(true)
                stopTimer()
                // Only award if ALL questions were answered (no early exit)
                try {
                    const playedKey = `quizPlayed:${userId}`
                    const already = typeof window !== 'undefined' && localStorage.getItem(playedKey) === '1'
                    const finalAnswers = [...answers, newAnswer]
                    const finalScore = finalAnswers.reduce((sum, a) => sum + (a.isCorrect ? 1 : 0), 0)
                    const allAnswered = finalAnswers.length === totalQuestions && finalAnswers.every(a => a.selectedIndex !== null)
                    if (!already) {
                        // Save score for Rewards page claim flow
                        try { localStorage.setItem('quiz:lastScore', String(allAnswered ? finalScore : 0)) } catch {}
                        setRewardEarned(allAnswered ? finalScore : 0)
                        // mark played to prevent re-entry via CTA
                        localStorage.setItem(playedKey, '1')
                    } else {
                        setRewardEarned(0)
                    }
                    setHasPlayed(true)
                } catch { }
                setShowResultModal(true)
            } else {
                setCurrentIndex((i) => i + 1)
                resetQuestionState()
            }
        }, 500)
    }

    const progressPercent = started
        ? Math.min(100, Math.round(((currentIndex + (finished ? 1 : 0)) / totalQuestions) * 100))
        : 0

    const restart = () => {
        stopTimer()
        setSessionQuestions(sampleQuestions())
        setStarted(false)
        setFinished(false)
        setCurrentIndex(0)
        setSelectedIndex(null)
        setScore(0)
        setTimeLeft(secondsPerQuestion)
        setAnswers([])
    }

    return (
        <div className='container pt-14 lg:py-24'>
            <div className='mx-auto max-w-3xl bg-[#221f2a] rounded-2xl border border-white/10 p-2 sm:p-5 md:p-8 shadow-xl shadow-purple-900/20'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <button
                            className='px-3 py-1 rounded-lg text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-300 shadow-lg shadow-purple-900/40'
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </button>
                        <h2 className='text-xl sm:text-2xl font-semibold text-white'>Quiz Game</h2>
                    </div>
                    <div className='text-sm text-purple-200 bg-white/10 px-3 py-1 rounded-lg border border-white/10'>
                        {started && !finished ? (
                            <span>Time Left: {formatTime(timeLeft)}</span>
                        ) : (
                            <span>Total: {totalQuestions} Qs</span>
                        )}
                    </div>
                </div>

                {/* Progress */}
                <div className='mt-4'>
                    <div className='w-full h-2 rounded-full bg-white/10 overflow-hidden'>
                        <div
                            className='h-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-300'
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    {started && !finished && (
                        <p className='text-xs text-purple-200 mt-1'>
                            Question {currentIndex + 1} of {totalQuestions}
                        </p>
                    )}
                </div>

                {/* Body */}
                {!started && !finished && (
                    <div className='mt-8 text-center'>
                        <p className='text-purple-200'>Test your gaming knowledge. Each question has a timer.</p>
                        <p className='text-purple-200'>1 queston true will be you given 1 point</p>
                        <p className='text-purple-200'>If you leave it incomplete, you won't get a single point.</p>
                        <button
                            className={`mt-6 px-6 py-3 rounded-xl text-sm font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 transition-all duration-300 shadow-lg shadow-purple-900/40 ${hasPlayed ? 'opacity-50 cursor-not-allowed' : 'hover:text-white hover:bg-purple-500/30'}`}
                            onClick={startQuiz}
                            disabled={hasPlayed}
                        >
                            {hasPlayed ? 'Quiz Already Played' : 'Start Quiz'}
                        </button>
                    </div>
                )}

                {started && !finished && (
                    <div className='mt-8'>
                        <div className='bg-white/5 rounded-xl p-5 border border-white/10'>
                            <p className='text-white text-lg font-medium'>{sessionQuestions[currentIndex]?.question}</p>
                            <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                {sessionQuestions[currentIndex]?.options.map((opt, idx) => {
                                    const isPicked = selectedIndex === idx
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                if (selectedIndex !== null) return
                                                setSelectedIndex(idx)
                                                handleSubmit(idx)
                                            }}
                                            className={`text-left px-4 py-3 rounded-lg border transition-all duration-200 ${isPicked
                                                ? 'bg-purple-600/30 border-purple-400 text-white'
                                                : 'bg-white/5 hover:bg-white/10 border-white/10 text-purple-100'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className='mt-6 flex items-center justify-between'>
                            <span className='text-purple-200 text-sm'>Score: {score}</span>
                            <span className='text-purple-300 text-xs'>
                                {currentIndex + 1}/{totalQuestions}
                            </span>
                        </div>
                    </div>
                )}

                {finished && (
                    <div className='mt-8'>
                        <div className='bg-white/5 rounded-xl p-5 border border-white/10'>
                            <p className='text-white text-lg font-semibold'>Results</p>
                            <p className='text-purple-200 mt-2'>
                                You scored {score} out of {totalQuestions}
                            </p>
                            <p className='text-purple-200 mt-1'>
                                Total Reward: {rewardEarned} points
                            </p>

                            <div className='mt-5 space-y-3 max-h-72 overflow-auto pr-1'>
                                {answers.map((a, i) => {
                                    const q = sessionQuestions[i]
                                    const wasSkipped = a.selectedIndex === null
                                    const correctText = q.options[a.correctIndex]
                                    const pickedText = wasSkipped ? 'No answer' : q.options[a.selectedIndex]
                                    return (
                                        <div key={q.id} className='p-3 rounded-lg bg-white/5 border border-white/10'>
                                            <p className='text-white text-sm'>{i + 1}. {q.question}</p>
                                            <p className={`text-xs mt-1 ${a.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                                {a.isCorrect ? 'Correct' : wasSkipped ? 'Timed out' : 'Incorrect'}
                                                <span className='text-purple-300'> • Time: {a.timeTaken}s</span>
                                            </p>
                                            <p className='text-purple-200 text-xs mt-1'>
                                                Correct: {correctText}
                                                {!a.isCorrect && (
                                                    <>
                                                        <span> • Your answer: </span>
                                                        <span className='text-purple-100'>{pickedText}</span>
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* <div className='mt-6 flex items-center justify-between'>
                                <button
                                    className='px-6 py-3 rounded-xl text-sm font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-300 shadow-lg shadow-purple-900/40'
                                    onClick={restart}
                                >
                                    Restart
                                </button>
                            </div> */}
                        </div>
                    </div>
                )}
            </div>
            {showResultModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center'>
                    <div className='absolute inset-0 bg-black/60' onClick={() => setShowResultModal(false)} />
                    <div className='relative z-10 w-full max-w-md mx-4 rounded-2xl border border-white/10 bg-[#1a1720] p-6 shadow-2xl shadow-purple-900/30'>
                        <h3 className='text-xl font-semibold text-white'>Quiz Completed</h3>
                        <p className='mt-2 text-purple-200'>Final Score: <span className='text-white'>{score}</span> / {totalQuestions}</p>
                        <p className='mt-1 text-purple-200'>Total Reward Given: <span className='text-white'>{rewardEarned}</span> points</p>
                        <div className='mt-6 flex gap-3 justify-end'>
                            <button
                                className='px-5 py-2 rounded-xl text-sm font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-300 shadow-lg shadow-purple-900/40'
                                onClick={() => setShowResultModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


