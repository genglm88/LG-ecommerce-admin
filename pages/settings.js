import Layout from "@/components/Layout"
import Spinner from "@/components/Spinner"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { withSwal } from "react-sweetalert2"
import { RevealWrapper } from "next-reveal"

const Settings = ({ swal }) => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [settingLoading, setSettingLoading] = useState(false)
  const [featuredProduct, setFeaturedProduct] = useState("")
  const [devFee, setDevFee] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await axios.put("/api/settings", {
        name: "Featured Product",
        value: featuredProduct,
      })
      setIsLoading(false)
      await swal.fire({
        title: "Featured Product setting updated!",
        icon: "success",
      })
    } catch (err) {
      console.error("Error with submitting Settings", err)
    }
  }

  const handleSubmitDev = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await axios.put("/api/settings", {
        name: "Shipping Fee",
        value: devFee,
      })
      setIsLoading(false)
      await swal.fire({
        title: "Shipping fee setting updated!",
        icon: "success",
      })
    } catch (err) {
      console.error("Error with saving settings.")
    }
  }

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await axios.get("/api/products")
        setProducts(data)
        setIsLoading(false)
      } catch (err) {
        console.error("Error loading products.", err)
      }
    }

    const loadSettings = async () => {
      try {
        const { data } = await axios.get(
          "/api/settings?name=" + "Featured Product"
        )
        setSettingLoading(false)
        setFeaturedProduct(data.value)
      } catch (err) {
        console.error("Error loading settings.", err)
      }
    }

    const loadShippingSettings = async () => {
      try {
        const { data } = await axios.get("/api/settings?name=" + "Shipping Fee")
        setSettingLoading(false)
        setDevFee(data.value)
      } catch (err) {
        console.error("Error loading settings.", err)
      }
    }

    setIsLoading(true)
    loadProducts()

    setSettingLoading(true)
    loadSettings()
    setSettingLoading(true)
    loadShippingSettings()
  }, [])
  return (
    <Layout>
      {isLoading || settingLoading ? (
        <Spinner fullWidth={true} />
      ) : (
        <RevealWrapper>
          <div className="flex flex-col gap-10">
            <form onSubmit={handleSubmit} className="flex flex-col  gap-2">
              <label>Select featured product </label>
              <div className="flex w-full flex-col md:flex-row  items-center justify-center gap-4">
                <select
                  value={featuredProduct}
                  onChange={(e) => setFeaturedProduct(e.target.value)}
                >
                  <option value={""}>No featured product selected</option>
                  {products?.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.title}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="btn-primary w-full md:w-auto whitespace-nowrap"
                >
                  Save featured product
                </button>
              </div>
            </form>
            <form onSubmit={handleSubmitDev} className="flex flex-col  gap-2">
              <label>Shipping price (USD)</label>
              <div className="flex w-full flex-col md:flex-row  items-center justify-center gap-4">
                <input
                  value={devFee}
                  onChange={(e) => setDevFee(e.target.value)}
                  placeholder="Delivery fee"
                />
                <button
                  type="submit"
                  className="btn-primary w-full md:w-auto whitespace-nowrap"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </RevealWrapper>
      )}
    </Layout>
  )
}

export default withSwal(({ swal }, ref) => <Settings swal={swal} />)
