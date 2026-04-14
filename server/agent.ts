import { ChatOpenAI } from '@langchain/openai';


/* 1. Prepare the LLM Model */
const llm = new ChatOpenAI({
    model: 'gpt-5.1-mini',
    temperature: 0,
})