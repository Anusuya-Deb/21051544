const express = require ('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 9876
let numbers = [];
const windowSize = 10;

function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    });
}
function calculateAverage(arr) {
    const sum = arr.reduce((acc, num) => acc + num, 0);
    return sum / Math.min(arr.length, windowSize);
} app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    try {
        let apiUrl = '';
        switch (numberid) {
            case 'p':
                apiUrl = 'http://20.244.56.144/test/primes';
                break;
                case 'f':
                apiUrl = 'http://20.244.56.144/test/fibonacci';
                break;
                case 'g':
                apiUrl = 'http://20.244.56.144/test/even';
                break;
                case 'h':
                apiUrl = 'http://20.244.56.144/test/random';
                break;
                default:
                    res.status(400).send('invalid numberid');
                    return;
        }
        const response = await fetch(apiUrl);
        const data = await response.json();
        numbers = [...new Set([...numbers, ...data.numbers])].slice(-windowSize);
        const average= calculateAverage(numbers);
        const responseObj = {
            windowPrevState: numbers.slice(0, -data.length),
            windowCurrState: numbers,
            numbers: data,
            avg: average.toFixed(2)
    };
    res.json(responseObj);
} catch(error) {
    console.error('Error:', error);
    res.status(500).send('internal server error');
}
});
app.listen(PORT,()=> {
    console.log(`Server is running on port ${PORT}`);
    });
