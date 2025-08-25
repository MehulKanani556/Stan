import mongoose from "mongoose";
import Game from "../models/Games.model.js";
import Category from "../models/Category.model.js";
import FreeGameStan from "../models/freeGamesModel.js";
import axios from 'axios'; // Import axios

const suggestions = [
    "🎮 Recommend games for me",
    "🏷️ Show all categories", 
    "💰 Find games under $15",
    "🆓 Show free games",
    "✨ What's new and trending?",
    "🔥 Popular action games",
    "🧩 Puzzle games for relaxation",
    "❓ Ask me anything about games!"
];

// Comprehensive knowledge base for question answering
const knowledgeBase = {
    gaming: {
        "what is gaming": "Gaming refers to the act of playing electronic games, whether on computers, consoles, mobile devices, or other platforms. It's a popular form of entertainment that can range from casual mobile games to competitive esports.",
        "benefits of gaming": "Gaming can improve cognitive skills, hand-eye coordination, problem-solving abilities, and social connections. Many games also help with stress relief and provide educational value.",
        "types of games": "There are many game genres including Action, Adventure, RPG (Role-Playing Games), Strategy, Puzzle, Sports, Racing, Simulation, and Indie games. Each offers different gameplay experiences.",
        "how to choose games": "Consider your interests, available time, budget, platform, and difficulty preferences. Start with highly-rated games in genres you enjoy, or try free games to explore new types.",
        "gaming platforms": "Popular gaming platforms include PC (Windows, Mac, Linux), consoles (PlayStation, Xbox, Nintendo), mobile devices (iOS, Android), and web browsers.",
        "esports": "Esports refers to competitive video gaming where professional players compete in tournaments. Popular esports games include League of Legends, Counter-Strike, Dota 2, and Fortnite.",
        "gaming addiction": "Gaming addiction is excessive gaming that interferes with daily life. Signs include neglecting responsibilities, social isolation, and inability to control gaming time. Moderation and balance are key.",
        "how to play game": "To play a game, you typically start by installing it on your chosen platform (PC, console, mobile). Once installed, launch the game, and most will guide you through tutorials for controls and basic mechanics. Many games offer adjustable difficulty settings and in-game hints to help you get started!"
    },
    technical: {
        "system requirements": "System requirements vary by game. Generally, you'll need: adequate RAM (8GB+), a decent graphics card, sufficient storage space, and a compatible operating system. Check specific game requirements before purchasing.",
        "graphics settings": "Graphics settings control visual quality and performance. Higher settings provide better visuals but require more powerful hardware. Adjust settings based on your system capabilities for optimal experience.",
        "frame rate": "Frame rate (FPS) measures how many images your screen displays per second. Higher FPS (60+) provides smoother gameplay, especially important for fast-paced games like shooters and racing games.",
        "game updates": "Game updates fix bugs, add new content, improve performance, and enhance security. Enable automatic updates when possible to ensure the best gaming experience.",
        "installation": "Game installation typically involves downloading from a digital platform (Steam, Epic Games, etc.), running the installer, and following setup instructions. Ensure you have enough storage space."
    },
    platform_specific: {
        "steam": "Steam is a popular digital game distribution platform by Valve. It offers thousands of games, community features, achievements, and regular sales with significant discounts.",
        "epic games": "Epic Games Store is a digital marketplace offering free weekly games, exclusive titles, and competitive revenue sharing for developers. Known for big-budget exclusive releases.",
        "origin": "Origin (now EA App) is Electronic Arts' digital distribution platform featuring EA games like FIFA, Battlefield, and The Sims series.",
        "mobile gaming": "Mobile gaming involves playing games on smartphones and tablets. Popular mobile games include puzzle games, strategy games, and casual arcade-style games."
    },
    business: {
        "pricing": "Game prices vary widely from free-to-play to $60+ for AAA titles. Factors affecting price include development cost, publisher, platform, and game scope. Look for sales and bundles for better deals.",
        "refunds": "Most platforms offer refund policies. Steam allows refunds within 14 days of purchase with less than 2 hours played. Always check the specific refund policy of your platform.",
        "digital vs physical": "Digital games offer instant download and no physical storage needs, while physical games can be resold and don't require internet for installation. Digital is increasingly popular due to convenience."
    }
};

// Advanced intent patterns for better question understanding
const advancedIntentPatterns = {
    // Question words
    question: /^(what|how|why|when|where|which|who|can|could|should|would|will|is|are|do|does|did)\s/i,
    
    // Gaming specific
    recommendation: /(recommend|suggest|what should|good games|best games|help me find|looking for)/i,
    comparison: /(vs|versus|compare|difference|better|best)/i,
    explanation: /(what is|how does|explain|tell me about)/i,
    
    // Emotional/mood
    mood: /(feel|mood|want something|looking for something|bored|excited|relaxed|stressed)/i,
    
    // Problem solving
    problem: /(problem|issue|trouble|help|error|bug|fix|solve)/i,
    
    // Learning/education
    learning: /(learn|teach|tutorial|guide|how to|beginner)/i
};

