var express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const {JWT_SECRET} = require('../config');
const CouponModel = require('../models/Coupon');
var router = express.Router();
const jsonParser = bodyParser.json();

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
router.post('/', (req, res) => {
    const newCoupon = new CouponModel({
      merchantName: req.body.merchantName,
      code: req.body.code,
      expirationDate: req.body.expirationDate,
      description: req.body.description
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
