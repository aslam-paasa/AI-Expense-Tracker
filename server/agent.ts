import { ChatOpenAI } from '@langchain/openai';
import { MessagesAnnotation } from '@langchain/langgraph';

/* 1. Prepare the LLM Model */
const llm = new ChatOpenAI({
    model: 'gpt-5.1-mini',
    temperature: 0,
});


/* 2. Prepare Tool Node */


/* 2. Prepare Call Model Node */
async function callModel(state: typeof MessagesAnnotation) {
    return state;
}


/* 3.  */