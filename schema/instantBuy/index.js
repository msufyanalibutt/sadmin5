const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
// const { stream } = require("xlsx/types");

const Schema = mongoose.Schema;

// db schema - instantBuy
const instantBuySchema = new Schema({
    buyerUserId : {
        type: Number
    },
    sellerUserId : {
        type: Number
    },
    productId: {
        type: Number
    },
    buyerShippingAddress: {
        userName: {
            type: String
        },
        Name: {
            type: String
        },
        country: {
            type: String
        },
        address1: {
            type: String
        },
        address2: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        zipCode: {
            type: String
        },
        phoneNumber: {
            type: String
        }
    },
    orderDetails: {
        productId: {
            type: Number
        },
        productName: {
            type: String
        },
        productImage: {
            type: String
        },
        productFee: {
            type: Number
        },
        shippingRate: {
            type: Number
        },
        totalFee: {
            type: Number
        },
        currency: {
            type: String
        },
        currencySymbol: {
            type: String
        },
        transactionId: {
            type: String
        },
        buyerName: {
            type: String
        },
        sellerName: {
            type: String
        },
        paymentStatus: {
            type: String
        },
        paymentType: {
            type: String
        },
        transactionId: {
            type: String
        },
        refundSuccess: {
            type: Boolean
        },
        refundId: {
            type: String
        },
        refundAmount: {
            type: Number
        },
        refundCurrency: {
            type: String
        },
        serviceFeeBuyerRate: {
            type: String
        },
        serviceFeeSellerRate:{
            type: String
        }
    },
    status: {
        type: String     // processing, shipped, claimed, received, cancelled, notStarted
    },
    cancelReason: {
        type: String
    }, 
    // transactionId: String,
    shippingDetails: {
        shippmentDate: {
            type: Date
        },
        shippmentMethod: {
            type: String
        },
        shippementService: {
            type: String
        },
        trackingId: {
            type: String
        },
        notes: {
            type: String
        }
    },
    payoutMethod: {
        type: String
    },
    payoutId: {
        type: String
    },
    payoutBatchId: {
        type: String
    },
    payoutStatus: {
        type: String
    },
    payoutAmount: {
        type: Number
    },
    payoutCurrency: {
        type: String
    },
    createdAt: {
        type: Date,
        default  : Date.now
    },
    updatedAt: { 
        type: Date,
        default: Date.now   
    }
});

instantBuySchema.plugin(autoIncrement.plugin, {model: "instantBuy", startAt: 10000});

module.exports = mongoose.model("instantBuy", instantBuySchema);