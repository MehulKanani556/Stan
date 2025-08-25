import React from 'react'

export default function FAQs() {
    return (
        <section className='py-10 '>
            <h1 className='sm:text-2xl text-xl font-bold text-white text-center mb-6 underline'>Frequently Asked Questions</h1>
            <div className='flex flex-col gap-4 max-w-[95%] md:max-w-[85%] m-auto '>

                {/* General Platform Questions */}
                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">What is YOYO and how does it work?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">YOYO is a comprehensive gaming platform that allows you to discover, play, and purchase games. You can earn rewards through gameplay, referrals, and daily activities, chat with other gamers, and build your gaming profile.</div>
                </div>



                {/* Gaming Questions */}
                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">What types of games are available on YOYO?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">YOYO offers a wide variety of games including action, adventure, puzzle, strategy, and more. We regularly update our game library with new releases and popular titles across different platforms.</div>
                </div>

                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">Can I play games for free on YOYO?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">Yes! YOYO offers many free games that you can play without any cost. Some premium games may require purchase, but we also provide free trials and demo versions.</div>
                </div>

                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">How do I find games that match my interests?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">Use our category filters, browse trending and popular games, or check out our personalized recommendations based on your gaming history and preferences.</div>
                </div>



                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">When does referral reward get credited to my account?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">The referral reward gets credited to your account within 24 hours.</div>
                </div>



                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">What should I do if my referral reward is not credited?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">In the event that your referral reward is not credited, please don't hesitate to reach out to our support team. We are here to assist you.</div>
                </div>

                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">Can I get a refund for purchased games?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">Refund policies vary by game and are subject to our terms of service. Generally, refunds are available within a limited time frame if the game hasn't been played extensively.</div>
                </div>

                {/* Chat & Social Features */}
                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">How does the chat system work?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">GGTalks is our real-time chat system where you can connect with other gamers. You can send messages, see when someone is typing, and build your gaming community.</div>
                </div>

                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">Is my chat private and secure?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">Yes, all chats are private between users. We implement security measures to protect your conversations and personal information.</div>
                </div>

                {/* Profile & Account Management */}
                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">How do I update my profile information?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">Go to your Profile page and click the edit button next to any field you want to update. You can modify your personal details, gaming preferences, and profile picture.</div>
                </div>


            </div>
        </section>
    )
}
