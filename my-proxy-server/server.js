const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.all('/api/*', async (req, res) => {
    try {
        const url = 'https://trade-api.finam.ru/public/api/v1/' + req.originalUrl.replace('/api/', '');
        const response = await axios({
            method: req.method,
            url: url,
            data: req.body,
            headers: {
                'X-Api-Key': 'CAEQ89V9GhglCp54quoN/yrvUavDnPYIRRFuLYuH1zc=',
                // ...req.headers,
                'Host': 'trade-api.finam.ru'
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
        console.error('Ошибка запроса:', error);
    }
});

app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});

