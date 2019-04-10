const cheerio = require('cheerio')

function getConfig(string){
    const getUrl = `https://www.google.ca/search?source=hp&q=${string}`;
    
    return {
        method:'get',
        url:getUrl
      }
}
function parseResponse(response){
    const resultObj = []
    const $ = cheerio.load(response);
    
    $("h3").each(function() {
        var link = $(this);
        var text = link.text();

        item = {}
        item.text = text;

        resultObj.push(item)
    });

    return resultObj;
}

module.exports = {
    getConfig,
    parseResponse
}