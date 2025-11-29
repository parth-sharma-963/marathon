import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          public_id: `forms/${Date.now()}-${file.name}`,
          folder: 'form-builder',
        },
        (error, result) => {
          if (error) {
            resolve(
              NextResponse.json(
                { error: 'Upload failed' },
                { status: 500 }
              )
            )
          } else {
            resolve(
              NextResponse.json({
                url: result?.secure_url,
              })
            )
          }
        }
      )

      uploadStream.end(buffer)
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
