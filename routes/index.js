var express = require('express');
var router = express.Router();

var bindingController = require('../controllers/binding-controller.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shortner' });
});

router.get('/:binding', bindingController.getUrl);
router.post('/', bindingController.postUrl);

module.exports = router;
