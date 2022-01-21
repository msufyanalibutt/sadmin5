const { gql } = require("apollo-server-express");

//graphql schema for chat

module.exports = gql`
type Room {
    id: String   
    userId: Int
    productId: Int
    productuserId: Int
    groupName: String
    imageUrl: String
    profileUrl: String
    sellingStatus: String
    currencyCode: String
    currencySymbol: String
    rate: Float
    groupId: String
  }

  type Message {
    id: Int 
    message: String
    createdAt: String 
    userId: Int
    profileImage: String
    readMessage: Boolean
    groupId: Int
  }


 type MessageHistory {
    productId: Int
    productuserId: Int
    productuserName: String
    title: String
    productImage: String
    rate: Float
    isFree: Boolean
    sellingStatus: String
    productuserImage: String
    isBlocked: Boolean
    blockedBy: Boolean
    blockUserId: Int 
    message: [Message]
    shippingRate: Float
    chatStatusMsg: String
    instantBuy: Boolean
    currencyCode: String
    currencySymbol: String
  }

 extend type Query {
  getRooms: [Room]    
  getRoombyId(id: String!): Room
  getMessages(id: Int!):  MessageHistory
  getMessageById(id: Int!): Message

  }
 extend type Mutation {
    createRoom(userId: Int!,productId: Int!,productuserId: Int!): Room                
    sendMessage( message: String!, room: Int!): Message
    deleteChatRoom: Boolean                
  }

type Subscription {
   messageAdded(chatroomId: Int!): Message
   newrosterAdded(userId: Int, type: String): [Roster]
}

`;





