//pdf -> pdf stoarage -> extract text -> llm -> agent -> prompt -> data ->
// -> save mongodb -> redis(caching)-> pdf delete ->resume data(score, missing skills, recomendations,.. etc)

import redis from "../../../shared/redis/redis.js";
import { resumeAgent } from "../agents/resume.agent.js";
import extractText from "../config/pdf.js";
import Resume from "../model/resume.model.js";
import fs from "fs/promises";

export const uploadResume = async (req, res) => {
    const file = req.file;
    try {

        if (!file) {
            return res.status(400).json({
                success: true,
                message: "Resume PDF is required.",
            });
        }

        const userId = req.headers["x-user-id"];

        if (!userId) {
            return res.status(400).json({
                success: true,
                message: "UserId PDF is required.",
            });
        }

        // extract text
        const resumeText = await extractText(file.path);

        // AI Resume Analysis
        const aiResponse = await resumeAgent(resumeText);

        const resumeData = JSON.parse(aiResponse);

        // MongoDB
        let resume = await Resume.findOne({ userId });

        if (resume) {
            Object.assign(resume, {
                ...resumeData,
                extractedText: resumeText,
            });
            await resume.save();
        } else {
            resume = await Resume.create({
                userId,
                extractedText: resumeText,
                ...resumeData,
            });
        }

        // redis
        await redis.set(`resume:${userId}`, JSON.stringify(resume));

        //delete pdf from server
        await fs.unlink(file.path);

        return res.status(200).json({
            success: true,
            message: "Resume analysed successfully",
            data: resume,
        });
    } catch (error) {
        console.log(error);

        if (file) {
            try {
                await fs.unlink(file.path);
            } catch (cleanupError) {
                console.log("Failed to delete uploaded file:", cleanupError.message);
            }
        }
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getResume = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];

        const cache = await redis.get(`resume:${userId}`);

        if (cache) {
            return res.status(200).json({
                success: true,
                source: "redis",
                data: JSON.parse(cache),
            });
        }

        const resume = await Resume.findOne({
            userId
        })

        if(!resume){
            return res.status(404).json({
                success:false,
                message: "Resume not found."
            })
        }
        
        await redis.set(`resume:${userId}`,JSON.stringify(resume));

        return res.status(200).json({
            success: true,
            source: "database",
            data: resume,
        });


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message: "Resume not found."
        })
    }
};
