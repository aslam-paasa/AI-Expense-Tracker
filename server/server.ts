import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.json({ message: 'OK' })
})

/* SSE: Server Sent Event Protocol */
app.get('/chat', (req, res) => {

    /* 1. add special header */
    res.writeHead(200, {
        'Content-Type': 'text/event-stream'
    });

    /* 2. Send data in special format */
    setInterval(() => {
        res.write("event: cgPing/n")    // q. Event Key
        res.write('data: Happy Coding') // b. Sending data 
        res.write("/n/n")               // c. 2 New Line
    }, 1000);

    res.json({});
})


const PORT = process.env.PORT ||4100;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})