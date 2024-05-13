const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();
const app = express();
const port = process.env.PORT || 4400;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log("Listening on port " + port);
})

app.get("/", async(req, res) => {
    try {
        //https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest
        const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map`
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'X-CMC_PRO_API_KEY': process.env.API_KEY
            }
        }
        const response = await fetch(url, options);
        const data = await response.json();
        res.send(data.data);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
})
