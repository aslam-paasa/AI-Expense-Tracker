import { ChatOpenAI } from '@langchain/openai';
import { MessagesAnnotation } from '@langchain/langgraph';
import { initDB } from './db.ts';
import { initTools } from './tools.ts';
import { ToolNode } from '@langchain/langgraph/prebuilt';


/* 2. Init Database (dbPath) + Set DB Access to Tools*/
const database = initDB("./expenses.db");
const tools = initTools(database);

/* 1. Initialize the LLM Model */
const llm = new ChatOpenAI({
    model: 'gpt-4.1-mini',
    temperature: 0,
});

/**
 * 3. Prepare Tool Node
*/
const toolNode = new ToolNode(tools);

/* 4. Prepare Call Model Node + Add Mmmory + Bind Tools*/
async function callModel(state: typeof MessagesAnnotation.State) {
    const llmWithTools = llm.bindTools(tools);
    const response = await llmWithTools.invoke([
        {
            role: 'system',
            content: `You are a helpful tracking assistant. Current datetime: ${new Date().toISOString()}.
                      Call add_expense tool to add the expense to database.
                    `
        },
        ...state.messages
    ])

    return { messages: [response] };
}
