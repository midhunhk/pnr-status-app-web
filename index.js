const express = require('express');
const app     = express();
const cookieParser = require('cookie-parser')
const checkService = require('./services/index');
const PORT = '3000'

app.use(cookieParser())

app.get('/scrape/:serviceId/:pnrNumber', function(req, res){

    console.log('/scrape serviceId:' + req.params.serviceId + '; pnrNumber:' + req.params.pnrNumber)

    const processPromise = checkService(req.params.serviceId, req.params.pnrNumber)

    processPromise
        .then( result => res.status(200).send(result))
        .catch( error => res.status(400).send(`${error}`))

})

app.get('/usage', function(req, res){
    res.send('GET /scrape/{serviceId}/{pnrNumber}')
})

app.listen(PORT)

console.log(`Running on port ${PORT}`);

exports = module.exports = app;
