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




function getPatchNotes() {
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
                }
            })
          }
          else {
              console.log("There's season 9 patchnotes in discord!")
          }
      });
  })
  .catch(console.error);
}


function newTeaser(day,interval) {
    T.get('statuses/user_timeline',{screen_name: "FortniteGame",count:50,tweet_mode:"extended"},function(err,tweet,resp) {
    tweet.forEach(async tw => {
        console.log(tw.full_text);
        if(tw.entities.media && tw.full_text.includes("#FortniteSeason9") && tw.created_at.includes(day))
        {
            console.log("New Teaser Available");
          await downloadFile(tw.entities.media[0].media_url_https,"Teaser3.png");
          const channel = Client.channels.get("574297690943520789")
          channel.fetchMessages({limit: 1}).then(messages => {
              messages.forEach(msg => {
                    if(!msg.content.includes("3rd Teaser")) {
                        channel.send("3rd Teaser Is Out!",{files: [
                            "./Teaser3.png"
                        ]})
                    }
                    else {
                      clearInterval(interval)
                    }   
              })
          })
          
        }
        else {
            console.log("No New Teaser!");
        }
        
    })
  }) 
  }



Client.once("ready",() => {

    setInterval(getPatchNotes,1000);
    var interval = setInterval(function() {newTeaser("Wed",interval)},1000)
})

Client.on("guildMemberAdd",function(member) {
    let legendRole = member.guild.roles.find("name","Lava Legends")
    member.addRole(legendRole);
})



Client.login(process.env.TOKEN);