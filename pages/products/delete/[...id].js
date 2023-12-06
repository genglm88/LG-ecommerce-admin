import Layout from "@/components/Layout"
import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

const DeleteProductPage = () => {
  const [productDetails, setProductDetails] = useState({})
  const router = useRouter()
  //console.log(router)
  const { id } = router.query // console.log router, there is a query property

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const { data } = await axios.get("/api/products?id=" + id)
        setProductDetails(data)
      } catch (err) {
        console.log(err)
      }
    }
    if (!id) return

    getProductDetails()
  }, [id])

  const goBackToProcuctsPage = () => {
    router.push("/products")
  }

  const handleDelete = async () => {
    try {
      await axios.delete('/api/products?id=' + id)
    } catch (err) {
      console.log(err)
    }
    router.push("/products")
  }
  return (
    <Layout>
      <h1>
        Do you Really want to delete{" "}
        <span className="font-bold">&quot;{productDetails?.title}&quot;</span>?
      </h1>
      <div className="flex gap-4 items-center">
        <button className="btn-red" onClick={handleDelete}>
          Yes
        </button>
        <button className="btn-default" onClick={goBackToProcuctsPage}>
          No
        </button>
      </div>
    </Layout>
  )
}

export default DeleteProductPage
