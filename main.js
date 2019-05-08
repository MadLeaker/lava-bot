const Discord = require("discord.js")
const request = require("request")
const Client = new Discord.Client()


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




Client.once("ready",() => {

    setInterval(getPatchNotes,1000);
})

Client.on("guildMemberAdd",function(member) {
    member.addRole("Lava Legends")
})



Client.login("NTc1MDQ1NzMyMDU5NTc4Mzgw.XNHdvA.Y7UsHSuUC58qYFv6dItjiY_P4Y4")