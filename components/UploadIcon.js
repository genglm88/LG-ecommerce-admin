import React from "react"

const UploadIcon = ({ uploadImages }) => {

  return (
    <div className="flex gap-4 items-center">
      <label className=" text-primary cursor-pointer w-48 h-48 flex items-center  justify-center gap-1 bg-blue-100 rounded-lg text-xl border border-blue-200  shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        <span className="text-xl">Upload</span>
        <input
          type="file"
          multiple
          onChange={uploadImages}
          className="hidden"
        />
      </label>
    </div>
  )
}

export default UploadIcon
