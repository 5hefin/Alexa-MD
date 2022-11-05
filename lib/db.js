const yargs = require("yargs/yargs");

var low;

try {
  low = require("lowdb")
} catch (e) {
  low = require("./lowdb")
}

const { Low, JSONFile } = low
const mongoDB = require("./mongoDB")

const opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
const db = new Low(
  /https?:\/\//.test(opts['db'] || '') ?
    new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
      new mongoDB(opts['db']) :
      new JSONFile(`database/json/database.json`)
)

global.db.data = {
    users: {},
    chats: {},
    database: {},
    game: {},
    settings: {},
    others: {},
    sticker: {},
    ...(global.db.data || {})
}

module.exports = { db }
