import Layout from "@/components/Layout"
import Spinner from "@/components/Spinner"
import axios from "axios"
import React, { useState, useEffect } from "react"
import { withSwal } from "react-sweetalert2"
import { RevealWrapper } from "next-reveal"

const Categories = ({ swal }) => {
  const [categoryName, setCategoryName] = useState("")
  const [categories, setCategories] = useState([])
  const [parentCategory, setParentCategory] = useState("")
  const [editedCategory, setEditedCategory] = useState(null)
  const LISTOFPARENTCATEGORY = ["phone", "smart watch", "smart tag", "ear plug"]
  const [properties, setProperties] = useState([])
  const [categoryLoading, setCategoryLoading] = useState(false)

  useEffect(() => {
    setCategoryLoading(true)
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/categories")
      setCategoryLoading(false)
      setCategories(data)
    } catch (err) {
      console.log(err)
    }
  }
  const saveCategory = async (e) => {
    e.preventDefault()
    if (parentCategory === "") setParentCategory(undefined)
    try {
      if (editedCategory) {
        const { _id } = editedCategory
        await axios.put("/api/categories", {
          categoryName,
          parentCategory: parentCategory === "" ? undefined : parentCategory,
          properties: properties.map((property) => ({
            name: property.name,
            value: property.value.split(","),
          })),
          _id,
        })
        setEditedCategory(null)
      } else if (categoryName) {
        await axios.post("/api/categories", {
          categoryName,
          parentCategory: parentCategory === "" ? undefined : parentCategory,
          properties: properties.map((property) => ({
            name: property.name,
            value: property.value.split(","),
          })),
        })
      }
      setCategoryName("")
      setParentCategory("")

      fetchCategories()
    } catch (err) {
      console.log(err)
    }
  }
  const editCategory = async (category) => {
    setEditedCategory(category)
    const { _id: id, categoryName, parentCategory, properties } = category
    setCategoryName(categoryName)
    setParentCategory(parentCategory?._id) // parent can be an object ( because of the propogate)
    setProperties(
      properties.map(({ name, value }) => ({ name, value: value.join(",") }))
    )
  }

  const deleteCategory = ({ _id, categoryName }) => {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${categoryName} ?`,
        showCancelButton: true,
        cancelButtonText: "Cancel?",
        confirmButtonText: "Yes, delete!",
        confirmButtonColor: "#d55",
        reverseButton: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete("/api/categories?id=" + _id)
            fetchCategories()
          } catch (err) {
            console.err(err)
          }
        }
      })
  }

  const addProperty = () => {
    setProperties((prev) => [...prev, { name: "", value: "" }])
  }

  const handlePropertyNameChange = (property, index, newName) => {
    //console.log(property, index, newName)
    setProperties((prev) => {
      const properties = [...prev]
      properties[index].name = newName
      return properties
    })
    //console.log(properties)
  }

  const handleValueChange = (property, index, newValue) => {
    setProperties((prev) => {
      const properties = [...prev]
      properties[index].value = newValue
      return properties
    })
  }

  const deleteProperties = (index) => {
    setProperties((prev) => {
      const properties = [...prev]
      properties.splice(index, 1)
      return properties
    })
  }
  const handleCancel = () => {
    setEditedCategory(null)
    setCategoryName("")
    setParentCategory("")
  }

  if (!categories) return

  return (
    <Layout>
      <h1 className="text-primary ">Categories</h1>
      {editedCategory ? (
        <label>
          Edit category{" "}
          <span className="font-bold text-primary">
            {editedCategory?.categoryName}
          </span>
        </label>
      ) : (
        <label>New category name</label>
      )}
      <form onSubmit={saveCategory} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            name="categoryName"
            value={categoryName}
            placeholder={"Category name"}
            onChange={(e) => {
              setCategoryName(e.target.value)
            }}
            className="mb-0"
          />
          <select
            onChange={(e) => setParentCategory(e.target.value)}
            value={parentCategory}
            className="mb-0"
          >
            <option value="">No parent category</option>
            {categories?.map((category, index) => {
              return (
                <option key={index} value={category._id}>
                  {category.categoryName}
                </option>
              )
            })}
          </select>
        </div>
        {categoryName && (
          <div className="flex flex-col gap-2 mt-4">
            <label>Properties</label>
            <button
              type="button"
              onClick={addProperty}
              className="btn-default w-48"
            >
              Add new properties
            </button>
            {properties?.length > 0 &&
              properties.map((property, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={property.name}
                    placeholder="Propety name (example: color)"
                    onChange={(e) =>
                      handlePropertyNameChange(property, index, e.target.value)
                    }
                  />
                  <input
                    value={property.value}
                    placeholder="values, comma separated"
                    onChange={(e) => {
                      handleValueChange(property, index, e.target.value)
                    }}
                  />
                  <button
                    onClick={() => deleteProperties(index)}
                    type="button"
                    className="btn-default flex gap-1 items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              ))}
            <div className="flex gap-2 mt-4">
              {editedCategory && (
                <button
                  type="button"
                  className="px-4 py-1 rounded-xl bg-primary text-blue-50"
                  onClick={handleCancel}
                >
                  Cancle
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-1 rounded-xl bg-primary text-blue-50 "
              >
                Save
              </button>
            </div>
          </div>
        )}
      </form>
      {!editedCategory && (
        <table className="basic mt-6">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
              <td></td>
            </tr>
          </thead>
          {categoryLoading ? (
            <Spinner fullWidth={true} />
          ) : (
            <tbody>
              {categories?.map((category, index) => {
                const { _id, categoryName, parentCategory } = category
                return (
                  <tr key={_id} className="">
                    <td>
                      {" "}
                      <RevealWrapper key={index} delay={index * 50}>
                        {categoryName}
                      </RevealWrapper>
                    </td>
                    <td>
                      <RevealWrapper key={index} delay={index * 50}>
                        {parentCategory?.categoryName}
                      </RevealWrapper>
                    </td>
                    <td className="flex gap-4">
                      <RevealWrapper key={index} delay={index * 50}>
                        <div
                          onClick={() => editCategory(category)}
                          className="btn-table"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                          Edit
                        </div>
                      </RevealWrapper>
                      <RevealWrapper key={index} delay={index * 50}>
                        <div
                          onClick={() => deleteCategory(category)}
                          className="btn-table"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                          Delete
                        </div>
                      </RevealWrapper>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          )}
        </table>
      )}
      <div className="flex gap-4 flex-wrap"></div>
    </Layout>
  )
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />)
