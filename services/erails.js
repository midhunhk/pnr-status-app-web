
function getConfig(pnr){
    // TODO append with timestamp
    const getUrl = `https://data.tripmgt.com/Data.aspx?Action=PNR_STATUS_RR&Data1=${pnr}&t=1554749606601`
    return {
        method:'get',
        url:getUrl
      }
}
function parseResponse(response){
    const resultObj = {}
    resultObj.id = response._id
    
    const pnrData = response.PnrData

    resultObj.status = pnrData.status
    resultObj.message = pnrData.message
    
    const travelData = JSON.parse(response.PnrData + "").data
    console.log( travelData )

    resultObj.pnrNo = travelData.pnrNo
    resultObj.noOfPassenger = travelData.noOfPassenger

    return resultObj;
}

module.exports = {
    getConfig,
    parseResponse
}