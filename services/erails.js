
function getConfig(pnr){
    // TODO append with timestamp
    const getUrl = `https://data.tripmgt.com/Data.aspx?Action=PNR_STATUS_RR&Data1=${pnr}&t=1554749606601`
    return {
        method:'get',
        url:getUrl
      }
}
function parseResponse(response){
    const responseObj = JSON.parse(response)
    const resultObj = {}
    resultObj.id = responseObj._id
    return resultObj;
}

module.exports = {
    getConfig,
    parseResponse
}