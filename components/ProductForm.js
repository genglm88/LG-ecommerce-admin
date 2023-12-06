import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/router"

import UploadIcon from "./UploadIcon"
import { ReactSortable } from "react-sortablejs"
import { BeatLoader } from "react-spinners"
import UploadLink from "./UploadLink"
import Spinner from "./Spinner"

const ProductForm = ({ productDetails, setProductDetails, id = null }) => {
  const {
    title,
    description,
    price,
    images,
    categoryId: assignedCategoryId,
    productProperties: pickedProductProperties,
  } = productDetails
  const [redirectToProductsPage, setRedirectToProductsPage] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isLinkUploading, setIsLinkUploading] = useState(false)

  const [picLink, setPicLink] = useState("")
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState("" || assignedCategoryId)
  const [productProperties, setProductProperties] = useState(
    pickedProductProperties || {}
  )
  //console.log("cid ", assignedCategoryId)
  const [categoryLoading, setCategoryLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const { data } = await axios.get("/api/categories")
        setCategoryLoading(false)
        setCategories(data)
        setCategoryId(assignedCategoryId)
        setProductProperties(pickedProductProperties)
      } catch (err) {
        console.err(err)
      }
    }
    setCategoryLoading(true)
    getAllCategories()
  }, [assignedCategoryId, pickedProductProperties])

  const handleChange = (e) => {
    const { name, value } = e.target
    //console.log(e.target)
    setProductDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (id) {
        await axios.put("/api/products/", {
          ...productDetails,
          categoryId,
          productProperties,
          id,
        })
      } else {
        await axios.post("/api/products", {
          ...productDetails,
          categoryId,
          productProperties,
        })
      }
    } catch (err) {
      console.log(err)
    }
    setRedirectToProductsPage(true)
  }

  if (redirectToProductsPage) {
    router.push("/products")
  }

  const uploadImages = async (e) => {
    //console.log(e.target.files.length)
    const files = e.target?.files
    if (files?.length > 0) {
      setIsUploading(true)
      const data = new FormData()
      for (const file of files) {
        data.append("file", file)
      }

      try {
        const { data: filenames } = await axios.post("/api/upload", data, {
          headers: { "Content-type": "multipart/form-data" },
        })

        // console.log("link ", filenames)

        setProductDetails((prev) => ({
          ...prev,
          images: [...images, ...filenames],
        }))
        setIsUploading(false)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const uploadImageByLink = async (e) => {
    e.preventDefault()

    if (picLink) {
      setIsLinkUploading(true)
      try {
        const { data: filename } = await axios.post("/api/upload-by-link", {
          picLink,
        })
        setProductDetails((prev) => ({
          ...prev,
          images: [...images, filename],
        }))
        setIsLinkUploading(false)
        setPicLink("")
      } catch (err) {
        console.log(err)
      }
    }
  }

  const updateImagesOrder = (images) => {
    setProductDetails((prev) => ({ ...prev, images }))
  }

  //ßif (!categories) return
  //if (assignedCategoryId && !categoryId) setCategoryId(assignedCategoryId)

  let productPropertyOptions = []

  let pickedCategory = categories.find(({ _id }) => _id === categoryId)
  //console.log(pickedCategory)
  if (pickedCategory) {
    const { properties, parentCategory } = pickedCategory

    //productProperties = [...productProperties, properties]
    productPropertyOptions.push(...properties)
    while (pickedCategory.parentCategory?._id) {
      const { properties: parentProperties } = parentCategory
      if (parentProperties) productPropertyOptions.push(...parentProperties)
      pickedCategory = parentCategory
    }
  }

  //pickedCategory ?  setProperties(pickedCategory.properties) : setProperties([])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label>
        Product name
        <input
          type="text"
          placeholder="product name"
          value={title}
          name="title"
          onChange={handleChange}
        />
      </label>
      <label>
        Category
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">No category selected</option>
          {categories?.map((category, index) => (
            <option key={index} value={category._id}>
              {category.categoryName}
            </option>
          ))}
        </select>
      </label>
      {categoryLoading ? (
        <Spinner fullWidth={true} />
      ) : productPropertyOptions.length > 0 &&
        productPropertyOptions[0].name !== "" ? (
        <div>
          <h2>Properties</h2>
          <table className="basic">
            <thead>
              <tr>
                <td>property name</td>
                <td>Property values</td>
              </tr>
            </thead>
            <tbody>
              {productPropertyOptions.map((property, index) => {
                const { name, value } = property
                return (
                  <tr key={index}>
                    <td className="capitalize">{name}</td>
                    <td>
                      <select
                        name={name}
                        value={productProperties ? productProperties[name] : {}}
                        onChange={(e) => {
                          setProductProperties((prev) => ({
                            ...prev,
                            [name]: e.target.value,
                          }))
                        }}
                      >
                        <option value={""}> {"Select one:"} </option>
                        {value.map((v, index) => (
                          <option key={index} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div></div>
        </div>
      ) : (
        ""
      )}

      <label>
        Photos
        <div className="flex gap-4 flex-wrap  items-center">
          {!images?.length ? (
            <div className="flex flex-col  gap-4">
              No photos in this product
              <UploadIcon uploadImages={uploadImages} />
              <UploadLink
                uploadImageByLink={uploadImageByLink}
                picLink={picLink}
                setPicLink={setPicLink}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <ReactSortable
                list={images}
                setList={updateImagesOrder}
                className="flex gap-2 flex-wrap mt-4"
              >
                {images?.map((image) => (
                  <div
                    key={image}
                    className="shadow-lg border border-blue-200 rounded-lg"
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </ReactSortable>
              {isLinkUploading ? (
                <BeatLoader color="#36d7b7" />
              ) : (
                <UploadLink
                  uploadImageByLink={uploadImageByLink}
                  picLink={picLink}
                  setPicLink={setPicLink}
                />
              )}
              {isUploading ? (
                <div className="cursor-pointer w-48 h-48 flex items-center  justify-center gap-1 bg-blue-100 rounded-lg">
                  <BeatLoader color="#36d7b7" />
                </div>
              ) : (
                <div>
                  <UploadIcon uploadImages={uploadImages} />
                </div>
              )}
            </div>
          )}
        </div>
      </label>

      <label>
        Description
        <textarea
          placeholder="description"
          value={description}
          name="description"
          onChange={handleChange}
        ></textarea>
      </label>

      <label>
        Price (in USD)
        <input
          type="text"
          placeholder="price"
          value={price}
          name="price"
          onChange={handleChange}
        />
      </label>

      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  )
}

export default ProductForm
