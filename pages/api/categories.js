import mongooseConnect from "@/lib/mongoose"
import { Category } from "@/models/Category"
import { getServerSession } from "next-auth"
import { authOptions, isAdminRequest } from "./auth/[...nextauth]"

const handle = async (req, res) => {
  const { method } = req
  await mongooseConnect()
  await isAdminRequest(req, res)

  if (method === "POST") {
    const { categoryName, parentCategory, properties } = req.body
    const categoryDoc = await Category.create({
      categoryName,
      parentCategory: parentCategory || undefined,
      properties,
    })
    res.json(categoryDoc)
  } else if (method === "PUT") {
    const { categoryName, parentCategory, properties, _id } = req.body
    const categoryDoc = await Category.updateOne(
      { _id },
      { categoryName, parentCategory: parentCategory || undefined, properties }
    )
    res.json(categoryDoc)
  } else if (method === "DELETE") {
    if (req.query?.id) {
      const categoryDoc = await Category.deleteOne({ _id: req.query.id })
      res.json(categoryDoc)
    }
  } else if (method === "GET") {
    const categoryDoc = await Category.find().populate("parentCategory")
    res.json(categoryDoc)
  }
}

export default handle
