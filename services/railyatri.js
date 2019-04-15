/**
 * trainpnrstatus.js
 * 
 * The trainpnrstatus service parser
 * 
 * @version 1.0
 * @author midhunhk
 * 
 */

/**
 * Returns the config for invoking this service
 * 
 * @param {pnr} pnr 
 */
function getConfig(pnr){
    const getUrl = `https://www.railyatri.in/pnr-status/${pnr}`
    return {
        method:'get',
        url:getUrl,
        headers: {
            host: 'www.railyatri.in'
        }
    }
}

/**
 * Parses the invocation of the web response
 * 
 * @param {response} response 
 */
function parseResponse(response){
    const responseJSON = createJSONResponse(response)


    return responseJSON
}

function createJSONResponse(response){
    const cheerio = require('cheerio')
    const $ = cheerio.load(response)

    const resultObj = {}
    const pnrNo = $('#status-chart > div > div > div:nth-child(1) > p.pnr-bold-txt').text()

    const trainNumberName = $('#homepage-main-container > div.row > div.pnr-search-result-blk > div.pnr-search-result-info > div > div.col-xs-12.train-info > a > p').text()
    resultObj.trainDetails = {}
    resultObj.trainDetails.trainNo = trainNumberName.split('-')[0]
    resultObj.trainDetails.trainName = trainNumberName.substring( trainNumberName.indexOf('-') + 1)
    resultObj.trainDetails.trainFrom = $('#homepage-main-container > div.row > div.pnr-search-result-blk > div.pnr-search-result-info > div > div.train-route > div:nth-child(1) > p.pnr-bold-txt').text()
    resultObj.trainDetails.trainTo = $('#homepage-main-container > div.row > div.pnr-search-result-blk > div.pnr-search-result-info > div > div.train-route > div:nth-child(2) > p.pnr-bold-txt').text()
    
    resultObj.passengersCount = 'Unavailable'

    resultObj.travelDetails = {}
    resultObj.travelDetails.boardingPoint = resultObj.trainDetails.trainFrom
    resultObj.travelDetails.reservedUpto = resultObj.trainDetails.trainTo
    resultObj.travelDetails.travelDate = $('#homepage-main-container > div.row > div.pnr-search-result-blk > div.pnr-search-result-info > div > div.boarding-detls > div:nth-child(1) > p.pnr-bold-txt').text()
    resultObj.travelDetails.travelDateString = resultObj.travelDetails.travelDate
    resultObj.travelDetails.ticketClass = $('#homepage-main-container > div.row > div.pnr-search-result-blk > div.pnr-search-result-info > div > div.boarding-detls > div:nth-child(2) > p.pnr-bold-txt').text()
    resultObj.travelDetails.bookingStatus = $('#status > div:nth-child(2) > div:nth-child(1) > p').text()
    resultObj.travelDetails.currentStatus = $('#status > div:nth-child(2) > div:nth-child(2) > p').text()

    resultObj.pasengerDetails = []

    const passengerInfo = {}
    passengerInfo.name = "Not available"
    passengerInfo.seat = "Not Available"
    passengerInfo.status = resultObj.travelDetails.currentStatus
    //passengerInfo.quota = responseData.quotaCode
    resultObj.pasengerDetails.push( passengerInfo )
    
    return resultObj
}

module.exports = {
    getConfig,
    parseResponse
}
