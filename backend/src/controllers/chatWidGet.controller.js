import mongoose from "mongoose";
import Game from "../models/Games.model.js";
import Category from "../models/Category.model.js";
import FreeGameStan from "../models/freeGamesModel.js";

const suggestions = [
    "Recommend some games",
    "List categories",
    "List all games",
    "Games under $20",
    "Show latest games",
    "Privacy policy",
    "Terms & conditions",
    "Contact support",
];

export const chatWidGetController = async (req, res) => {
    const { q = "", page = 1, limit = 6 } = req.query;

    // Default welcome
    if (!q) {
        return res.json({
            reply:
                "Hi! 👋 I can help with everything on this site: find games, list categories, list all games, show cheap games, latest games, and answer privacy, terms, or support questions.",
            suggestions,
            results: [],
        });
    }

    let reply = "";
    let results = [];
    let hasMore = false;

    // Normalize query
    const query = q.toLowerCase();

    // 🔹 List Categories
    if (query.includes("list categories")) {
        const categories = await Category.find(
            {},
            "categoryName category_description"
        );
        if (categories.length > 0) {
            reply =
                "Here are the categories:\n" +
                categories
                    .map((cat) => `- ${cat.categoryName}: ${cat.category_description}`)
                    .join("\n");
            results = categories.map((cat) => ({
                title: cat.categoryName,
                description: cat.category_description,
                _id:cat._id
            }));
        } else {
            reply = "No categories found.";
        }
    }



    // 🔹 Games under $20
    else if (query.includes("under")) {
        // Extract number from query
        const match = query.match(/under\s*(\d+)/);
        const priceLimit = match ? parseInt(match[1], 10) : 20;

        // 🔹 Fetch only active games where windows is available
        const allGames = await Game.find({
            isActive: true,
            "platforms.windows.available": true
        }).populate("category", "categoryName");

        // 🔹 Filter by Windows price
        const filteredGames = allGames
            .filter((game) => game.platforms?.windows?.price && game.platforms.windows.price <= priceLimit)
            .map((game) => ({
                _id: game._id,
                title: game.title,
                description: game.description,
                imageUrl: game.cover_image?.url,
                category: game.category?.categoryName,
                price: game.platforms.windows.price,
            }));

        if (filteredGames.length > 0) {
            reply =
                `Here are ${filteredGames.length} Windows game(s) under $${priceLimit}:\n` +
                filteredGames
                    .map(
                        (game) =>
                            `- ${game.title} ($${game.price}) ${game.category || ""}`
                    )
                    .join("\n");

            results = filteredGames;
        } else {
            reply = `No Windows games found under $${priceLimit}.`;
        }

        hasMore = page * limit < filteredGames.length;
    }




    else if (query.includes("paid") || query.includes("paid games")) {
        // All Windows paid games (price > 0)
        const paidGames = await Game.find({
            isActive: true,
            "platforms.windows.available": true,
            "platforms.windows.price": { $gt: 0 }
        }).populate("category", "categoryName");

        console.log("aa");

        if (paidGames.length > 0) {
            reply = `Here are ${paidGames.length} paid Windows game(s):\n`;
            paidGames.forEach((game) => {
                reply += `Title: ${game.title}\n`;
                reply += `Description: ${game.description}\n`;
                if (game.cover_image && game.cover_image.url) {
                    reply += `Cover Image: ${game.cover_image.url}\n`;
                }
                reply += `--------------------\n`;
            });
            results = paidGames.map((game) => ({
                _id: game._id,
                title: game.title,
                description: game.description,
                imageUrl: game.cover_image?.url,
                category: game.category?.categoryName,
                price: game.platforms.windows.price,
            }));
        } else {
            reply = "No paid Windows games found.";
        }

    }
    // 🔹 Find Games by Keyword
    else if (query.includes("find games") ) {
        const searchKeyword = query.replace(/find games|game|games/g, "").trim();

        // Free games
        if (searchKeyword.includes("free")) {
            const freeGameQuery = {};
            if (searchKeyword.replace("free", "").trim()) {
                freeGameQuery.name = {
                    $regex: searchKeyword.replace("free", "").trim(),
                    $options: "i",
                };
            }
            const totalFreeGames = await FreeGameStan.countDocuments(freeGameQuery);
            const freeGames = await FreeGameStan.find(
                freeGameQuery,
                "name image iframeSrc"
            )
                .skip((page - 1) * limit)
                .limit(limit);

            if (freeGames.length > 0) {
                reply =
                    `Found ${totalFreeGames} free game(s):\n` +
                    freeGames.map((game) => `- ${game.name}`).join("\n");
                results = freeGames.map((game) => ({
                    title: game.name,
                    description: "Play now!",
                    imageUrl: game.image,
                    link: game.iframeSrc,
                    _id:game._id
                }));
            } else {
                reply = `No free games found for "${searchKeyword}".`;
            }
            hasMore = page * limit < totalFreeGames;
        }
        // Paid / regular games
        else {
            const gameQuery = { isActive: true };
            if (searchKeyword) {
                gameQuery.title = { $regex: searchKeyword, $options: "i" };
            }

            const totalGames = await Game.countDocuments(gameQuery);
            const games = await Game.find(
                gameQuery,
                "title description cover_image.url platforms category"
            )
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("category", "categoryName");

            if (games.length > 0) {
                reply =
                    `Found ${totalGames} game(s):\n` +
                    games
                        .map(
                            (game) => `- ${game.title} (${game.category?.categoryName || ""})`
                        )
                        .join("\n");
                results = games.map((game) => ({
                    title: game.title,
                    description: game.description,
                    imageUrl: game.cover_image.url,
                    platforms: game.platforms,
                    _id:game._id
                }));
            } else {
                reply = `No games found for "${searchKeyword}".`;
            }
            hasMore = page * limit < totalGames;
        }
    }
    // 🔹 All Games / List Games
    else if (query.includes("all games") || query.includes("list games")) {
        const totalGames = await Game.countDocuments({ isActive: true });
        const games = await Game.find(
            { isActive: true },
            "title description cover_image.url platforms category"
        )
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("category", "categoryName");

        if (games.length > 0) {
            reply =
                `Here are some of the ${totalGames} games available:\n` +
                games
                    .map((game) => `- ${game.title} (${game.category?.categoryName || ""})`)
                    .join("\n");
            results = games.map((game) => ({
                title: game.title,
                description: game.description,
                imageUrl: game.cover_image.url,
                platforms: game.platforms,
                _id:game._id

            }));
        } else {
            reply = "No games available.";
        }
        hasMore = page * limit < totalGames;
    }
    else if (query.includes("free")) {
        // All Windows free games (price == 0)
        const freeGames = await Game.find({
            isActive: true,
            "platforms.windows.available": true,
            "platforms.windows.price": { $eq: 0 }
        }).populate("category", "categoryName");

        if (freeGames.length > 0) {
            reply =
                `Here are ${freeGames.length} free Windows game(s):\n` +
                freeGames
                    .map(
                        (game) =>
                            `- ${game.title} (Free) ${game.category?.categoryName || ""}`
                    )
                    .join("\n");
            results = freeGames;
        } else {
            reply = "No free Windows games found.";
        }
    }
    // 🔹 Latest Games
    else if (query.includes("latest games")) {
        const totalGames = await Game.countDocuments({ isActive: true });
        const games = await Game.find(
            { isActive: true },
            "title description cover_image.url platforms category"
        )
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("category", "categoryName");

        if (games.length > 0) {
            reply =
                "Here are the latest games:\n" +
                games
                    .map((game) => `- ${game.title} (${game.category?.categoryName || ""})`)
                    .join("\n");
            results = games.map((game) => ({
                title: game.title,
                description: game.description,
                imageUrl: game.cover_image.url,
                platforms: game.platforms,
                _id:game._id

            }));
        } else {
            reply = "No latest games found.";
        }
        hasMore = page * limit < totalGames;
    }
    // 🔹 Privacy Policy
    else if (query.includes("privacy policy")) {
        reply =
            "Our Privacy Policy is available at: https://yourwebsite.com/privacy-policy";
    }
    // 🔹 Terms & Conditions
    else if (query.includes("terms")) {
        reply =
            "Our Terms & Conditions can be found at: https://yourwebsite.com/terms";
    }
    // 🔹 Contact Support
    else if (query.includes("contact support")) {
        reply =
            "You can reach support at support@yourwebsite.com or call +1-800-123-4567.";
    }
    // 🔹 Fallback
    else {
        reply = `Sorry, I don't understand "${q}". Try one of the suggestions.`;
    }

    return res.json({
        q,
        page: Number(page),
        hasMore,
        reply,
        results,
        // suggestions,
    });
};
