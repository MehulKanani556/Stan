import mongoose from "mongoose";


export const chatWidGetController = (req, res) => {
    const { q = "", page = 1, limit = 6 } = req.query;

    // Welcome message
    if (!q) {
        return res.json({
            reply:
                "Hi! I can help with everything on this site: find games, list categories, prices/platforms, latest games, and answer questions about wishlist, cart, payments, privacy and terms.",
            suggestions,
            results: [],
        });
    }

    // Search in mock data
    const filtered = games.filter((g) =>
        g.title.toLowerCase().includes(q.toLowerCase())
    );

    // Pagination
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + Number(limit));

    return res.json({
        q,
        page: Number(page),
        hasMore: start + Number(limit) < filtered.length,
        reply:
            filtered.length > 0
                ? `Found ${filtered.length} result(s) for "${q}"`
                : `Sorry, no results found for "${q}"`,
        results: paginated,
        suggestions,
    });
};