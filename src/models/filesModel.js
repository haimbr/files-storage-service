const mongoose = require("mongoose");

const filesSchema = new mongoose.Schema(
    {
        originalName: {
            type: String,
        },
        storageName: {
            type: String,
        },
        bucket: {
            type: String,
        },
        region: {
            type: String,
        },
        key: {
            type: String,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const File = mongoose.model("File", filesSchema);

module.exports = File;
