import mongoose from "mongoose";

const trailerSchema = mongoose.Schema({
    title :{
        type: String,
        require:true,
    },
    description:{
        type: String,
        require:true,
    },
    link:{
        type: String,
        require:true,
    },
    trailer:{
        type: String,
        require:true,
    }
})

export default mongoose.model("hometrailer", trailerSchema);