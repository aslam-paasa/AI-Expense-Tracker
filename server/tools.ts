import { DatabaseSync } from 'node:sqlite';
import { tool } from 'langchain';
import * as z from 'zod';

/* Setup Database Access + Prepare Tools */ 
export function initTools(database: DatabaseSync) {
    
    /* Tool Node-1: Add Expense to DB */ 
    const addExpense = tool(
        ({title, amount}) => {
            
            /* todo: do proper args validation */
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

    /* Tool Node-2: Get Expenses from DB */ 
    const getExpenses = tool(
        ({from, to}) => {
            
            /* todo: do proper args validation */
            const stmt = database.prepare(`SELECT * FROM expenses WHERE date BETWEEN ? AND ?`)
            const rows = stmt.all(from, to);
            console.log(rows);

            return JSON.stringify(rows);
        },
        {
            name: 'get_expenses',
            description: 'Get the expenses from database for given date range',
            schema: z.object({
                from: z.string().describe('Start date in YYYY-MM-DD format'),
                to: z.string().describe('End date in YYYY-MM-DD format')
            })
        }
    )


    /* return tools */ 
    return [addExpense, getExpenses]
}


