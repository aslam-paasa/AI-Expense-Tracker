import { ChatOpenAI } from '@langchain/openai';
import { MessagesAnnotation } from '@langchain/langgraph';
import { initDB } from './db.ts';


/* 2. Init Database (dbPath) */
const database = initDB("./expenses.db");


/* 1. Initialize the LLM Model */
const llm = new ChatOpenAI({
    model: 'gpt-5.1-mini',
    temperature: 0,
});


/* 3. Prepare Tool Node */


/* 4. Prepare Call Model Node */
async function callModel(state: typeof MessagesAnnotation) {
    return state;
}


/* 3.  */