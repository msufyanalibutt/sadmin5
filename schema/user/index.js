const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose.connection);

// db schema - user
const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: function() {
            var result = this.faceBookId ? false : this.googleId ? false : this.appleId ? false : true;
            return result;
          }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String
    },
    profileImage: String,
    imageSource: {
        type: String,
        default: "local"
    },
    location: {
        city: {
            type: String
        },
        state: {
            type: String
        },        
        address: {
            type: String
        },
        country: {
            type: String
        },
        lat_lon: {
            type: [Number],
            index:"2d"
        },
        pincode: {
            type: String
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    currencyCode: {
        type: String
    },
    timeZone: {
        type: Number
    },
    status: {
        type: String,
        default: "Active"
    },    
    conversationId: {
        type: Number
    },    
    faceBookId: {
        type: String
    },    
    googleId: {
        type: String
    },    
    appleId:{
        type : String
    },   
    deviceId: {
        type: String
    },  
    device: {
        type: String
    },  
    phoneNumber: {
        type: Number
    },
    rememberToken: {
        type: String
    },        
    unit: { 
        type: String,
        default: "KM"
    },
    radius: {
        type: String
    },
    blocked: {
        type: Array
    },
    report: {
        reportedTo: {
            type: Number
        },
        reportedFrom: {
            type: Number
        },
        reasonId: {
            type: Number
        },
        reportedAt: {
            type: String
        },
        comments: {
            type: String
        }
    },
    favourites: {
        type: Array
    },
    verifications: {
        faceBook: {
            type: Boolean,
            default: false
        },
        google: {
            type: Boolean,
            default: false
        },
        phoneNumber: {
            type: Boolean
        },
        email: {
            type: Boolean,
            default: false
        },
        apple: {
            type: Boolean,
            default: false
        }
    },
    EmailExpires: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    ratings: [{
        userFrom: {
            type: Number
        },
        rating: {
            type: Number
        },
        comments: {
            type: String
        },
        timeStamp: {
            type: Date,
            default: Date.now
        }
    }],
    buyerShippingAddress: [{
        // userName: {
        //     type: String
        // },
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
    }],
    payOutMethod: [{        
        type: { type: String }, 
        address1: { type: String },
        address2: { type: String },
        city: { type: String },
        state: { type: String },
        postal_code: { type: String },
        country: { type: String }, 
        stripeCountry: { type: String },        
        paypal_email: { type: String },
        default: { type: Boolean, default: false},        
        currency_code: { type: String },
        routing_number: { type: String },
        account_number: { type: String },
        account_holder_name: { type: String },
        holder_type: { type: String },
        documentImage: { type: String },
        documentAdditionalImage: { type: String },
        image: { type: String },
        source: { type: String },
        phone_number: { type: String },
        address_kanji: { type: String },
        address_kana: { type: String },
        bank_name: { type: String },
        branch_name: { type: String },
        branch_code: { type: String },
        ssn_last_4_digits: { type: String },
        IBAN_Number: { type: String },
        transit_Number: { type: String },
        institution_Number: { type: String },
        clearing_Code: { type: String },
        IFSC_code: { type: String },
        personal_Id: { type: String },
        bank_Code: { type: String },
        sort_Code: { type: String },
        CLABE: { type: String },
        stripeAccountCreatedNumber: {type: String}
    }]
});

userSchema.pre("save", function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }

        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err) {
                return next(err);
            }
            this.password = hash;
            next();
        });
    });
});

userSchema.plugin(autoIncrement.plugin, {model: "user", startAt: 10000});

module.exports = mongoose.model("user", userSchema);