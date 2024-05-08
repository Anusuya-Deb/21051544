const http = require('http');
const PORT = process.env.PORT || 9876;
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
}
const server = http.createServer(async (req, res) => {
    if(req.method === 'GET' && req.url.startsWith('/numbers/')) {
        const numberid = req.url.split('/')[2];
        
        try {
            const data = [2,4,6,8];
            numbers = [...new Set([...numbers, ...data])].slice(-windowSize);
            const average = calculateAverage(numbers);
            const responseObj = {
                windowPrevState: numbers.slice(0, -data.length),
                windowCurrState: numbers,
                numbers: data,
                avg: average.toFixed(2)
            };
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(responseObj));
            } catch (error) {
                console.error('Error:', error);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal Server Error');
            }
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }

    });
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });