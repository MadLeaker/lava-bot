const Discord = require("discord.js")
const request = require("request")
const Client = new Discord.Client()
const twit = require("twit")
const Path = require('path')
const fs = require('fs')
const axios = require("axios")

const thingys = {
  consumer_key:         process.env.cons_key,
  consumer_secret:      process.env.cons_sec,
  access_token:         process.env.acc_token,
  access_token_secret:  process.env.acc_token_sec,
   timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
   strictSSL:            true,     // optional - requires SSL certificates to be valid. 
 }
 
 const T = new twit(thingys);

 async function downloadFile (url,name){  
    const path = Path.resolve(__dirname, name)
    const writer = fs.createWriteStream(path)
  
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })
  
    response.data.pipe(writer)
  
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }


async function getName() {
  T.get("verify_credentials",function(err,res,msg) {
      return new Promise((resolve,reject) => {
          if(msg.screen_name) {
            resolve(msg.screen_name)
          }
      }) 
  })
}




function getTweets() {
  getName().then(name => {
      const channel = Client.channels.get("576848959990136844");
      channel.send(name);
  })
}

Client.once("ready",() => {
   getTweets();
    
})

Client.on("guildMemberAdd",function(member) {
    let legendRole = member.guild.roles.find("name","Lava Legends")
    member.addRole(legendRole);
})



Client.login(process.env.TOKEN);