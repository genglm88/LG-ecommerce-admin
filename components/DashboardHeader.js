import { useSession } from "next-auth/react"

const  DashboardHeader= ()=> {
  const { data: session } = useSession()
  if (!session) return
  return (
      <div className="text-blue-900 flex justify-between items-center">
        <h2 className="mt-0">Hello, <b>{session?.user?.name}</b></h2>
        <div className="flex gap-1 bg-blue-100 items-center rounded-2xl overflow-hidden px-2 py-2">
          <img src={session?.user?.image} alt="user" className="w-6 h-6"/>
          <span className="px-2 hidden sm:block">{session.user.name}</span>
        </div>
      </div>
  
  )
}

export default DashboardHeader