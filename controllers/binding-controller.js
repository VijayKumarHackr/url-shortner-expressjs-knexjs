var knex = require('../database/db');
var Promise = require('bluebird');

var getRandom = function(numChars) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i = 0; i < numChars; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    return text;
}

mapping = {
    getUrl: function(req, res, next) {
        knex.select('url').from('url_bindings')
        .where('binding', req.params.binding)
        .limit(1).then((resp) => {
            if(resp.length < 1)
                res.render('response', { title: "URL not found!" });
            else {
                res.redirect(resp[0].url);
            }
        });
    },

    postUrl: function(req, res, next) {
        function getBinding(callback) {
            knex.select('binding').from('url_bindings')
                .where('url', req.body.url).limit(1)
                .then((response) => {
                    return callback(response, insertBinding);
                })
                .then((bindingsArray) => {
                    res.render('response', {
                    title: req.body.url,
                    body: "http://localhost:3000/" + bindingsArray.binding
                    })
                });
        }

        function insertBinding() {
            var binding = getRandom(5);
            console.log(req.body.url);    // prints undefined
            knex.insert({
                        url: req.body.url,
                        binding: binding
                    })
                    .into('url_bindings')
                    .catch((err) => {
                        var e = new Error(err);
                        e.status = 403;
                        console.error(err);
                        next();
                    });
            return binding;
        }
        
        function checkBinding(response, callback) {
            if (response.length < 1)
                return callback();
            else
                return response[0];
        }

        getBinding(checkBinding);
    }
}

module.exports = mapping;
