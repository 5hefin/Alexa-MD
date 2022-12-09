const { bot, updateCheck } = require("../lib/");

bot(
  {
    pattern: "update ?(.*)",
    fromMe: true,
    desc: "Check or start bot updates.",
    type: "koyeb",
  },
  async (message, match) => {
    if (!match || match === "check") {
      return await updateCheck(message);
    } else if (match === "now" || match === "start") {
      require("child_process").exec("git pull")
      let data = await redeploy();
      await message.reply(data)
    }
  }
);

async function redeploy() {
  let koyeb_api = process.env.KOYEB_API || "No-api"
  let axiosConfig = {
    headers: {
       "Content-Type": "application/json;charset=UTF-8",
       "Authorization": `Bearer ${koyeb_api}`
    }
  };
  var k = false
  var postData = {
    "deployment_group": "prod",
    "sha": ""
  };
  let { data } = await axios.get(`https://app.koyeb.com/v1/services`,axiosConfig)
  let id = (data.services[0].id)
  try {
    let ab = await axios.post(`https://app.koyeb.com/v1/services/${id}/redeploy`, postData, axiosConfig)
    k = "_Update Started._"
  } catch (e) {
    k = "*Got an error in redeploying.*\n*Please put koyeb api key in var KOYEB_API.*\n_Eg: KOYEB_API:api key from https://app.koyeb.com/account/api ._"
  }
  return k
};
