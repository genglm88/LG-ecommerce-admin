import React from "react"
import { BeatLoader } from "react-spinners"
import { BounceLoader } from "react-spinners"

const Spinner = ({ fullWidth }) => {
  if (fullWidth) {
    return (
      <div className="w-full flex justify-center mb-8">
        <BeatLoader speedMultiplier={1} color="#36d7b7" />
      </div>
    )
  }
  return <BeatLoader speedMultiplier={1} color="#36d7b7" />
}

export default Spinner
