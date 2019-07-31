var Hapi = require('@hapi/hapi');
var fs = require('fs');
var good = require('@hapi/good');
var path = require('path');
var _ = require('underscore');


const startServer = async () => {    
	var server_options = { 
	    host: 'localhost',
	    port: '4000'
	}

	var server = new Hapi.Server(server_options);    

	var plugins = [];

	plugins.push({
	    plugin: good,
	    options: {
	        reporters: {
	            myConsoleReporter: [{
	                module: '@hapi/good-squeeze',
	                name: 'Squeeze',
	                args: [{ log: '*', response: '*' }]
	            },
	            {
	                module: '@hapi/good-console'
	            }, 'stdout']
	        }
	    }
	});

	var hapiauth = {};
	hapiauth.plugin = require("@juanprietob/hapi-auth-jwt");
	hapiauth.options = {};

	var hapijwtcouch = {};
	hapijwtcouch.plugin = require("./index");
	hapijwtcouch.options = {
        "privateKey": "SomeRandomKey123",
        "saltRounds": 10,
        "algorithm": { 
            "algorithm": "HS256"
        },
        "algorithms": { 
            "algorithms": [ "HS256" ] 
        },
        "mailer": {
            "nodemailer": "nodemailer-stub-transport",
            "from": "HapiJWTCouch <hapijwtcouch@gmail.com>"
        },
        "userdb" : {
            "hostname": "http://localhost:5984",
            "database": "hapijwtcouch"
        }
    }

    plugins.push(hapiauth);
    plugins.push(hapijwtcouch);

	await server.register(plugins);
	await server.start();
	console.log(`Server running at: ${server.info.uri}`);
}

startServer();

