import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
    },
    teamMember: {
        type: [String], 
        required: true,
    },
    photo: {
        type: [String], 
        required: true,
    },
    demoVideo: {
        type: String,
        required: false, 
        default: null, 
    },
    projectName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    github_link: {
        type: String,
        required: false, 
        default: null, 
    },
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
