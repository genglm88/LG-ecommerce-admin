import Layout from "@/components/Layout"
import ProductForm from "@/components/ProductForm"
import axios from "axios"
import { useRouter } from "next/router"
import React, { useState } from "react"

const NewProduct = () => {
  const [productDetails, setProductDetails] = useState({
    title: "",
    description: "",
    price: "",
    images:[],
    categoryId:'',
    productProperties:{},
  })

  return (
    <Layout>
      <h1>New Product</h1>
      <ProductForm
        productDetails={productDetails}
        setProductDetails={setProductDetails}
      />
    </Layout>
  )
}

export default NewProduct
