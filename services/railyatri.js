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
    console.log(`railyatri getConfig start ${getUrl}`)
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
    return response
}

module.exports = {
    getConfig,
    parseResponse
}
