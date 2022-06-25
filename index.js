const express = require('express');
require('dotenv').config();

const app = express();


app.get('/', (req, res, next) => {
    res.json({
        Message: "API is working ✨"
    });
});


//Error handeler
function notFound(req, res, next) {
    res.status(404);
    const error = new Error('Not Found - ' + req.originalUrl);
    next(error);
}

function errorHandler(err, req, res, next){
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack
    });
}

app.use(notFound);
app.use(errorHandler);

//start server on port 3000

const server = app.listen(3000, () =>{
    console.log(`Server started listening on ${server.address().port}`)
});