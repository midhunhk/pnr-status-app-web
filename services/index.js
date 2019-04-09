var axios = require('axios');

function getService(serviceId, pnr){
    console.log(`getService ${serviceId}, ${pnr}`)

    return new Promise( function(resolve, reject){
        var servicePromise;
        if(serviceId == 1){
            servicePromise = checkWithTrainPnrStatus(pnr)
        } else if (serviceId == 2){
            servicePromise = checkWithRailYatri(pnr)
        }  else if (serviceId == 3){
            servicePromise = checkWithERail(pnr)
        } else if (serviceId == 0){
            servicePromise = search(pnr)
        } else {
            reject( `Invalid service id ${serviceId} sepcified.` )
        }

        servicePromise.then(
            result => resolve(result)
        ).catch( error => {
            console.log(`Service Promise Rejected ${error}`)
            reject( error )
        })
    })
}

function search(string){
    return new Promise( function(resolve, reject) {
        const url = `https://www.google.ca/search?source=hp&q=${string}`;
        console.log(`Getting from ${url}`)
        axios.get(url)
            .then( response => {
                resolve(response.data)
            })
            .catch(function (error) {
                reject( error)
            });
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

function checkWithERail(pnr){
    // http://localhost:3000/scrape/3/4356405273
    return new Promise( function(resolve, reject){
        //const url = 'https://erail.in/pnr-status/' + pnr
        const url = 'https://data.tripmgt.com/Data.aspx?Action=PNR_STATUS_RR&Data1=' + pnr + '&t=1554749606601'
        const config = {
            headers: {
                Origin: 'https://erail.in',
                Referrer: 'https://erail.in/pnr-status/' + pnr,
                Host: 'erail.in',
                Cookie: 'm_pnr=' + pnr
            }
        }
        // https://data.tripmgt.com/Data.aspx?Action=PNR_STATUS_RR&Data1=4356405273&t=1554749606601
        /* https://stackoverflow.com/questions/16209145/how-to-set-cookie-in-node-js-using-express-framework */
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
