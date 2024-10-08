const express = require('express');
const app = express();
const db = require('./persistence');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');
const axios = require('axios');  // Add axios for making HTTP requests
const SECOND_SERVICE_URL = 'http://second-entrypoint.default.svc.cluster.local:4000';

app.use(express.json());
app.use(express.static(__dirname + '/static'));

app.get('/items', getItems);
app.post('/items', async (req, res) => {
    // Call the original addItem function
    await addItem(req, res);
    
    // Synchronize with the second-entrypoint service
    try {
        await axios.post(`${SECOND_SERVICE_URL}/items`, req.body);
        console.log('Item successfully synchronized with second-entrypoint');
    } catch (error) {
        console.error('Error synchronizing with second-entrypoint:', error.message);
    }
});
app.put('/items/:id', updateItem);
app.delete('/items/:id', deleteItem);

db.init().then(() => {
    app.listen(3000, () => console.log('Listening on port 3000'));
}).catch((err) => {
    console.error(err);
    process.exit(1);
});

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
