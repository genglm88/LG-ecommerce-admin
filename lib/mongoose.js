import mongoose from 'mongoose'
import React from 'react'

const mongooseConnect = () => {
 const uri = process.env.MONGODB_URI
 if (mongoose.connection.readyState === 1) { //already connected
    return mongoose.connection.asPromise()
 } else { // try to connect
    return mongoose.connect(uri)
 }
}


export default mongooseConnect