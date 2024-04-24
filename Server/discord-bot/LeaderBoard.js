"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderBoard = void 0;
const fs = require('fs');
const path = require('path');
const DiscordBot_1 = require("./booster");
const { Loggers } = require('../logs/Logger');
const Config = require("./AppData/config.json");
//const lib = require('lib')({ token: Config['AutoCode-Token'] });


class LeaderBoard {
    static LeaderBoard;

    constructor() {
      this.leaderboard = {};
      this.loadLeaderBoard();
    }
  
    loadLeaderBoard() {
      const filePath = path.join(__dirname, 'AppData', 'LeaderBoard.json');
  
      try {
        const data = fs.readFileSync(filePath, 'utf8');
        this.leaderboard = JSON.parse(data);
        Loggers.app.info('Leaderboard loaded successfully.');
      } catch (err) {
        console.error('Error loading leaderboard:', err);
      }
    }
  
    saveLeaderBoard() {
      const filePath = path.join(__dirname, 'AppData', 'LeaderBoard.json');
      const data = JSON.stringify(this.leaderboard, null, 2);
  
      fs.writeFile(filePath, data, (err) => {
        if (err) {
          console.error('Error saving leaderboard:', err);
        } else {
          Loggers.app.info('Leaderboard saved successfully.');
        }
      });   
    }

    addPlayer(playerName, score) {
      const leaderboardArray = this.leaderboard.leaderboard;
      const lowestScore = Math.min(...leaderboardArray.map(player => player.score));
    
      if (score > lowestScore) {
        const lowestScoreIndex = leaderboardArray.findIndex(player => player.score === lowestScore);
        leaderboardArray.splice(lowestScoreIndex, 1, { name: playerName, score: score });
        this.leaderboard.leaderboard = leaderboardArray.map(player => [player.name, player]);
        this.sortPlayers();
        this.saveLeaderBoard();
      }
    }
    
    
    async publishLeaderBoard(Top1, Top2, Top3, Top4, Top5, Top6, Top7, Top8, Top9) {
      return;
        await lib.discord.channels['@0.3.1'].messages.create({
        "channel_id": `${Config.LeaderBoard_Channel}`,
        "content": "",
        "tts": false,
        "embeds": [
          {
            "type": "rich",
            "title": `Leaderboard`,
            "description": `__ZMA NA Top 10 Leaderboard__`,
            "color": 0x00FFFF,
            "fields": [
              {
                "name": `🥇 ➡️ ${Top1.Name}`,
                "value": `Score  **${Top1.Score}**`
              },
              {
                "name": `🥈 ➡️ ${Top2.Name}`,
                "value": `Score  **${Top2.Score}**`
              },
              {
                "name": `🥉 ➡️ ${Top3.Name}`,
                "value": `Score  **${Top3.Score}**`
              },
              {
                "name": `#4 🎯 ${Top4.Name}`,
                "value": `Score  **${Top4.Score}**`
              },
              {
                "name": `#5 🎯 ${Top5.Name}`,
                "value": `Score  **${Top5.Score}**`
              },
              {
                "name": `#6 🎯 ${Top6.Name}`,
                "value": `Score  **${Top6.Score}**`
              },
              {
                "name": `#7 🎯 ${Top7.Name}`,
                "value": `Score  **${Top7.Score}**`
              },
              {
                "name": `#8 🎯 ${Top8.Name}`,
                "value": `Score  **${Top8.Score}**`
              },
              {
                "name": `#9 🎯 ${Top9.Name}`,
                "value": `Score  **${Top9.Score}**`
              }
            ],
            "thumbnail": {
              "url": `https://ibb.co/VCHMS1d`,
              "height": 0,
              "width": 0
            }
          }
        ]
      });
    }
    
      
    updateLeaderBoard() {
        const leaderboardData = fs.readFileSync(path.join(__dirname, 'AppData/LeaderBoard.json'));
        this.leaderboard = JSON.parse(leaderboardData).leaderboard;
      }
      
      saveLeaderBoard() {
        const leaderboardData = {
          leaderboard: this.leaderboard.leaderboard.map(([name, player]) => ({
            name: name,
            score: player.score
          }))
        };
        fs.writeFileSync(path.join(__dirname, 'AppData/LeaderBoard.json'), JSON.stringify(leaderboardData, null, 2));
      }
          
      sortPlayers() {
      this.leaderboard.leaderboard.sort((a, b) => b[1].score - a[1].score);
      
        const topPlayers = [];
      
        for (let i = 0; i < 9; i++) {
          const playerName = this.leaderboard.leaderboard[i][1].name;
          const playerScore = this.leaderboard.leaderboard[i][1].score;
      
          const topPlayer = {
            Name: playerName,
            Score: playerScore
          };
      
          topPlayers.push(topPlayer);
        }
      
        const [Top1, Top2, Top3, Top4, Top5, Top6, Top7, Top8, Top9] = topPlayers;
        
        this.publishLeaderBoard(Top1, Top2, Top3, Top4, Top5, Top6, Top7, Top8, Top9);
    }
      
      
    getTopPlayers(numPlayers) {
        return this.leaderboard.slice(0, numPlayers);
      }
      
    getPlayerRank(playerName) {
        const playerIndex = this.leaderboard.findIndex(player => player.name === playerName);
        return playerIndex !== -1 ? playerIndex + 1 : null;
      }
            
  }

  exports.LeaderBoard = LeaderBoard