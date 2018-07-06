var express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const passport = require('passport');
const {JWT_SECRET} = require('../config');
const CouponModel = require('../models/Coupon');

var router = express.Router();
const jsonParser = bodyParser.json();
// const jwtAuth = passport.authenticate('jwt', { session: false });

//GETS THE USERID FROM JWT - returns the userid from a request 'authorization' header
// function getUserIdFromJwt(req){
// 	const token = req.headers.authorization.split(' ')[1];
//   console.log(token);
// 	const tokenPayload = jwt.verify(token, JWT_SECRET);
// 	const userId = tokenPayload.user.id;
//   console.log("This is the userId from JWT: " + userId);
// 	return userId;
// }
const jwtAuth = passport.authenticate('jwt', { session: false });
// router.get('/api/protected', jwtAuth, (req, res) => {
// 	return res.json({
//     data: 'rosebud'
//    });
// });


// GETS ALL COUPONS
router.get('/', (req, res) => {
  CouponModel.find({})
    .then(coupons =>
        res.render('pages/coupon', {
        title: 'Coupon',
        coupons: coupons
    }))
    .catch(err => {
        console.error(err);
        res.status(500).json({
        message: 'Internal server error'
        });
    });
});

// CREATES A NEW COUPON
router.post('/', jwtAuth, (req, res) => {

  console.log("This is the request from adding a coupon: " + req);

  //const _userId = getUserIdFromJwt(req);
  //console.log("This is the userId from JWT: " + _userId)

  const newCoupon = new CouponModel({
    merchantName: req.body.merchantName,
    code: req.body.code,
    expirationDate: req.body.expirationDate,
    description: req.body.description
    //userId: _userId
  });

    newCoupon.save()
      .then(function(coupon) {
        const savedCoupon = coupon.toObject();
        // res.status(201).json(savedCoupon).redirect('/coupon');
        //console.log(savedCoupon);
        res.status(201).json(savedCoupon);
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send(err);
      });
});

// DELETES A NEW COUPON
router.delete('/:id', (req, res) => {
  CouponModel.findByIdAndRemove(req.params.id)
  .then(coupon => res.status(204).end())
  .catch(err => res.status(500).json({message: 'Internal server error'}));
});


module.exports = router;
