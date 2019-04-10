const axios = require('axios');
const path = require('path')
const fs = require('fs');

const INVALID_SERVICE_ID = "_invalid_service_id_"
const SERVICE_CONFIG_FILE = './services/config.json'

function getService(serviceId, pnr){

    return new Promise( function(resolve, reject){
        // Lookup the requested service's definition
        const serviceConfig = findServiceConfig(serviceId)
        if(INVALID_SERVICE_ID === serviceConfig){
            reject( `Invalid service id ${serviceId} sepcified.` )
        }
        // Load the service defnition
        const serviceDefinition = path.join(__dirname, serviceConfig.service)
        const service = require( serviceDefinition )
        
        // wrap the HTTP call in a promise with the config for the selected service
        const servicePromise = executeService( service.getConfig(pnr), serviceConfig )

        servicePromise
            .then( result => resolve( service.parseResponse(result) ) )
            .catch( error => reject( error ) )
    })
}

function executeService(config, serviceConfig){
    return new Promise( function(resolve, reject) {
        if(serviceConfig.stub === true){
            const stubData = fs.readFileSync( path.join(__dirname, serviceConfig.stub_file) )
            resolve( stubData.toString() )
        } else {
            axios(config)
                .then( response => resolve(response.data) )
                .catch( error => reject( error) )
        }
    })
}

// Legacy functions

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

function findServiceConfig(serviceId){
    const appConfig =  JSON.parse( fs.readFileSync(SERVICE_CONFIG_FILE) + "" )
    for(var i = 0; i <appConfig.services.length; i++){
        var serviceConfig = appConfig.services[i];
        if(serviceConfig.id == serviceId){
            return appConfig.services[i]
        }
    }
    return INVALID_SERVICE_ID
}

module.exports = getService
