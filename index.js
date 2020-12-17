const express = require('express')
const dotenv = require('dotenv')
const axios = require('axios')
const app = express()
dotenv.config()

function getEachFriendData (friendsList) {
  let ids = ''
  friendsList.forEach((friendObject) => {
    ids += friendObject.steamid + ','
  })

  let url = `${process.env.STEAM_API_URL}ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${ids}`
  console.log(url)
  axios.get(url)
    .then((res) => {
      return res.data.response.players;
    })
    .catch((err) => {
      console.log(err)
    })
}

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/user/:id', ((req, res) => {
  axios.get(`${process.env.STEAM_API_URL}ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${req.params.id}`)
    .then((steamRes) => {
      res.send(steamRes.data)
    })
    .catch((err) => {
      console.error(err)
      res.send(err.status)
    })
}))

app.get('/user/:id/friends', ((req, res) => {
  axios.get(`${process.env.STEAM_API_URL}ISteamUser/GetFriendList/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${req.params.id}&relationship=friend`)
    .then((steamRes) => {
      console.log(steamRes)
      res.send(getEachFriendData(steamRes.data.friendslist.friends))
      // res.send(steamRes.data)

    })
    .catch((err) => {
      console.error(err)
      res.send(err.status)
    })
}))

app.get('/games/:id', (req, res) => {
  axios.get(`${process.env.STEAM_API_URL}IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${req.params.id}&include_appinfo=true&include_played_free_games=true`)
    .then((steamRes) => {
      res.send(steamRes.data)
    })
    .catch((err) => {
      console.error(err)
      res.send(err.status)
    })
})

const port = process.env.PORT || 4000

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


