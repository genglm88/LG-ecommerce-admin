import DashboardHeader from "@/components/DashboardHeader"
import DashboardStats from "@/components/DashboardStats"
import Layout from "@/components/Layout"


export default function Home() {
  
  return (
    <Layout>
      <DashboardHeader />
      <DashboardStats />
    </Layout>
  )
}
