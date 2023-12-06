import axios from "axios"
import React, { useEffect, useState } from "react"
import { RevealWrapper } from "next-reveal"
import Spinner from "@/components/Spinner"
import { subHours } from "date-fns"

const DashboardStats = () => {
  const [orders, setOrders] = useState([])

  const [isOrderLoading, setIsOrderLoading] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/orders")
        setIsOrderLoading(false)
        setOrders(data)
      } catch (err) {
        console.error("Error with fetching orders.", err)
      }
    }
    setIsOrderLoading(true)
    fetchOrders()
  }, [])

  const orderTotal = (orders) => {
    let sum = 0
    orders?.forEach((order) => {
      sum += Number(order.totalCost)
    })
    return new Intl.NumberFormat('en-US').format(sum)
  }

  const ordersLast24hrs = orders.filter(
    (order) => new Date(order.createdAt) > subHours(new Date(), 24)
  )
  const ordersWeek = orders.filter(
    (order) => new Date(order.createdAt) > subHours(new Date(), 24 * 7)
  )
  const ordersMonth = orders.filter(
    (order) => new Date(order.createdAt) > subHours(new Date(), 24 * 30)
  )

  return isOrderLoading ? (
    <Spinner fullWidth={true} />
  ) : (
    <RevealWrapper>
      <h2 className="uppercase font-bold text-xl">Orders</h2>
      <div className="tile-grid">
        <div className="tile">
          <h3 className="tile-header">Today</h3>
          <div className="tile-number">{ordersLast24hrs?.length}</div>
          <div className="tile-desc">
            {ordersLast24hrs?.length} orders today
          </div>
        </div>
        <div className="tile">
          <h3 className="tile-header">This week</h3>
          <div className="tile-number">{ordersWeek.length}</div>
          <div className="tile-desc">
          {ordersWeek.length} orders this week
          </div>
        </div>
        <div className="tile">
          <h3 className="tile-header">This month</h3>
          <div className="tile-number">{ordersMonth.length}</div>
          <div className="tile-desc">
          {ordersMonth.length} orders this month
          </div>
        </div>
      </div>

      <h2 className="uppercase font-bold text-xl">Revenue</h2>
      <div className="tile-grid">
        <div className="tile">
          <h3 className="tile-header">Today</h3>
          <div className="tile-number">${orderTotal(ordersLast24hrs)}</div>
          <div className="tile-desc">
            {ordersLast24hrs?.length} orders today
          </div>
        </div>
        <div className="tile">
          <h3 className="tile-header">This week</h3>
          <div className="tile-number">${orderTotal(ordersWeek)}</div>
          <div className="tile-desc">
          {ordersWeek.length} orders this week
          </div>
        </div>
        <div className="tile">
          <h3 className="tile-header">This month</h3>
          <div className="tile-number">${orderTotal(ordersMonth)}</div>
          <div className="tile-desc">
          {ordersMonth.length} orders this month
          </div>
        </div>
      </div>
    </RevealWrapper>
  )
}

export default DashboardStats
