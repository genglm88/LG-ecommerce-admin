import imageDownloader from "image-downloader"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import fs from "fs"
import mime from "mime-types"
import mongooseConnect from "@/lib/mongoose"
import { isAdminRequest } from "./auth/[...nextauth]"
//const bucketName = "lg-next-ecommerce"
const bucketName = "lg-booking-app"

const uploadToS3 = async (path, filename, mimetype) => {
  const client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  })
  const ext = filename.split(".").pop()
  const newFilename = Date.now() + "." + ext
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
      ACL: "public-read",
    })
  )
  return `https://${bucketName}.s3.amazonaws.com/${newFilename}`
}

export default async function handle(req, res) {
  await mongooseConnect()
  await isAdminRequest(req,res)
  
  const { picLink } = req.body
  const newName = "photo-" + Date.now() + ".jpg"
  await imageDownloader.image({
    url: picLink,
    dest: "/tmp/" + newName,
  })
  const filename = "/tmp/" + newName
  const link = await uploadToS3(filename, newName, mime.lookup(filename))

  return res.json(link)
}

export const config = {
  api: { bodyParser: true },
}
