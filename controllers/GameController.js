const axios = require('axios')

module.exports = class GameController {

  getUserGameList (req, res) {
    axios.get(`${process.env.STEAM_API_URL}IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${req.params.id}&include_appinfo=true&include_played_free_games=true`)
      .then((steamRes) => {
        res.send(steamRes.data)
      })
      .catch((err) => {
        console.error(err)
        res.send(err.status)
      })
  }

  async getCommonGamesList (req, res, ids) {
    let idsArray = [];
    let playersGamesList = [];
    let commonGamesList = [];
    idsArray = ids.split(',');
    let playerData = [];

    for (let i = 0; i < idsArray.length; i++) {
      await axios.get(`${process.env.STEAM_API_URL}IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${idsArray[i]}&include_appinfo=true&include_played_free_games=true`)
        .then((res) => {
          playersGamesList.push(res.data.response.games);
        })
        .catch((err) => {
          //TODO - Throw exception here and send back status code
          console.error(err);
          return err;
        })

    }
    commonGamesList = this.stupidBruteForce(playersGamesList);
    console.log('LENGTH ', commonGamesList.length);
    return res.send(commonGamesList);
  }

  // Slow stupid approach
  stupidBruteForce (array) {
    let totalLength = array.length
    if (totalLength < 2)
      return
    let common = []
    array[0].forEach((game) => {
      for (let i = 1; i < totalLength; i++) {
        for (let j = 0; j < array[i].length; j++) {
          if (game.appid === array[i][j].appid && !common.includes(game)) {
            common.push(game)
          }
        }
      }
    })
    return common
  }
}