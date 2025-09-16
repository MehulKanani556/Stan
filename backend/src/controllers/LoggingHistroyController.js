import LoggingHistory from '../models/LoggingHistoryModal.js';

export const loggingHistory = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming user is authenticated
        const today = new Date();
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // strip time

        let log = await LoggingHistory.findOne({ user: userId });

        if (!log) {
            log = new LoggingHistory({
                user: userId,
                lastLoggingDate: todayDate,
                weeklyLogging: 1
            });
        } else {
            const lastDate = log.lastLoggingDate ? new Date(log.lastLoggingDate) : null;

            if (!lastDate || lastDate.getTime() !== todayDate.getTime()) {

                const getWeekStart = (date) => {
                    const day = date.getDay();
                    const diff = day === 0 ? -6 : 1 - day;
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() + diff);
                    weekStart.setHours(0, 0, 0, 0);
                    return weekStart;
                };

                const lastWeekStart = lastDate ? getWeekStart(lastDate) : null;
                const currentWeekStart = getWeekStart(todayDate);

                if (!lastWeekStart || lastWeekStart.getTime() !== currentWeekStart.getTime()) {
                    log.weeklyLogging = 1;
                } else {
                    log.weeklyLogging += 1;
                }

                log.lastLoggingDate = todayDate;
            }
        }

        await log.save();
        res.status(200).json({ message: "Logging history updated", data: log });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUserLogging = async (req, res) => {
    try {
        const userId = req.user._id ;
        const LoggingData = await LoggingHistory.findOne({ user: userId });
        res.status(200).json({ message: "Logging history updated", data: LoggingData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}