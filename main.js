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




function getPatchNotes(interval) {
    const channel = Client.channels.get("574297690943520789")
    channel.fetchMessages({ limit: 1 })
  .then(messages => {
      messages.forEach(msg => {
          if(!msg.content.includes("Season 9 is out!")) {
            console.log("No season 9 in discord!");
            request("https://www.epicgames.com/fortnite/en-US/patch-notes/v9-00",function(err,response,body) {
                console.log(response.request.href)
                if(response.request.href.includes("not-found")) {
                    console.log("No season 9 patch notes!");
                }
                else {
                    console.log("There's season 9 patch notes!")
                    channel.send("Season 9 is out! Patch notes: https://www.epicgames.com/fortnite/en-US/patch-notes/v9-00 @everyone")
                    getVideos();
                }
            })
          }
          else {
              console.log("There's season 9 patchnotes in discord!")
              clearInterval(interval)
          }
      });
  })
  .catch(console.error);
}


function getVideos() {
  request("https://www.epicgames.com/fortnite/en-US/news/season-9",async function(err,response,body) {
    const channel = Client.channels.get("574297690943520789")
      if(!response.request.href.includes("not-found")) {
        const $ = await cheerio.load(body);
        const test = $("iframe");
        test.each((index,elem) => {
            channel.send(elem.attribs.src+" @everyone");
        })
      }
      
  })
}



Client.once("ready",() => {

    var int = setInterval(function() {getPatchNotes(int)},1000);
    
})

Client.on("guildMemberAdd",function(member) {
    let legendRole = member.guild.roles.find("name","Lava Legends")
    member.addRole(legendRole);
})



Client.login(process.env.TOKEN);