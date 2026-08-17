import dotenv from "dotenv"
import { ChatGroq } from "@langchain/groq"

dotenv.config();

const llm = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0.2,
    maxTokens: 2500,
    maxRetries: 2,
});


export default llm;