const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();
const app = express();
const port = process.env.PORT || 4400;

let loadCache = {};

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log("Listening on port " + port);
})

app.get("/load", async(req, res) => {
    if (loadCache.length > 0) {
        return res.send(loadCache);
    }
    else{
        try {
            //https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest
            const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=50`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CMC_PRO_API_KEY': process.env.API_KEY
                }
            }
            const response = await fetch(url, options);
            const data = await response.json();
            const subset = data.data.map(({ id, name, symbol, quote, max_supply, circulating_supply}) => ({ 
                id: id, 
                name: name,
                symbol: symbol,
                value: quote.USD.price,
                maxSupply: max_supply,
                circulation: circulating_supply,
                percentChange: quote.USD.percent_change_24h
            }));
            res.send(subset);
            loadCache = subset;
            console.log(subset);
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
        }
    }
    
})

app.get("/cache", async(req, res) => {
    res.send(loadCache);
})

app.get("/refresh", async(req, res) => {

    try {
        //https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest
        const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=50`;
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'X-CMC_PRO_API_KEY': process.env.API_KEY
            }
        }
        const response = await fetch(url, options);
        const data = await response.json();
        const subset = data.data.map(({ id, name, symbol, quote, max_supply, circulating_supply}) => ({ 
            id: id, 
            name: name,
            symbol: symbol,
            value: quote.USD.price,
            maxSupply: max_supply,
            circulation: circulating_supply,
            percentChange: quote.USD.percent_change_24h
        }));
        res.send(subset);
        loadCache = subset;
        console.log(subset);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
})

app.get("/find", async(req, res) => {
    const id = req.query.id;
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${id}`;
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'X-CMC_PRO_API_KEY': process.env.API_KEY
        }
    }
    const response = await fetch(url, options);
    const data = await response.json();
    const subset = data.data[id].quote.USD;
    res.send(subset);
})
