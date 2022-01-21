const { gql } = require("apollo-server-express");

// graphql schema for user

module.exports = gql`
type User {
    id: ID!
    userName: String!
    password: String
    oldPassword: String
    newPassword: String
    bio: String
    profileImage: String
    email: String!
    currencyCode: String
    TimeZone: Int
    status: String
    conversationId: Int
    faceBookId: String
    googleId: String
    appleId: String
    deviceId: String
    blocked: [Int]
    favourites: [Int]
    faceBookVerified: Boolean
    googleVerified: Boolean
    phoneVerified: Boolean
    rememberToken: String
    phone: Int
    createdAt: String
    updatedAt: String
    location: location
    unit: String
    radius: String
    isBlocked: Boolean,
    userRating: Float
    buyerShippingAddress: [shippingAddress]
    verifications: verify
    #myOrders: orderDetails
    payOutMethod : [payoutData]
    passwordGiven: Boolean
}

type verify {
    google: Boolean,
    faceBook: Boolean,
    email: Boolean,
    apple: Boolean
}

type payoutData {
    _id: ID
    type: String
    address1: String,
    address2: String,
    city: String,
    state: String,
    postal_code: String,
    country: String, 
    stripeCountry: String,
    paypal_email: String,
    currency_code: String,
    routing_number: String,
    account_number: String,
    account_holder_name: String,
    holder_type: String,
    document_images: String,
    image: String,
    source: String,
    phone_number: String,
    address_kanji: String,
    address_kana: String,
    bank_name: String,
    branch_name: String,
    branch_code: String,
    ssn_last_4_digits: String,
    default: Boolean,
    IBAN_Number: String,
    transit_Number: String,
    institution_Number: String,
    clearing_Code: String,
    IFSC_code: String,
    personal_Id: String,
    bank_Code: String,
    sort_Code: String,
    stripeAccountCreatedNumber: String
}

type shippingAddress {
    _id: ID
    Name: String
    country: String
    address1: String
    address2: String
    city: String
    state: String
    zipCode: String
    phoneNumber: String
}

type orders {
    _id: ID
    productId: Int
    buyerUserId: Int
    sellerUserId: Int
    status: String
    createdAt: String
    updatedAt: String
    orderDetails: orderData
    buyerShippingAddress: shippingAddress
    shippingDetails: shippedData
    priceDetails: [priceDate]
    sellerUserName: String
    sellerImage: String
    buyerUserName: String
    buyerImage: String
    cancelReason: String
    imageUrl: String
    fromName: String
    userFrom: Int
    payoutMethod: String
    payoutId: String
    payoutBatchId: String
    payoutStatus: String
    payoutCurrency: String
    payoutAmount: Float
    beforePayoutDefaultType: String
    beforePayoutDefaultDetails: String
    isBeforeDefaultPayout: Boolean
}

type priceDate {
    key: String
    title: String
    value: String
}

type shippedData {
    shippmentDate: String
    shippmentMethod: String
    shippementService: String
    trackingId: String
    notes: String    
}
type orderData {
    productId: Int
    productName: String
    productImage: String
    productFee: Float
    shippingRate: Float
    totalFee: Float
    currency: String
    currencyCode: String
    currencySymbol: String
    transactionId: String
    buyerName: String
    sellerName: String
    paymentStatus: String
    paymentType: String
    serviceFeeBuyerRate: Float
    serviceFeeSellerRate: Float
    refundSuccess: Boolean
    refundId: String
    refundCurrency: String
    refundAmount: Float
}

type location {
    city: String
    state: String
    country: String
    lat_lon: [Float]
    pincode: String,
    address: String
}

type result {
    userId: String!
    token: String!
    userName: String!
    profileImage: String
    status: String
    location: location
    currencyCode: String
    currencySymbol: String
}

type userProducts {
    foundUser: User
    ForSale: [product]
    SoldOut: [product]
    review: [review]
    favourites: [product]
    myOrders: [orders]
    mySales: [orders]
    hideOrderCancelStatus: String
}

type Query {
    getUserDetails(id: Int, pageNumber: Int, type: Int): userProducts
    getAllUsers: [User]
}

input UserInput {
     id: Int
     userName: String,
     email: String,
     bio: String,
     profileImage: Upload,
     password: String,
     oldPassword: String,
     newPassword: String,
     location: InputLocation,
     unit: String,
     radius: String,
     status: String,
     type: String
     buyerShippingAddress: [shippingAddressInput],
     iosProfileImage: String
}

input shippingAddressInput {
    Name: String
    country: String
    address1: String
    address2: String
    city: String
    state: String
    zipCode: Int
    phoneNumber: Int
}

input InputLocation {
    city: String
    state: String
    country: String
    lat_lon: [Float]
    lat: String
    lng: String
    pincode: String
    address: String
}

input RatingInput {
    rating: Int
    comments: String
}

input SignupInput {
    userName: String!,
    email: String!,
    password: String!,
    profileImage: String,
    status: String,
    type: String
}

input SocialLogin {
    userName: String!,
    email: String,
    profileImage: String,
    faceBookId: String,
    googleId: String
    appleId: String
}

input ResetPasswordInput {
    token: String!
    password: String!
    confirmPassword: String!
  }

type data {
    result: result
    noEmail: Boolean
}

input payoutPrefInput {
    type: String
    address1: String,
    address2: String,
    city: String,
    state: String,
    postal_code: String,
    country: String,
    stripeCountry: String,
    paypal_email: String
    currency_code: String,
    routing_number: String,
    account_number: String,
    account_holder_name: String,
    holder_type: String,
    document_images: String,
    image: String,
    source: String,
    phone_number: String,
    bank_name: String,
    branch_name: String,
    branch_code: String,
    ssn_last_4_digits: String,
    default: Boolean,
    IBAN_Number: String,
    transit_Number: String,
    institution_Number: String,
    clearing_Code: String,
    IFSC_code: String,
    personal_Id: String,
    bank_Code: String,
    sort_Code: String,
    kanji: kanjiData,
    account_owner_name: String,
    gender: String,
    BSB: String,
    DOB: String,
    documentImage: Upload
    iosImage: uploadData
    documentAdditionalImage: Upload
    iosAdditionalImage: uploadData
    CLABE: String
}

input uploadData {
  fieldName: String
  originalName: String
  mimeType: String
  data: String
  fileURL: String
  contentLength: Int
}

input kanjiData {
    address1: String,
    address2: String,
    city: String,
    state: String,
    postal_code: String,
    country: String,
}

type Mutation {
    signup(data: SignupInput): data
    socialLogin(data: SocialLogin): data
    signin(email: String!, password: String!, code: String): data
    editProfile(data: UserInput): User
    forgotPassword(email: String!): string
    resetPassword(input: ResetPasswordInput): String
    addPayOutMethod(data: payoutPrefInput): String
    deletePayOutMethod(id: ID): Boolean
    setDefaultPayout(id: ID): Boolean
    verifyEmail(code: String): Boolean
    ResendverifyEmailLink: Boolean
}`;
