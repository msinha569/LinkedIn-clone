import { Image, Loader } from 'lucide-react'
import React, { useState } from 'react'
import { usePosts } from '../services/usePosts'

const PostCreation = ({user}) => {
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const {createPostMutation,pendingPostCreation:isPending} = usePosts()

  const handlePostCreation = async() => {
    try {
      const postData = {content}
      
      if (image){
        const result = await readFileAsDatURL(image)
        postData.image = result
      }
      await createPostMutation(postData)
      resetForm()
    } catch (error) {
      console.log("error in post creation: ",error);
    }
  }
  const readFileAsDatURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const resetForm = () => {
    setContent('')
    setImage(null)
    setPreviewImage(null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
    if (file)
      readFileAsDatURL(file).then(setPreviewImage)
    else
      setPreviewImage(null)
  }

  return (
    <div className='bg-secondary space-y-4 rounded-lg shadow mb-4 p-4'>
        <div className='flex gap-3 '>
          <img 
          className='w-12 h-12'
          src={user?.profilePicture || '/avatar.png'}/>
          <textarea
            placeholder='What is on your mind?'
            className='w-full bg-base-100 p-2  rounded-lg hover:bg-base-300 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]'
            value={content}
            onChange={(e) => setContent(e.target.value)}/>
        </div>

        {
          previewImage && (
            <div className='mt-4'>
              <img src={previewImage} className='w-full h-auto rounded-lg cursor-pointer'/>
              <div className='text-red-500' onClick={() => {setPreviewImage(null);setImage(null)}}>Remove Image</div>
            </div>
          )
        }

        <div className='flex justify-between'>
            <div>
              <label className='flex items-center px-4 py-2 text-info hover:text-primary transition-colors duration-200 cursor-pointer'>
              <Image size={20} className='mr-2'/>
              <span>Photo</span>
              <input type='file' accept='image/*' className='hidden' onChange={handleImageChange}/>
              </label>
            </div>
            <button 
     					className='bg-primary text-white rounded-lg px-4 py-2 hover:bg-blue-700 cursor-pointer transition-colors duration-200'
             
              onClick={handlePostCreation}>
                {isPending ? <Loader className='size-5 animate-spin'/> : "Share"}
              </button>
        </div>
    </div>
  )
}

export default PostCreation
