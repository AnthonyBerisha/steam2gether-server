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
    commonGamesList = this.smartIntersect(playersGamesList);
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

  getShortestArray(array) {
    let arraysData = [];
    for (let i = 0; i < array.length; i++) {
      arraysData.push({index: i, length: array[i].length})
    }

    return arraysData.reduce((previous, current) => {
      return previous.length < current.length ? previous : current;
    })
  }

  copyArray(oldArray) {
    console.log(oldArray)
    let copy = [];
    for (let i = 0; i < oldArray.length; i++) {
      copy.push(oldArray[i])
    }
    return copy;
  }

  smartIntersect(array) {
    let shortestArrayData = this.getShortestArray(array);
    let shortestArray = this.copyArray(array[shortestArrayData.index])
    let copy = this.copyArray(array[shortestArrayData.index])

    for (let i = 0; i < shortestArray.length; i++) {
      for (let j = 0; j < array.length; j++) {
        for (let k = 0; k < array[j].length; k++) {
          console.log(shortestArray[i].appid, j, k, array[j].length)
          if (shortestArray[i].appid === array[j][k].appid) {
            break;
          } if (k === array[j].length - 1) {
            copy[i] = null
          }
        }
      }
    }
    return copy.filter((el) => el != null);
  }

}