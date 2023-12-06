import mongooseConnect from "@/lib/mongoose"
import Order from "@/models/Orders"

export default async function handler(req, res) {
    try {
        await mongooseConnect()
        console.log("Connected to MongoDB order!!")
        res.json(await Order.find().sort({createdAt: -1}))

    } catch (error) {
        console.error("Eoor connecting to MongDB", error)
    }
}