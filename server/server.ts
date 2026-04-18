import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.json({ message: 'OK' })
})

/* SSE: Server Sent Event Protocol */
app.post('/chat', (req, res) => {
    const body = req.body;
    console.log('query', body);

    /* 1. add special header */
    res.writeHead(200, {
        'Content-Type': 'text/event-stream'
    });

    /* 2. Send data in special format */
    setInterval(() => {
        res.write("event: cgPing\n")        // a. Event Key
        res.write(`data:${body?.query}\n\n`) // b. Sending data 
    }, 1000);
})


const PORT = process.env.PORT ||4100;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})