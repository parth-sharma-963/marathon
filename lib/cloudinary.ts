import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        public_id: `forms/${Date.now()}-${filename}`,
        folder: 'form-builder',
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result?.secure_url || '')
      }
    )

    uploadStream.end(file)
  })
}

export function getCloudinarySignature(timestamp: number): { signature: string; timestamp: number } {
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
    },
    process.env.CLOUDINARY_API_SECRET || ''
  )

  return { signature, timestamp }
}
