import mongooseConnect from "@/lib/mongoose"
import { isAdminRequest } from "./auth/[...nextauth]"
import { Setting } from "@/models/Setting"

const handler = async (req, res) => {
  await mongooseConnect()
  await isAdminRequest(req, res)
  const { method } = req

  if (method !== "PUT" && method !== "GET") {
    res.json("Must be a POST or GET request!")
    return
  }

  if (method === "PUT") {
    const { name, value } = req.body
    const settingDoc = await Setting.findOne({ name })
    if (settingDoc) {
      //settting exists, update the setting
      settingDoc.value = value
      await settingDoc.save()
      res.json(settingDoc)
    } else {
      res.json(await Setting.create({ name, value }))
    }
  } else if (method === "GET") {
    res.json(await Setting.findOne({ name: req.query.name }))
  }
}

export default handler
