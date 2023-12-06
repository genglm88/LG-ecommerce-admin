import mongooseConnect from "@/lib/mongoose"
import { Product } from "@/models/Product"
import { Category } from "@/models/Category"
import { isAdminRequest } from "./auth/[...nextauth]"

const handle = async (req, res) => {
  const { method } = req
  //mongoose.Promise = clientPromise
  await mongooseConnect()
  await isAdminRequest(req, res)

  if (method === "POST") {
    const { title, description, price, images, categoryId, productProperties } = req.body
    //console.log(images)
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      categoryId,
      productProperties,
    })
    res.json(productDoc)
  } else if (method === "PUT") {
    const { title, description, price, images, categoryId, productProperties,id } = req.body
    const productDoc = await Product.updateOne(
      { _id: id },
      { title, description, price, images, categoryId,productProperties }
    )
    res.json(productDoc)
  } else if (method === "DELETE") {
    if (req.query?.id) {
      const productDoc = await Product.deleteOne({ _id: req.query.id })
      res.json(productDoc)
    }
  } else if (method === "GET") {
    if (req.query?.id) {
      const productDoc = await Product.findOne({ _id: req.query.id })
      res.json(productDoc)
    } else {
      const productDoc = await Product.find()
      res.json(productDoc)
    }
  }
}

export default handle
