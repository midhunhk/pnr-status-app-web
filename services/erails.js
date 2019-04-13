/**
 * erails.js
 * 
 * The erails service parser
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
    const ts = new Date().getTime()
    const getUrl = `https://data.tripmgt.com/Data.aspx?Action=PNR_STATUS_RR&Data1=${pnr}&t=${ts}`
    return {
        method:'get',
        url:getUrl
      }
}

/**
 * Parses the invocation of the web response
 * 
 * @param {response} response 
 */
function parseResponse(response){
    const resultObj = {}
    const responseJSON = JSON.parse( response)
    // resultObj.id = responseJSON._id
    
    const pnrData = responseJSON.PnrData
    resultObj.status = pnrData.status
    resultObj.message = pnrData.message
    
    const travelData = JSON.parse(responseJSON.PnrData + "").data

    resultObj.pnrNo = travelData.pnrNo
    resultObj.passengersCount = travelData.noOfPassenger

    resultObj.trainDetails = getTrainDetails(travelData)
    resultObj.travelDetails = getTravelDetails(travelData)
    
    resultObj.pasengerDetails = getPassengerDetails(travelData.passengerDetailsDTO, resultObj.passengersCount)

    return resultObj
}

function getPassengerDetails(passengerData, passengersCount){
    const passengerDetails = []
    for(i = 0; i < passengersCount; i++){
        const responseData = passengerData[i]
        const passengerInfo = {}
        passengerInfo.name = "Passenger " + (i +1)
        passengerInfo.seat = "seat"
        passengerInfo.status = responseData.seatStts
        passengerInfo.quota = response.quotaCode
        passengerDetails.push(passengerInfo)
    }
    return passengerDetails
}

function getTrainDetails(pnrData){
    const trainDetails = {}
    trainDetails.trainNo = pnrData.trainNum
    trainDetails.trainName = pnrData.trainName
    trainDetails.trainFrom = pnrData.stationFrom
    trainDetails.trainTo = pnrData.stationTo
    return trainDetails
}

function getTravelDetails(pnrData){
    const travelDetails = {}
    travelDetails.boardingPoint = pnrData.boardingPoint
    travelDetails.reservedUpto = pnrData.reservationUpTo
    travelDetails.travelDate = pnrData.departureDate
    travelDetails.travelDateString = pnrData.departureDate
    travelDetails.ticketClass = pnrData.journeyClass
    travelDetails.bookingStatus = pnrData.chartStts
    travelDetails.currentStatus = pnrData.chartStts
    return travelDetails
}

module.exports = {
    getConfig,
    parseResponse
}
