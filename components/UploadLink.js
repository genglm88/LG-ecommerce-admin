import React from 'react'

const UploadLink = ({uploadImageByLink, picLink, setPicLink}) => {
  return (
    <div className="flex gap-2 ">
    <input
      type="text"
      placeholder="Add using a link ...jpg"
      name="picink"
      value={picLink}
      onChange={(e) => setPicLink(e.target.value)}
      className='mb-0'
    />
    <button
      className="bg-primary text-gray-50 rounded-2xl px-8  text-sm"
      onClick={uploadImageByLink}
    >
      Add&nbsp;photo
    </button>
  </div>
  )
}

export default UploadLink