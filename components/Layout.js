import Nav from "@/components/Nav"
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"
import Logo from "./Logo"

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false)
  const { data: session } = useSession()
  if (!session) {
    return (
      <div className="bg-primary w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button
            onClick={() => signIn("google")}
            className="bg-gray-50 p-2 px-4 rounded-lg"
          >
            Login with Google
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className=" flex items-center mb-2 mt-1 gap-2 md:hidden">
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className="flex grow justify-center">
          <Logo />
        </div>
      </div>
      <div className="bg-primary min-h-screen flex">
        <Nav showNav={showNav} />
        <div className="bg-blue-50 flex-grow mt-2 mb-2 mr-2 rounded-lg p-4 ml-2">
          {children}
        </div>
      </div>
    </div>
  )
}
