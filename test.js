const request = require('request')
const cheerio = require('cheerio')

function getVideos() {
    request("https://www.epicgames.com/fortnite/en-US/news/season-8",async function(err,response,body) {
        const $ = await cheerio.load(body);
        const test = $("iframe");
        test.each((index,elem) => {
            console.log(elem.attribs.src)
        })
    })
}

getVideos();