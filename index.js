const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const app = express();
dotenv.config();

let steam_url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=505E4231D4B9D45258C5C017929E0007&steamid="
let end_url = "&include_appinfo=true&include_played_free_games=true";


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/steam/:id', (req, res) => {
    console.log(req.originalUrl);
    console.log(req.params.id)

    axios.get(steam_url + req.params.id + end_url)
        .then((steamRes) => {
            res.send(steamRes.data);
        })
        .catch((err) => {
            console.error(err)
            res.send(err.status)
        });
});

app.listen(3000, () => console.log(`Example app listening at http://localhost:3000`));


