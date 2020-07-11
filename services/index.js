/**
 * Service Executor
 * Executes the specified serviceId to locate the details of the pnr
 * 
 */
const axios = require('axios');
const path = require('path')
const fs = require('fs');

const INVALID_SERVICE_ID = "_invalid_service_id_"
const SERVICE_DISABLED = "_service_disabled_"

const SERVICE_CONFIG_FILE = './services/config.json'
const RESPONSE_SCHEMA_VERSION = 1

/**
 * Loads the service defintion and returns a Promise that resolves the result
 * 
 * @param {serviceId} serviceId 
 * @param {pnr} pnr 
 */
function getService(serviceId, pnr){

    return new Promise( function(resolve, reject){
        // Lookup the requested service's definition
        const serviceConfig = findServiceConfig(serviceId)
        if(INVALID_SERVICE_ID === serviceConfig){
            reject( `Service id ${serviceId} is invalid.` )
        } else if(SERVICE_DISABLED == serviceConfig){
            reject( `Service id ${serviceId} is disabled.` )
        }
        // Dynamically load the service defnition
        const serviceDefinition = path.join(__dirname, serviceConfig.service)
        const service = require( serviceDefinition )
        
        // wrap the HTTP call in a promise with the config for the selected service
        const servicePromise = executeService( service.getConfig(pnr), serviceConfig )

        servicePromise
            .then( result => {
                const responseJSON = service.parseResponse(result);
                responseJSON.version = RESPONSE_SCHEMA_VERSION
                responseJSON.status = "READY"
                resolve( responseJSON ) 
            })
            .catch( error => {
                const responseJSON = {}
                responseJSON.version = RESPONSE_SCHEMA_VERSION
                responseJSON.status = "ERROR"
                responseJSON.message = error + ""
                reject( JSON.stringify( responseJSON ) ) 
            })
    })
}

/**
 * Returns a Promise which executes the service with the config data passed in
 * 
 * @param {config} config 
 * @param {serviceConfig} serviceConfig 
 */
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

/**
 * Loads the configuration data for a given serviceId
 * 
 * @param {serviceId} serviceId 
 */
function findServiceConfig(serviceId){
    const appConfig =  JSON.parse( fs.readFileSync(SERVICE_CONFIG_FILE) + "" )
    for(var i = 0; i <appConfig.services.length; i++){
        var serviceConfig = appConfig.services[i];
        if(serviceConfig.id == serviceId){
            if(serviceConfig.enabled){   
                return appConfig.services[i]
            }
            return SERVICE_DISABLED
        }
    }
    return INVALID_SERVICE_ID
}

module.exports = getService
