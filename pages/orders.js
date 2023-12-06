import Layout from "@/components/Layout"
import axios from "axios"
import React, { useContext, useEffect, useState } from "react"
import { RevealWrapper } from "next-reveal"
import Spinner from "@/components/Spinner"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [orderLoading, setOrderLoading] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/orders")
        setOrderLoading(false)
        setOrders(data)
      } catch (err) {
        console.error("issues with fetch orders", err)
      }
    }
    setOrderLoading(true)
    fetchOrders()
  }, [])

  return (
    <Layout>
      <h1>ORDERS</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
            <th>Order Total</th>
          </tr>
        </thead>
        {orderLoading ? (
          <Spinner fullWidth={true} />
        ) : (
          <tbody>
            {orders.length > 0 &&
              orders?.map((order, index) => {
                const {
                  _id,
                  line_items,
                  name,
                  email,
                  city,
                  postalCode,
                  country,
                  streetAddr1,
                  paid,
                } = order
                let total = 0

                return (
                  <tr key={_id}>
                    {/* <td>{order.createdAt?.replace("T", " ").substring(0, 19)}</td> */}
                    <td>
                      <RevealWrapper key={index} delay={index * 50}>
                        {new Date(order.createdAt).toLocaleString()}
                      </RevealWrapper>
                    </td>
                    <td className={paid ? "text-green-700" : "text-blue-700"}>
                      <RevealWrapper key={index} delay={index * 50}>
                        {paid ? "YES" : "NO"}
                      </RevealWrapper>
                    </td>
                    <td>
                      <RevealWrapper key={index} delay={index * 50}>
                        {name} {email} <br />
                        {city} {postalCode} <br />
                        {country} <br />
                        {streetAddr1} <br />
                      </RevealWrapper>
                    </td>
                    <td>
                      <RevealWrapper key={index} delay={index * 50}>
                        {line_items.map((line) => {
                          const { quantity, price_data } = line
                          const { currency, product_data, unit_amount } =
                            price_data
                          const unit_total = (quantity * unit_amount) / 100
                          total += unit_total
                          return (
                            <>
                              {product_data.name} X {quantity}, price:$
                              {unit_total};<br />
                            </>
                          )
                        })}
                      </RevealWrapper>
                    </td>
                    <td>
                      <RevealWrapper key={index} delay={index * 50}>
                        ${total}
                      </RevealWrapper>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        )}
      </table>
    </Layout>
  )
}

export default Orders
