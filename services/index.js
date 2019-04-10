var axios = require('axios');
var path = require('path')

function getService(serviceId, pnr){
    console.log(`getService ${serviceId}, ${pnr}`)

    return new Promise( function(resolve, reject){
        var service;
        var servicePromise;
        if(serviceId == 1){
            servicePromise = checkWithTrainPnrStatus(pnr)
        } else if (serviceId == 2){
            servicePromise = checkWithRailYatri(pnr)
        }  else if (serviceId == 3){
            servicePromise = checkWithERail(pnr)
            service = require('./erails')
        } else if (serviceId == 0){
            service = require('./search')
        } else {
            reject( `Invalid service id ${serviceId} sepcified.` )
        }

        servicePromise = executeService( service.getConfig(pnr) )

        servicePromise
            .then( result => resolve( service.parseResponse(result) ) )
            .catch( error => reject( error ) )
    })
}

function executeService(config){
    return new Promise( function(resolve, reject) {
        
        axios(config)
            .then( response => resolve(response.data) )
            .catch( error => reject( error) )
    })
}

function checkWithTrainPnrStatus(pnrNumber){
    return new Promise( function(resolve, reject){
        const postUrl = 'https://www.trainspnrstatus.com/pnrformcheck.php'
        const config = {
            headers: {
                referer: 'https://www.trainspnrstatus.com/',
                origin: 'https://www.trainspnrstatus.com',
                host: 'www.trainspnrstatus.com',
                dnt: '1',
                scheme: 'https'
            }
        }
        const data = {
            lccp_pnrno1: pnrNumber
        }
        console.log("Posting to " + postUrl)
        axios.post(postUrl, data, config)
            .then( response => {
                resolve(response.data)
            })
            .catch(function (error) {
                reject( error)
            });
    })
}

function checkWithRailYatri(pnrNumber){
    return new Promise( function(resolve, reject){
        const url = 'https://www.railyatri.in/pnr-status/' + pnrNumber
        const config = {
            headers: {
                host: 'www.railyatri.in'
            }
        }

        console.log("Getting from " + url)
        axios.get(url, config)
            .then( response => {
                resolve(response.data)
            })
            .catch(function (error) {
                reject( error)
            });
    })
}

module.exports = getService
