const client = require("./lib/")
const connect = async () => {
   try {
        await client.connect()
    } catch (error) {
        console.error(error)
    }
}
connect()
