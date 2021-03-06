var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('pages/index', {title: 'Coupon'});
});

router.get('/signup', function(req, res) {
    res.render('pages/signup', { title: 'Register' });
});

router.get('/login', function(req, res) {
    res.render('pages/login', { title: 'Login' });
});


module.exports = router;
