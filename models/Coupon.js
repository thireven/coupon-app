'use strict';
const mongoose = require('mongoose');
const User = require('./User');

const CouponSchema = mongoose.Schema({
    merchantName: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    expirationDate: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    couponUsed: {
        type: Boolean
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId
      //required: true
    }
});

CouponSchema.methods.serialize = function () {
    return {
        id: this._id,
        merchantName: this.merchantName,
        code: this.code,
        expirationDate: this.expirationDate,
        description: this.description,
        couponUsed: this.couponUsed,
        userId: this.userId
    };
}

module.exports = mongoose.model('Coupon', CouponSchema);
