import Layout from "@/components/Layout"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { withSwal } from "react-sweetalert2"
import Spinner from "@/components/Spinner"
import { RevealWrapper } from "next-reveal"

const AdminsPage = ({ swal }) => {
  const { data: session } = useSession()
  const [email, setEmail] = useState("")
  const [adminUsers, setAdminUsers] = useState([])
  const [isLoading, setIsloading] = useState(false)
  const [ref, setRef] = useState("false")
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post("/api/admin", { email })
      swal.fire({
        title: "Admin created!",
        icon: "success",
      })
      setRef((prev) => !prev)
      setEmail("")
    } catch (err) {
      setEmail("")
      swal.fire({
        title: "Error!",
        text: "The email " + email + err.response.data.message,
        icon: "error",
      })

      console.error("Error posting the admin email.", err)
    }
  }

  const handleDelete = async (id, email) => {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${email} ?`,
        showCancelButton: true,
        cancelButtonText: "Cancel?",
        confirmButtonText: "Yes, delete!",
        confirmButtonColor: "#d55",
        reverseButton: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete("/api/admin?id=" + id)
            setRef((prev) => !prev)
          } catch (err) {
            console.error("Error deleting...", err)
          }
        }
      })
  }

  useEffect(() => {
    const getAllAdmins = async () => {
      try {
        const { data } = await axios.get("/api/admin")
        setIsloading(false)
        setAdminUsers(data)
      } catch (err) {
        console.error("Error with loading Admins", err)
      }
    }
    setIsloading(true)
    getAllAdmins()
  }, [session, ref])

  return (
    <Layout>
      <h1>Admins</h1>

      <h2>Add new admin</h2>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="goole email"
        />
        <button type="submit" className="btn-primary whitespace-nowrap">
          Add admin
        </button>
      </form>

      <h2>Existing admins</h2>
      <table className="basic">
        <thead>
          <tr>
            <th>Admin google email</th>
            <th>Created at</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <Spinner fullWidth={true} />
          ) : adminUsers.length > 0 ? (
            adminUsers?.map((admin, index) => {
              const { _id, email, createdAt } = admin
              return (
                <tr key={_id}>
                  <td>
                    {" "}
                    <RevealWrapper key={index} delay={index * 50}>
                      {email}
                    </RevealWrapper>
                  </td>
                  <td>
                    {" "}
                    <RevealWrapper key={index} delay={index * 50}>
                      <time>
                        {createdAt &&
                          new Date(createdAt).toLocaleString("sv-US")}
                      </time>
                    </RevealWrapper>
                  </td>
                  <td>
                    <RevealWrapper key={index} delay={index * 50}>
                      <button
                        className="btn-primary"
                        onClick={() => {
                          handleDelete(_id, email)
                        }}
                      >
                        Delete
                      </button>
                    </RevealWrapper>
                  </td>
                </tr>
              )
            })
          ) : (
            ""
          )}
        </tbody>
      </table>
    </Layout>
  )
}

export default withSwal(({ swal }, ref) => <AdminsPage swal={swal} />)
