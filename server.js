const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();
const app = express();
const port = process.env.PORT || 4400;

let cache = {};

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log("Listening on port " + port);
})

app.get("/", async(req, res) => {
    if (cache.length > 0) {
        return res.send(cache);
    }
    else{
        try {
            //https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest
            const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=500`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CMC_PRO_API_KEY': process.env.API_KEY
                }
            }
            const response = await fetch(url, options);
            const data = await response.json();
            const subset = data.data.map(({ id, name, quote, max_supply, circulating_supply}) => ({ 
                id: id, 
                name: name,
                value: quote.USD.price,
                maxSupply: max_supply,
                circulation: circulating_supply,
                marketCap: quote.USD.market_cap,
                percentChange: quote.USD.percent_change_24h
            }));
            res.send(subset);
            cache = subset;
            console.log(subset);
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
        }
    }
    
})
