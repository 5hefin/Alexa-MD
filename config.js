const toBool = (x) => x == 'true'
const { Sequelize } = require('sequelize')
const { existsSync } = require('fs')
if (existsSync('config.env')) require('dotenv').config({ path: './config.env' })
const DATABASE_URL = process.env.DATABASE_URL === undefined ? './database.db' : process.env.DATABASE_URL
module.exports = {
    VERSION: 'v1.0.0',
    SESSION_ID: (process.env.SESSION_ID || '').trim(),
    MODE: process.env.MODE || 'private',
    DATABASE: DATABASE_URL === './database.db' ? new Sequelize({ dialect: 'sqlite', storage: DATABASE_URL, logging: false }) : new Sequelize(DATABASE_URL, {dialect: 'postgres', ssl: true, protocol: 'postgres', dialectOptions: { native: true, ssl: { require: true, rejectUnauthorized: false },}, logging: false }),
    HANDLERS: process.env.PREFIX || '^[.,!]',
    SUDO: process.env.SUDO || '',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    BOT_INFO: process.env.BOT_INFO || '𝛥𝐿𝛯𝛸𝛥,𝑆𝛨𝛯𝐹𝛪𝛮,919567489404,https://i.imgur.com/daBdQPW.jpeg',
    STICKER_PACKNAME: process.env.STICKER_PACKNAME || 'Alexa,Shefin',
    READ_MSG: process.env.READ_MSG || 'true', 
    LOG_MSG: toBool(process.env.LOG_MSG) || false,
    LANG: (process.env.LANGUAGE || 'english').toLowerCase(),
    WARN_LIMIT: process.env.WARN_LIMIT || '3',
    DIS_BOT: process.env.DISABLE_BOT || 'null',
};
