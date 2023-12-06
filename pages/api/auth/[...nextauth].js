import NextAuth, { getServerSession } from "next-auth"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

import GoogleProvider from "next-auth/providers/google"
import { Admin } from "@/models/Admin"

const isAdmin = async (email) => {

  try {
     await clientPromise
     await NextAuth(authOptions)
    //return !!(await Admin.findOne({ email: new RegExp(email, 'i')  }).maxTimeMS(40000))
    return (await Admin.findOne({ email: { '$regex': email, $options: 'i' } }).maxTimeMS(40000))
  } catch (err) {
    console.error("Error checking admin status", err)
    return false
  }
}

export const authOptions = {
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  //MonogDb adapter
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session, token, user }) => {
      //console.log(session)
      if (await isAdmin(session?.user?.email)) {
        return session
      } else {
        return false
      }
    },
  },
}

export default NextAuth(authOptions)

export async function isAdminRequest(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions)
    //console.log(session)
    if (!session || !(await isAdmin(session?.user?.email))) {
      res.status(401)
      res.end()
      throw "not an admin"
    }

    // continue processing for Admin
   //res.status(200).json({ message: "Admin request sucessful" })
   //res.end()
  //return
  //can't have any res. here, there are more res after Admin is coonfirmed
  } catch (err) {
    console.error("Error processing admin request: ", err)
   //res.status(500).json({ error: "Internsal sever error" })
    //res.end()
  }
  //res.end()
}
