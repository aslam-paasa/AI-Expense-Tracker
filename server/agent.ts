import { ChatOpenAI } from '@langchain/openai';
import { MemorySaver, MessagesAnnotation, StateGraph } from '@langchain/langgraph';
import { initDB } from './db.ts';
import { initTools } from './tools.ts';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AIMessage } from 'langchain';


/* 2. Init Database (dbPath) */
const database = initDB("./expenses.db");
const tools = initTools(database);

/* 1. Initialize the LLM Model */
const llm = new ChatOpenAI({
    model: 'gpt-4.1-mini',
    temperature: 0,
});

/**
 * 3. Prepare Tool Node + Set DB Access to Tools
*/
const toolNode = new ToolNode(tools);

/* 4. Prepare Call Model Node + Store Messages + Bind Tools*/
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

/**
 * Conditional Edge
*/
function shouldContinue(state: typeof MessagesAnnotation.State) {
    const messages = state.messages;
    const lastMessage = messages.at(-1) as AIMessage;

    if(lastMessage.tool_calls?.length) {
        return 'tools';
    }
    return '__end__';
}


/**
 * 5. Compile Graph + Add Memory
*/
const graph = new StateGraph(MessagesAnnotation)
    .addNode('callModel', callModel)
    .addNode('tools', toolNode)
    .addEdge('__start__', 'callModel')
    .addConditionalEdges('callModel', shouldContinue, {
        '__end__':'__end__', 
        'tools':'tools'
    })

const agent = graph.compile({ checkpointer: new MemorySaver() });


/* 6. Invoke AI Agent: node --env-file=.env agent.ts */
async function main() {
    const response = await agent.invoke({
        messages: [
            {
                role: 'user',
                content: 'I just bought a laptop for 80,000 inr'
            }
        ]
    }, { configurable: { thread_id: '1'} })

    console.log(JSON.stringify(response, null, 2));
}

main()