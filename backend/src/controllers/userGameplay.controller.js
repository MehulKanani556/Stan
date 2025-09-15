import UserGamePlay from "../models/UserGamePlay.model.js";
import { ThrowError } from '../utils/ErrorUtils.js';


export const getUserGamePlayTime = async(req, res) => {
    try {
        const {_id } = req.user;
        const userGamePlay = await UserGamePlay.findOne({ user: _id }).populate('user', 'name email profilePic');
        console.log("User Game Play Data:", userGamePlay);

        if (!userGamePlay) {
            return res.status(404).json({ message: "No gameplay data found for user." });
        }

        return res.status(200).json( userGamePlay);
        

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }

}