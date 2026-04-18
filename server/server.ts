import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.json({ message: 'OK' })
})


const PORT = process.env.PORT ||4100;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})