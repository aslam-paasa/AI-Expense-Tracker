/* Prepare Tool Node: */

import { tool } from 'langchain';
import * as z from 'zod';

export const addExpense = tool(
    ({title, amount}) => {
        console.log({title, amount});
        return JSON.stringify({status: "success"});
    },
    {
        name: 'add_expense',
        description: 'Add the given expense to database',
        schema: z.object({
            title: z.string().describe('The expense title'),
            amount: z.number().describe('The amount spent')
        })
    }
)