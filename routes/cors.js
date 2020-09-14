const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:4200'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    if(whitelist.indexOf(req.header('Origin')) !== -1) {
       console.log(whitelist.indexOf(req.header('Origin'))); 
        corsOptions = { origin: true};
    }else {
        corsOptions = { origin: false};
    }
    callback(null, corsOptions);
};

exports.cors = cors();
//when acces control allow origin to *(i.e all) options on a particular route i.e get

exports.corsWithOptions = cors(corsOptionsDelegate);
//when acess control allow origin to limited options on a route then this one