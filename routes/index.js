const Promise = require('bluebird');
const randomString = Promise.promisify(require('secure-random-string'));
const errors = require('../errors');

module.exports = function({knex}) {

    let router = require('express-promise-router')();

    function createBinding(url) {
        return Promise.try(() => {
            return randomString({ length: 5 });
        }).then((slug) => {
            let newBinding = {
                url: url,
                binding: slug
            }
            return Promise.try(() => {
                return knex('url_bindings').insert(newBinding);
            }).then((id) => {
                return newBinding.binding
            });
        });
    }

    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Shortner' });
    });

    router.post('/', (req, res, next) => {
        return Promise.try(() => {
            return knex('url_bindings').where({
                url: req.body.url
            }).first();
        }).then((result) => {
            if(result != null) {
                return result.binding;
            } else {
                return Promise.try(() => {
                    return createBinding(req.body.url);
                });
            }
        }).then((binding) => {
            res.render('response', {
                title: req.body.url,
                body: `http://localhost:3000/${binding}`
            });
        });
    });
    
    router.get('/:binding', (req, res) => {
        return Promise.try(() => {
            return knex('url_bindings').where({
                binding: req.params.binding
            }).first();
        }).then((resp) => {
            if(resp != null) {
                res.redirect(resp.url);
            } else {
                throw new errors.NotFoundError("URL not found!");
            }
        });
    });

    return router;
}
