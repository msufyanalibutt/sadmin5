const { gql } = require("apollo-server-express");

//graphql schema for admin

module.exports = gql`

scalar Date

type AdminUser {
    id: ID!
    userName: String!
    password: String!
    email: String!
    status: String
    role: String
    faceBookId: String
    googleId: String
    deviceId: String
    resetPasswordToken: String
    createdAt: String
    updatedAt: String
}

type CurrentUser {
    id: ID
    userName: String
    email: String
    profileImage: String
    unreadMessage: Int
    verifications: verify
}

type CurrentAdmin {
    id: ID
    userName: String
    email: String
}

type forceUpdateData{
    id: Int
    version: String
    deviceType: String
    forceUpdate: String
    createdAt: String
    updatedAt: String
}

extend type Query {
    getAdminUsers: [AdminUser]
    getAdminUser(id: Int): AdminUser
    getCurrentUser: CurrentUser
    getCurrentAdmin: CurrentAdmin
    getForceUpdates: [forceUpdateData]
}

input adminInput {
    id: Int
    userName: String,
    email: String,
    password: String,
    status: String,
    role: String
}

input FeedBackData {
     name: String
     email: String
     feedBack: String
}

input forceDate{
    version: String
    deviceType: String
    forceUpdate: String
}

extend type Mutation {
    adminLogin(userName: String!, password: String!): Boolean
    updateAdmin(data: adminInput): Boolean
    delete(id: Int!, typeConfig: String!): Boolean
    sendFeedBack(data: FeedBackData): Boolean
    logOut(type: String): Boolean
    updateForceUpdateOption(id: Int, data: forceDate): Boolean
}`;
