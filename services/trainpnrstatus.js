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
    
    const postUrl = 'https://www.trainspnrstatus.com/pnrformcheck.php'
    return {
        method:'post',
        url:postUrl,
        data: {
            lccp_pnrno1: pnr
        },
        headers: {
            referer: 'https://www.trainspnrstatus.com/',
            origin: 'https://www.trainspnrstatus.com',
            host: 'www.trainspnrstatus.com',
            dnt: '1',
            scheme: 'https'
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
