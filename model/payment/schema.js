const { gql } = require("apollo-server-express");

//graphql schema for feedback

module.exports = gql`
type Pay{
    clientToken:String
    success: Boolean
}

type CreditCard{
    cardType:String
    maskedNumber:String
    cardholderName: String
}

type transDetails{
    id: String
    status: String
    amount: Float
    currencyIsoCode: String
    paymentInstrumentType: String
    creditCard: CreditCard    
    createdAt: String
    updatedAt: String   
}

type transactionList{
    id: String
    transactionId: String
    status: String
    amount: Float
    currencyIsoCode: String
    paymentInstrumentType: String
    cardType:String
    maskedNumber:String
    cardholderName: String 
    createdAt: Date
    updatedAt: Date
    success: Boolean
    productName: String
    productuserName: String
    currencySymbol: String
    paymentMethod: String
    payerEmail:String
    paymentId: String
    paymentFor: String
}

type transaction {
    transaction: transDetails
    success: Boolean
}

input ChargePaymentMethodInput{
    amount: Float
    nonce: String  # Braintree , paypal
    productId: Int
    featuredId: Int
    tokenId: String # Stripe
    paymentMode: String
    buyOption: Boolean
    buyerUserId: Int
    sellerUserId: Int
    status: String
    productFee: Float
    shippingRate: Float
    currency: String
    userName: String
    Name: String
    country: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zipCode: String,
    phoneNumber: String 
    totalAmount: Float
    currencyCode: String  
    serviceFeeBuyerRate: Float
    serviceFeeSellerRate: Float
    type: String
    channel: String
    addressId: String
    paymentUserId: Int
}

input tokenInput{
    featuredId: Int
    buyOption: Boolean
    totalAmount: Float
    currencyCode: String
    productId: Int
    type: String
}

type responseStripe{
    clientSecret: String 
}

extend type Query {
    getTransactionDetails: [transactionList]
}

extend type Mutation {
    createClientToken: Pay
    ChargePaymentMethod(data: ChargePaymentMethodInput): transaction
    createStripeClientToken(data: tokenInput): responseStripe
    refund(id: ID): String
    PayoutMethod(id: ID): String
}
`;