// Context-aware conversation memory
let conversationContext = new Map();

// Enhanced response templates
const responseTemplates = {
    greeting: [
        "🎮 Hey there, fellow gamer! What can I help you discover today?",
        "👋 Welcome! I'm your gaming assistant. Ask me anything about games!",
        "🌟 Hello! Ready to explore the world of gaming? I'm here to help!"
    ],
    thanks: [
        "You're absolutely welcome! Happy gaming! 🎮",
        "Glad I could help! Feel free to ask me anything else! ✨",
        "My pleasure! I'm always here if you need more gaming advice! 🚀"
    ],
    clarification: [
        "🤔 Could you be more specific about what you're looking for?",
        "💭 I want to help! Can you tell me more details about your question?",
        "🔍 Let me understand better - what exactly would you like to know?"
    ]
};

// Game recommendations based on mood/preferences
const moodBasedRecommendations = {
    relaxing: ["puzzle", "simulation", "casual", "indie"],
    exciting: ["action", "racing", "adventure", "shooter"],
    challenging: ["strategy", "puzzle", "rpg", "simulation"],
    multiplayer: ["multiplayer", "online", "co-op", "pvp"],
    story: ["rpg", "adventure", "narrative", "story-driven"]
};

export const chatWidGetController = async (req, res) => {
    try {
        const { q = "", page = 1, limit = 6, sessionId = null } = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);

        // Default welcome with dynamic greeting
        if (!q) {
            const randomGreeting = responseTemplates.greeting[
                Math.floor(Math.random() * responseTemplates.greeting.length)
            ];
            return res.json({
                reply: randomGreeting,
                suggestions: suggestions.slice(0, 6),
                results: [],
                context: "greeting"
            });
        }

        let reply = "";
        let results = [];
        let hasMore = false;
        let context = "general";
        let canAnswer = true;

        // Normalize and analyze query
        const query = q.toLowerCase().trim();
        const originalQuery = q.trim();

        // Store query in conversation history
        if (sessionId && !conversationContext.has(sessionId)) {
            conversationContext.set(sessionId, {
                previousQueries: [],
                userPreferences: {},
                conversationHistory: []
            });
        }
        // Store query in conversation history
        if (sessionId) {
            const session = conversationContext.get(sessionId);
            if (session) {
                session.previousQueries.push(originalQuery);
                session.conversationHistory.push({ query: originalQuery, timestamp: new Date() });
            }
        }

        // Advanced question analysis
        const questionAnalysis = analyzeQuestion(query, originalQuery);
        
        // Handle general website information queries
        if (questionAnalysis.isQuestion && (query.includes("website") || query.includes("yoyo") || query.includes("platform") || query.includes("faq") || query.includes("privacy") || query.includes("terms") || query.includes("about us"))) {
            try {
                const websiteInfoResponse = await axios.get(`http://localhost:8000/website/website-info?query=${encodeURIComponent(query)}`);
                if (websiteInfoResponse.data && websiteInfoResponse.data.answer) {
                    return res.json({
                        q: originalQuery,
                        page: pageNum,
                        hasMore: false,
                        reply: `ℹ️ Here's some information about your query:\n\n${websiteInfoResponse.data.answer}`,
                        results: [],
                        suggestions: generateTopicSuggestions(query),
                        context: "website_info",
                        canAnswer: true,
                        answerType: "website_info"
                    });
                }
            } catch (error) {
                console.error("Error fetching website information:", error.message);
                // Fallback to general knowledge base or other handlers if API fails or no answer found
            }
        }

        // Handle conversational patterns first
        if (advancedIntentPatterns.question.test(originalQuery) && !isGameSpecificQuery(query)) {
            const answer = findKnowledgeBaseAnswer(query);
            if (answer) {
                reply = `💡 ${answer}\n\nWant to explore some games related to this topic?`;
                context = "knowledge";
                canAnswer = true;
                
                return res.json({
                    q: originalQuery,
                    page: pageNum,
                    hasMore: false,
                    reply,
                    results: [],
                    suggestions: generateTopicSuggestions(query),
                    context,
                    canAnswer,
                    answerType: "knowledge_base"
                });
            }
        }

        // Handle greetings
        if (/(^hi|^hello|^hey|good morning|good afternoon|good evening)/i.test(originalQuery)) {
            const randomGreeting = responseTemplates.greeting[
                Math.floor(Math.random() * responseTemplates.greeting.length)
            ];
            return res.json({
                reply: randomGreeting,
                suggestions: suggestions.slice(0, 6),
                results: [],
                context: "greeting",
                canAnswer: true
            });
        }

        // Handle thanks
        if (/(thank you|thanks|thx|appreciate)/i.test(originalQuery)) {
            const randomThanks = responseTemplates.thanks[
                Math.floor(Math.random() * responseTemplates.thanks.length)
            ];
            return res.json({
                reply: randomThanks,
                suggestions: ["🎮 Find more games", "🏷️ Browse categories", "✨ Show trending games"],
                results: [],
                context: "thanks",
                canAnswer: true
            });
        }

        // Advanced question handling
        if (questionAnalysis.isQuestion) {
            const contextualAnswer = await generateContextualAnswer(questionAnalysis, query);
            if (contextualAnswer.hasAnswer) {
                return res.json({
                    q: originalQuery,
                    page: pageNum,
                    hasMore: contextualAnswer.hasMore || false,
                    reply: contextualAnswer.reply,
                    results: contextualAnswer.results || [],
                    suggestions: contextualAnswer.suggestions || generateDynamicSuggestions("answer", query, sessionId),
                    context: contextualAnswer.context || "answer",
                    canAnswer: true,
                    answerType: contextualAnswer.type
                });
            }
        }

        // 🔹 Smart Category Listing
        if (/(categor|browse|types|genre)/i.test(query)) {
            const categories = await Category.find({})
                .select("categoryName category_description category_image")
                .sort({ categoryName: 1 });
            
            if (categories.length > 0) {
                reply = `🏷️ Here are all ${categories.length} game categories available:\n\n` +
                    categories
                        .map((cat, index) => `${index + 1}. **${cat.categoryName}** - ${cat.category_description}`)
                        .join("\n") + 
                    "\n\n💡 *Click on any category to see games, or ask me 'What are the best [category] games?'*";
                        
                results = categories.map((cat) => ({
                    _id: cat._id,
                    title: cat.categoryName,
                    description: cat.category_description,
                    imageUrl: cat.category_image?.url,
                    type: 'category',
                    action: `Show ${cat.categoryName} games`
                }));

                context = "categories";
            } else {
                reply = "😔 Sorry, I don't have any categories available right now.";
                canAnswer = false;
            }
        }
        
        // 🔹 Enhanced Price-based Search with Question Understanding
        else if (/(price|cost|budget|cheap|expensive|under|below|less than|more than|\$\d+)/i.test(query)) {
            const priceInfo = extractPriceInfo(query);
            const priceLimit = priceInfo.amount || 20;
            const operator = priceInfo.operator || 'under';
            
            let priceQuery = { isActive: true, "platforms.windows.available": true };
            
            if (operator === 'under' || operator === 'below') {
                priceQuery["platforms.windows.price"] = { $lte: priceLimit };
            } else if (operator === 'over' || operator === 'above') {
                priceQuery["platforms.windows.price"] = { $gte: priceLimit };
            }

            const totalCount = await Game.countDocuments(priceQuery);
            const games = await Game.find(priceQuery)
            .populate("category", "categoryName")
            .select("title description cover_image category platforms")
            .sort({ "platforms.windows.price": 1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

            if (games.length > 0) {
                reply = `💰 Found ${totalCount} games ${operator} $${priceLimit}:\n\n` +
                    games.map((game, index) => 
                        `${index + 1}. **${game.title}** - $${game.platforms.windows.price} (${game.category?.categoryName || "Uncategorized"})`
                    ).join("\n");

                if (totalCount > limitNum) {
                    reply += `\n\n📄 Showing ${games.length} of ${totalCount} games. Want to see more?`;
                }

                results = games.map((game) => ({
                    _id: game._id,
                    title: game.title,
                    description: game.description,
                    imageUrl: game.cover_image?.url,
                    category: game.category?.categoryName,
                    price: game.platforms.windows.price,
                    type: 'game',
                    priceLabel: `$${game.platforms.windows.price}`
                }));
                
                hasMore = pageNum * limitNum < totalCount;
                context = "price_search";
            } else {
                reply = `😔 Sorry, I couldn't find any games ${operator} $${priceLimit}. Would you like to adjust your budget or see our free games?`;
                canAnswer = false;
            }
        }

        else if (query.includes("free game") || req.query.type === "freegamestan") {
            const totalCount = await FreeGameStan.countDocuments({});
            const freeGames = await FreeGameStan.find({})
                .select("name image")
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum);

            if (freeGames.length > 0) {
                reply = `🆓 Here are ${totalCount} free games from FreeGameStan:\n\n` +
                    freeGames.map((game, index) => 
                        `${index + 1}. **${game.name}** - FREE!`
                    ).join("\n");

                if (totalCount > limitNum) {
                    reply += `\n\n🎮 That's ${freeGames.length} of ${totalCount} free games. Want more?`;
                }

                results = freeGames.map((game) => ({
                    _id: game._id,
                    title: game.name,
                    description: "", // FreeGameStan model doesn't have a description field
                    imageUrl: game.image,
                    price: 0,
                    type: 'freegamestan',
                    priceLabel: "FREE"
                }));
                
                hasMore = pageNum * limitNum < totalCount;
                context = "free_games_stan";
            } else {
                reply = "😔 No free games available from FreeGameStan right now.";
                canAnswer = false;
            }
        }
        // 🔹 Enhanced Free Games
        else if (/free/i.test(query) && !/(find|search)/i.test(query)) {
            const totalCount = await Game.countDocuments({
                isActive: true,
                "platforms.windows.available": true,
                "platforms.windows.price": { $eq: 0 }
            });

            const freeGames = await Game.find({
                isActive: true,
                "platforms.windows.available": true,
                "platforms.windows.price": { $eq: 0 }
            })
            .populate("category", "categoryName")
            .select("title description cover_image category platforms")
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

            if (freeGames.length > 0) {
                reply = `🆓 Awesome! Here are ${totalCount} completely free games:\n\n` +
                    freeGames.map((game, index) => 
                        `${index + 1}. **${game.title}** - FREE! (${game.category?.categoryName || "Uncategorized"})`
                    ).join("\n");

                if (totalCount > limitNum) {
                    reply += `\n\n🎮 That's ${freeGames.length} of ${totalCount} free games. Want more?`;
                }

                reply += "\n\n💡 *Tip: Free games are perfect for trying new genres without commitment!*";

                results = freeGames.map((game) => ({
                    _id: game._id,
                    title: game.title,
                    description: game.description,
                    imageUrl: game.cover_image?.url,
                    category: game.category?.categoryName,
                    price: 0,
                    type: 'game',
                    priceLabel: "FREE"
                }));
                
                hasMore = pageNum * limitNum < totalCount;
                context = "free_games";
            } else {
                reply = "😔 No free games available right now, but I can show you some great budget options under $10!";
                canAnswer = false;
            }
        }

        // 🔹 Smart Search with AI-like Understanding
        else if (query.includes("find") || query.includes("search") || advancedIntentPatterns.recommendation.test(query)) {
            let searchKeyword = query
                .replace(/find|search|recommend|suggest|show me|looking for|want/g, "")
                .replace(/games?/g, "")
                .trim();

            // Handle mood-based searches
            const detectedMood = Object.keys(moodBasedRecommendations).find(mood => 
                query.includes(mood) || searchKeyword.includes(mood)
            );

            if (detectedMood) {
                const moodCategories = moodBasedRecommendations[detectedMood];
                const categoryQuery = await Category.find({
                    categoryName: { $regex: moodCategories.join("|"), $options: "i" }
                }).select("_id");

                const categoryIds = categoryQuery.map(cat => cat._id);
                
                const totalGames = await Game.countDocuments({
                    isActive: true,
                    category: { $in: categoryIds }
                });

                const games = await Game.find({
                    isActive: true,
                    category: { $in: categoryIds }
                })
                .populate("category", "categoryName")
                .select("title description cover_image category platforms")
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum);

                if (games.length > 0) {
                    reply = `🎯 Perfect! I found ${totalGames} ${detectedMood} games just for you:\n\n` +
                        games.map((game, index) => 
                            `${index + 1}. **${game.title}** (${game.category?.categoryName})`
                        ).join("\n") +
                        `\n\n✨ These games are perfect for a ${detectedMood} gaming session!`;

                    results = games.map((game) => ({
                        _id: game._id,
                        title: game.title,
                        description: game.description,
                        imageUrl: game.cover_image?.url,
                        category: game.category?.categoryName,
                        type: 'game',
                        mood: detectedMood
                    }));

                    hasMore = pageNum * limitNum < totalGames;
                    context = "mood_based";
                }
            }
            // Regular search
            else {
                const gameQuery = { isActive: true };
                if (searchKeyword) {
                    gameQuery.$or = [
                        { title: { $regex: searchKeyword, $options: "i" } },
                        { description: { $regex: searchKeyword, $options: "i" } }
                    ];
                }

                const totalGames = await Game.countDocuments(gameQuery);
                const games = await Game.find(gameQuery)
                    .select("title description cover_image platforms category")
                    .skip((pageNum - 1) * limitNum)
                    .limit(limitNum)
                    .populate("category", "categoryName");

                if (games.length > 0) {
                    reply = `🔍 Found ${totalGames} games matching "${originalQuery}":\n\n` +
                        games.map((game, index) => 
                            `${index + 1}. **${game.title}** (${game.category?.categoryName || "Uncategorized"})`
                        ).join("\n") +
                        (totalGames > limitNum ? `\n\n📄 Showing ${games.length} of ${totalGames} results.` : "");

                    results = games.map((game) => ({
                        _id: game._id,
                        title: game.title,
                        description: game.description,
                        imageUrl: game.cover_image?.url,
                        platforms: game.platforms,
                        category: game.category?.categoryName,
                        type: 'game'
                    }));
                    
                    hasMore = pageNum * limitNum < totalGames;
                    context = "search_results";
                } else {
                    reply = `😔 I couldn't find any games matching "${originalQuery}". Try these instead:\n\n` +
                           "• Browse by category\n• Check out trending games\n• Look for games under your budget";
                }
            }
        }

        // 🔹 Enhanced Game Listings
        else if (query.includes("all games") || query.includes("list games") || 
                 (advancedIntentPatterns.recommendation.test(query) && !query.includes("find"))) {
            const totalGames = await Game.countDocuments({ isActive: true });
            const games = await Game.find({ isActive: true })
                .select("title description cover_image platforms category createdAt")
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .populate("category", "categoryName")
                .sort({ createdAt: -1 });

            if (games.length > 0) {
                reply = `🎮 Here's our amazing collection of ${totalGames} games:\n\n` +
                    games.map((game, index) => 
                        `${index + 1}. **${game.title}** (${game.category?.categoryName || "Uncategorized"})`
                    ).join("\n") +
                    (totalGames > limitNum ? `\n\n📄 Showing ${games.length} of ${totalGames} games. Scroll for more!` : "") +
                    "\n\n💡 *Tip: Use filters like 'free games' or 'games under $20' to narrow down your search!*";

                results = games.map((game) => ({
                    _id: game._id,
                    title: game.title,
                    description: game.description,
                    imageUrl: game.cover_image?.url,
                    platforms: game.platforms,
                    category: game.category?.categoryName,
                    type: 'game'
                }));
                
                hasMore = pageNum * limitNum < totalGames;
                context = "all_games";
            } else {
                reply = "😔 No games available right now. Please check back later!";
            }
        }

        // 🔹 Trending/Latest Games with Enhanced Messaging
        else if (query.includes("latest") || query.includes("newest") || query.includes("recent") || 
                 query.includes("trending") || query.includes("popular") || query.includes("new")) {
            const totalGames = await Game.countDocuments({ isActive: true });
            const games = await Game.find({ isActive: true })
                .select("title description cover_image platforms category createdAt")
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .populate("category", "categoryName");

            if (games.length > 0) {
                reply = `🔥 Here are the hottest and newest games right now:\n\n` +
                    games.map((game, index) => 
                        `${index + 1}. **${game.title}** (${game.category?.categoryName || "New Release"}) ✨`
                    ).join("\n") +
                    `\n\n🎯 These ${games.length} games are fresh and trending! Perfect time to jump in!`;

                results = games.map((game) => ({
                    _id: game._id,
                    title: game.title,
                    description: game.description,
                    imageUrl: game.cover_image?.url,
                    platforms: game.platforms,
                    category: game.category?.categoryName,
                    type: 'game',
                    badge: 'NEW'
                }));
                
                hasMore = pageNum * limitNum < totalGames;
                context = "trending";
            } else {
                reply = "😔 No new games available right now, but check out our popular titles!";
            }
        }

        // 🔹 Enhanced Support Section
        else if (query.includes("help") || query.includes("support") || query.includes("contact") || 
                 query.includes("problem") || query.includes("issue")) {
            reply = `🤝 I'm here to help! Here are ways to get support:\n\n` +
                   `📧 **Email Support:** support@yourwebsite.com\n` +
                   `📞 **Phone:** +1-800-123-4567 (Mon-Fri, 9AM-6PM)\n` +
                   `💬 **Live Chat:** Available on our website\n` +
                   `❓ **FAQ:** Check our help center for quick answers\n\n` +
                   `🤖 **Or ask me directly!** I can help you find games, explain features, or guide you through our platform!`;
            context = "support";
        }

        // 🔹 Privacy & Terms with Better UX
        else if (query.includes("privacy")) {
            reply = `🔒 **Privacy Policy**\n\n` +
                   `Your privacy is important to us! Our detailed privacy policy explains how we collect, use, and protect your data.\n\n` +
                   `📄 **Read full policy:** https://yourwebsite.com/privacy-policy\n\n` +
                   `💡 **Quick summary:** We only use your data to improve your gaming experience and never sell personal information.`;
            context = "privacy";
        }

        else if (query.includes("terms")) {
            reply = `📋 **Terms & Conditions**\n\n` +
                   `Our terms outline the rules and guidelines for using our platform.\n\n` +
                   `📄 **Read full terms:** https://yourwebsite.com/terms\n\n` +
                   `💡 **Key points:** Fair use, account responsibilities, and platform guidelines.`;
            context = "terms";
        }

        // Enhanced fallback with intelligent suggestions
        else {
            // Try category search as fallback
            const category = await Category.findOne({
                categoryName: { $regex: query, $options: "i" }
            }).select("_id categoryName category_description");

            if (category) {
                const totalGames = await Game.countDocuments({
                    isActive: true,
                    category: category._id,
                });

                const games = await Game.find({
                    isActive: true,
                    category: category._id
                })
                .select("title description cover_image platforms")
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum);

                if (games.length > 0) {
                    reply = `🎯 **${category.categoryName} Games**\n\n` +
                           `${category.category_description}\n\n` +
                           `Found ${totalGames} amazing ${category.categoryName.toLowerCase()} games:\n\n` +
                           games.map((game, index) => 
                               `${index + 1}. **${game.title}**`
                           ).join("\n");

                    if (totalGames > limitNum) {
                        reply += `\n\n📄 Showing ${games.length} of ${totalGames} games in this category.`;
                    }

                    results = games.map((game) => ({
                        _id: game._id,
                        title: game.title,
                        description: game.description,
                        imageUrl: game.cover_image?.url,
                        platforms: game.platforms,
                        category: category.categoryName,
                        type: 'game'
                    }));
                    
                    hasMore = pageNum * limitNum < totalGames;
                    context = "category";
                } else {
                    reply = `😔 No games available in the "${category.categoryName}" category yet.`;
                    canAnswer = false;
                }
            } else {
                // Generate intelligent response for unknown queries
                const intelligentResponse = generateIntelligentFallback(originalQuery, sessionId);
                reply = intelligentResponse.reply;
                context = "intelligent_fallback";
                canAnswer = intelligentResponse.canAnswer;
            }
        }

        // Generate dynamic suggestions
        const dynamicSuggestions = generateDynamicSuggestions(context, query, sessionId);

        return res.json({
            q: originalQuery,
            page: pageNum,
            hasMore,
            reply,
            results,
            // suggestions: hasMore ? [] : dynamicSuggestions,
            context,
            totalResults: results.length,
            conversationFlow: true,
            questionHandled: questionAnalysis.isQuestion
        });

    } catch (error) {
        console.error('Advanced chat widget controller error:', error);
        
        const errorResponses = [
            "😅 I encountered a technical issue, but I'm still here to help! Could you rephrase your question?",
            "🤖 Something went wrong on my end. Let me try to help you in a different way - what are you looking for?",
            "⚡ I had a small hiccup there! Don't worry, I can still answer questions about games. What would you like to know?"
        ];
        
        const randomError = errorResponses[Math.floor(Math.random() * errorResponses.length)];
        
        return res.status(500).json({
            reply: randomError,
            suggestions: suggestions.slice(0, 4),
            results: [],
            context: "error",
            canAnswer: true,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


// Advanced helper functions for question answering

function analyzeQuestion(query, originalQuery) {
    const isQuestion = advancedIntentPatterns.question.test(originalQuery) || 
                      query.includes('?') || 
                      /(tell me|explain|describe)/i.test(query);
    
    const questionType = getQuestionType(query);
    const keywords = extractKeywords(query);
    const intent = detectAdvancedIntent(query);
    
    return {
        isQuestion,
        questionType,
        keywords,
        intent,
        complexity: assessComplexity(query)
    };
}

function getQuestionType(query) {
    if (/^what/i.test(query)) return 'definition';
    if (/^how/i.test(query)) return 'process';
    if (/^why/i.test(query)) return 'reason';
    if (/^when/i.test(query)) return 'time';
    if (/^where/i.test(query)) return 'location';
    if (/^who/i.test(query)) return 'person';
    if (/^which/i.test(query)) return 'choice';
    return 'general';
}

function extractKeywords(query) {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);
    return query.split(' ')
        .filter(word => word.length > 2 && !stopWords.has(word.toLowerCase()))
        .map(word => word.toLowerCase());
}

function detectAdvancedIntent(query) {
    for (const [intent, pattern] of Object.entries(advancedIntentPatterns)) {
        if (pattern.test(query)) return intent;
    }
    return 'general';
}

function assessComplexity(query) {
    const wordCount = query.split(' ').length;
    const hasMultipleClauses = query.includes(',') || query.includes('and') || query.includes('but');
    const hasSpecificTerms = /(specific|detailed|comprehensive|exactly|precisely)/i.test(query);
    
    if (wordCount > 10 || hasMultipleClauses || hasSpecificTerms) return 'high';
    if (wordCount > 5) return 'medium';
    return 'low';
}

function isGameSpecificQuery(query) {
    const gameTerms = ['game', 'play', 'player', 'level', 'character', 'download', 'install', 'category', 'genre', 'platform', 'console', 'pc', 'mobile'];
    return gameTerms.some(term => query.includes(term));
}

function findKnowledgeBaseAnswer(query) {
    const normalizedQuery = query.toLowerCase();
    
    // Search through all knowledge base categories
    for (const [category, entries] of Object.entries(knowledgeBase)) {
        for (const [key, answer] of Object.entries(entries)) {
            if (normalizedQuery.includes(key) || 
                key.split(' ').some(word => normalizedQuery.includes(word))) {
                return answer;
            }
        }
    }
    
    // Fuzzy matching for similar terms
    const fuzzyMatches = {
        'addiction': knowledgeBase.gaming['gaming addiction'],
        'competitive': knowledgeBase.gaming['esports'],
        'requirements': knowledgeBase.technical['system requirements'],
        'performance': knowledgeBase.technical['graphics settings'],
        'cost': knowledgeBase.business['pricing'],
        'return': knowledgeBase.business['refunds']
    };
    
    for (const [key, answer] of Object.entries(fuzzyMatches)) {
        if (normalizedQuery.includes(key)) {
            return answer;
        }
    }
    
    return null;
}

async function generateContextualAnswer(questionAnalysis, query) {
    const { questionType, keywords, intent, complexity } = questionAnalysis;
    
    // Handle gaming-specific questions with database queries
    if (keywords.some(word => ['game', 'games', 'gaming', 'play'].includes(word))) {
        if (questionType === 'choice' && keywords.includes('best')) {
            // "Which are the best games?" type questions
            const games = await Game.find({ isActive: true })
                .populate('category', 'categoryName')
                .sort({ createdAt: -1 })
                .limit(5);
                
            if (games.length > 0) {
                return {
                    hasAnswer: true,
                    reply: `🏆 Here are some of the best games I'd recommend:\n\n` +
                           games.map((game, index) => 
                               `${index + 1}. **${game.title}** (${game.category?.categoryName || 'Gaming'})`
                           ).join('\n') +
                           '\n\nWant to know more about any of these games?',
                    results: games.map(game => ({
                        _id: game._id,
                        title: game.title,
                        description: game.description,
                        imageUrl: game.cover_image?.url,
                        category: game.category?.categoryName,
                        type: 'game'
                    })),
                    context: 'best_games',
                    type: 'recommendation'
                };
            }
        }
        
        if (questionType === 'definition' && keywords.some(word => ['difference', 'compare'].includes(word))) {
            return {
                hasAnswer: true,
                reply: `🎯 I can help you compare games! Could you be more specific about which games or aspects you'd like me to compare? For example:\n\n• "Compare action vs puzzle games"\n• "What's the difference between free and paid games?"\n• "Compare Steam vs Epic Games Store"\n\nWhat would you like to know about?`,
                results: [],
                context: 'comparison_help',
                type: 'clarification'
            };
        }
    }
    
    return { hasAnswer: false };
}

async function generateSmartRecommendation(query, sessionId) {
    const keywords = extractKeywords(query);
    const context = sessionId ? conversationContext.get(sessionId) : null;
    
    // Analyze what type of recommendation they want
    let gameQuery = { isActive: true };
    let filterDescription = "";
    
    // Check for genre preferences
    const genreKeywords = keywords.filter(word => 
        ['action', 'adventure', 'puzzle', 'strategy', 'rpg', 'racing', 'sports', 'simulation'].includes(word)
    );
    
    if (genreKeywords.length > 0) {
        const categories = await Category.find({
            categoryName: { $regex: genreKeywords.join('|'), $options: 'i' }
        });
        
        if (categories.length > 0) {
            gameQuery.category = { $in: categories.map(cat => cat._id) };
            filterDescription = ` ${genreKeywords.join(' and ')}`;
        }
    }
    
    // Check for price preferences
    if (keywords.includes('free')) {
        gameQuery["platforms.windows.price"] = { $eq: 0 };
        filterDescription += " free";
    } else if (keywords.includes('cheap') || keywords.includes('budget')) {
        gameQuery["platforms.windows.price"] = { $lte: 15 };
        filterDescription += " budget-friendly";
    }
    
    const games = await Game.find(gameQuery)
        .populate('category', 'categoryName')
        .select('title description cover_image category platforms')
        .sort({ createdAt: -1 })
        .limit(6);
    
    if (games.length > 0) {
        const reply = `🎮 Here are my personalized${filterDescription} game recommendations for you:\n\n` +
                     games.map((game, index) => 
                         `${index + 1}. **${game.title}** (${game.category?.categoryName || 'Gaming'})` +
                         (game.platforms?.windows?.price === 0 ? ' - FREE!' : 
                          game.platforms?.windows?.price ? ` - $${game.platforms.windows.price}` : '')
                     ).join('\n') +
                     '\n\n✨ These games match your preferences! Want more specific recommendations?';
        
        return {
            reply,
            results: games.map(game => ({
                _id: game._id,
                title: game.title,
                description: game.description,
                imageUrl: game.cover_image?.url,
                category: game.category?.categoryName,
                price: game.platforms?.windows?.price || 0,
                type: 'game'
            })),
            hasMore: false,
            suggestions: [
                "🆓 Show only free games",
                "💰 Games under $20",
                "🔥 Popular games",
                "🏷️ Browse by category"
            ]
        };
    }
    
    return {
        reply: "🤔 I'd love to recommend games for you! Could you tell me more about what you're interested in? For example:\n\n• What genre do you prefer?\n• What's your budget?\n• Any specific platform?\n• Are you looking for single or multiplayer games?",
        results: [],
        hasMore: false,
        suggestions: suggestions.slice(0, 4)
    };
}

function extractPriceInfo(query) {
    const priceMatch = query.match(/\$?(\d+)/);
    const amount = priceMatch ? parseInt(priceMatch[1], 10) : null;
    
    let operator = 'under';
    if (/(over|above|more than|greater)/i.test(query)) {
        operator = 'over';
    } else if (/(under|below|less than|cheaper)/i.test(query)) {
        operator = 'under';
    }
    
    return { amount, operator };
}

function generateTopicSuggestions(query) {
    const suggestions = [
        "🎮 Recommend games for me",
        "🏷️ Show all categories", 
        "💰 Find games under $15",
        "🆓 Show free games",
        "✨ What's new and trending?",
        "🔥 Popular action games",
        "🧩 Puzzle games for relaxation"
    ];

    const keywords = extractKeywords(query);
    const topicSuggestions = new Set();

    // Add suggestions based on knowledge base categories
    for (const category of Object.keys(knowledgeBase)) {
        if (keywords.some(keyword => category.includes(keyword))) {
            Object.keys(knowledgeBase[category]).forEach(key => topicSuggestions.add(`❓ Tell me about ${key}`));
        }
    }

    // Add general suggestions if not enough specific ones
    if (topicSuggestions.size < 3) {
        suggestions.forEach(s => topicSuggestions.add(s));
    }

    return Array.from(topicSuggestions).slice(0, 6);
}

function generateDynamicSuggestions(context, query, sessionId) {
    const baseSuggestions = [
        "🎮 Recommend games for me",
        "🏷️ Show all categories",
        "💰 Find games under $20",
        "🆓 Show free games",
        "🔥 Popular games",
        "✨ New releases"
    ];

    const dynamicSet = new Set(baseSuggestions);
    const keywords = extractKeywords(query);
    const session = sessionId ? conversationContext.get(sessionId) : null;

    // Context-specific suggestions
    switch (context) {
        case 'greeting':
            dynamicSet.add("What's new and trending?");
            dynamicSet.add("Tell me about gaming benefits");
            break;
        case 'categories':
            dynamicSet.add("Show games in adventure category");
            dynamicSet.add("What are RPG games?");
            break;
        case 'price_search':
            dynamicSet.add("Show free games");
            dynamicSet.add("Games under $10");
            break;
        case 'free_games':
            dynamicSet.add("Games with high ratings");
            dynamicSet.add("Popular puzzle games");
            break;
        case 'recommendation':
            dynamicSet.add("Recommend action games");
            dynamicSet.add("Games for relaxation");
            break;
        case 'knowledge':
            dynamicSet.add(`Show games related to ${keywords[0] || 'gaming'}`);
            dynamicSet.add(`What are the types of ${keywords[0] || 'games'}?`);
            break;
    }

    // History-based suggestions (simplified for example)
    if (session && session.previousQueries.length > 1) {
        const lastQuery = session.previousQueries[session.previousQueries.length - 2];
        if (!query.includes(lastQuery.toLowerCase())) {
            dynamicSet.add(`Tell me more about "${lastQuery}"`);
        }
    }

    // Keyword-based dynamic suggestions
    if (keywords.includes('online')) {
        dynamicSet.add("Multiplayer games");
    }
    if (keywords.includes('new')) {
        dynamicSet.add("Latest game releases");
    }

}

function generateIntelligentFallback(query, sessionId) {
    const session = sessionId ? conversationContext.get(sessionId) : null;
    let reply = "";
    let canAnswer = true;
    let suggestions = [];

    if (session && session.previousQueries.length > 0) {
        // If there's a recent history, try to guide them back to relevant topics
        reply = `I'm not sure how to answer "${query}". Would you like to ask something else about games or the platform?`;
        suggestions = [
            "🎮 Recommend games for me",
            "🏷️ Show all categories",
            "❓ What is YOYO?",
            "📄 Tell me about your privacy policy"
        ];
    } else {
        // For new or very broad queries, offer general assistance
        reply = `I'm a gaming assistant, and I can help you find games, answer questions about our platform, or provide general gaming information. What can I do for you?`;
        suggestions = [
            "✨ What's new and trending?",
            "🆓 Show free games",
            "📞 Contact support",
            "❓ What is gaming?"
        ];
    }

    return {
        reply,
        canAnswer,
        suggestions
    };
}