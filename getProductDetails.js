import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useState, useEffect }  from 'react'

const useProductDetails = () => {
  const [productDetails, setProductDetails] = useState({
    title: "",
    description: "",
    price: "",
  })
  const router = useRouter()
  //console.log(router)
  const { id } = router.query // console.log router, there is a query property

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const { data } = await axios.get("/api/products?id=" + id)

        const { title, description, price } = data
        setProductDetails({ title, description, price })
      } catch (err) {
        console.log(err)
      }
    }
    if (!id) return

    getProductDetails()
  }, [id])

  //console.log(id)
}
