'use strict';
const mongoose = require('mongoose');

const CouponSchema = mongoose.Schema({
    merchantName: {
        type: String,
        required: true
    },
    code: {
        type: String
    },
    expirationDate: {
        type: String
    },
    description: {
        type: String
    }
});

CouponSchema.methods.serialize = function () {
    return {
        id: this._id,
        merchantName: this.merchantName,
        code: this.code,
        expirationDate: this.expirationDate,
        description: this.description
    };
}

module.exports = mongoose.model('Coupon', CouponSchema);
