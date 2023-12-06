import mongooseConnect from "@/lib/mongoose"
import { isAdminRequest } from "./auth/[...nextauth]"
import { Admin } from "@/models/Admin"

const handle = async (req, res) => {
  await mongooseConnect()
  await isAdminRequest(req, res)

  const { method } = req

  if (method !== "POST" && method !== "GET" && method !== "DELETE") {
    res.json("Must be a POST, GET or DELETE request!")
    return
  }

  if (method === "POST") {
    const { email } = req.body
    const emailExist = await Admin.findOne({ email: { '$regex': email, $options: 'i' }  })
    if (emailExist) {
      res.status(400).json({ message: " already exists!" })
    } else {
      res.json(await Admin.create({ email }))
    }
  } else if (method === "GET") {
    res.json(await Admin.find({}, null, { _id: -1 }))
  } else if (method === "DELETE") {
    await Admin.deleteOne({ _id: req.query.id })
    res.json("Deleted")
  }
}

export default handle
