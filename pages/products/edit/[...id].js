import Layout from "@/components/Layout"
import ProductForm from "@/components/ProductForm"
import Spinner from "@/components/Spinner"
import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

const EditProductPage = () => {
  const [productDetails, setProductDetails] = useState({
    title: "",
    description: "",
    price: "",
    images: [],
    categoryId: "",
    productProperties: {},
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  //console.log(router)
  const { id } = router.query // console.log router, there is a query property

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const { data } = await axios.get("/api/products?id=" + id)
        setIsLoading(false)

        const {
          title,
          description,
          price,
          images,
          categoryId,
          productProperties,
        } = data
        setProductDetails({
          title,
          description,
          price,
          images,
          categoryId,
          productProperties,
        })

        // console.log('ee ',categoryId)
      } catch (err) {
        console.log(err)
      }
    }
    if (!id) return
    setIsLoading(true)
    getProductDetails()
  }, [id])

  //console.log(id)
  return (
    <Layout>
      <h1>Edit Product</h1>

      {isLoading ? (
        <Spinner fullWidth={true} />
      ) : productDetails ? (
        <ProductForm
          productDetails={productDetails}
          setProductDetails={setProductDetails}
          id={id}
        />
      ) : (
        ""
      )}
    </Layout>
  )
}

export default EditProductPage
