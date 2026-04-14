import { DatabaseSync } from 'node:sqlite';
import { tool } from 'langchain';
import * as z from 'zod';

/* Setup Database Access + Prepare Tools */ 
export function initTools(database: DatabaseSync) {
    
    /* Tool Node-1: Add Expense to DB */ 
    const addExpense = tool(
        ({title, amount}) => {
            console.log({title, amount});
            
            const date = new Date().toISOString().split('T')[0];
            const stmt = database.prepare(`INSERT INTO expenses (title, amount, date) VALUES(?, ?, ?)`);
            stmt.run(title, amount, date);

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

    /* return tools */ 
    return [addExpense]
}


