'use strict';
const mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

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
    userId: {
        type: ObjectId,
        ref: 'User'
    }
});

CouponSchema.methods.serialize = function () {
    return {
        id: this._id,
        merchantName: this.merchantName,
        code: this.code,
        expirationDate: this.expirationDate,
        description: this.description,
        userId: this.userId
    };
}

module.exports = mongoose.model('Coupon', CouponSchema);
