const { gql } = require("apollo-server-express");

//graphql schema for filters

module.exports = gql`

input buyerShippingAddress {
    Name: String
    country: String
    address1: String
    address2: String
    city: String
    state: String
    zipCode: String
    phoneNumber: String
}

type updateBuyData {
    Name: String
    country: String
    address1: String
    address2: String
    city: String
    state: String
    zipCode: String
    phoneNumber: String
}

input shippingInput {
    shippmentDate: Date
    shippmentMethod: String
    shippementService: String
    trackingId: String
    notes: String
}

extend type Query {
    getOrderDetails: [orders]
}

extend type Mutation {
    updateShippingAddress(id: ID, data: [buyerShippingAddress]) : Boolean
    deleteShippingAddress(id: ID) : Boolean
    updateShippingDetails(id: ID, data: shippingInput) : Boolean
    updateOrderStatus(id: ID, status: String, cancelReason: String) : Boolean
}

`;