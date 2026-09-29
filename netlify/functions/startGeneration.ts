import fetch from 'node-fetch'
import FormData from 'form-data'
import { firestore } from './firebaseAdmin'

export const handler = async (event) => {
  console.log('startGeneration called')
  console.log('Raw event.body:', event.body)

  try {
    const { drawingId, imageUrl } = JSON.parse(event.body || '{}')
    console.log('Parsed payload:', { drawingId, imageUrl })

    if (!drawingId || !imageUrl) {
      console.error('Missing drawingId or imageUrl')
      return { statusCode: 400, body: 'Missing params' }
    }

    // 1️⃣ Request init-image upload
    const initRes = await fetch(
      'https://cloud.leonardo.ai/api/rest/v1/init-image',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.LEONARDO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ extension: 'webp' }),
      }
    )

    const initData = await initRes.json()
    console.log(
      'Leonardo init-image response:',
      JSON.stringify(initData, null, 2)
    )

    const upload = initData?.uploadInitImage
    if (!upload?.id || !upload?.url || !upload?.fields) {
      console.error('Invalid init-image response', initData)
      return { statusCode: 500, body: 'Invalid init-image response' }
    }

    // 2️⃣ Upload image to Leonardo S3
    const imageRes = await fetch(imageUrl)
    const buffer = await imageRes.arrayBuffer()

    const fields = JSON.parse(upload.fields)
    const form = new FormData()
    Object.entries(fields).forEach(([k, v]) => form.append(k, v as string))
    form.append('file', Buffer.from(buffer))

    const uploadRes = await fetch(upload.url, {
      method: 'POST',
      headers: form.getHeaders(),
      body: form,
    })

    if (!uploadRes.ok) {
      const t = await uploadRes.text()
      console.error('Upload to Leonardo failed', t)
      return { statusCode: 500, body: 'Upload failed' }
    }

    // 3️⃣ Generate image using V2 API (Nano Banana)
    const genRes = await fetch(
      'https://cloud.leonardo.ai/api/rest/v2/generations',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.LEONARDO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemini-2.5-flash-image',
          parameters: {
            width: 0,
            height: 0,
            prompt: `
Redraw and improve this sketch.
Use the sketch only as a rough guide, not as the final result.
Reinterpret the shape cleanly and more beautifully.
You may change line placement and proportions slightly to improve aesthetics.
Keep the same general idea and subject, but redraw it better.

Make it clean, smooth, balanced and visually pleasing.

If the drawing is very simple or abstract, turn it into a polished minimal abstract illustration inspired by the sketch.
          `.trim(),
            quantity: 1,
            guidances: {
              image_reference: [
                {
                  image: { id: upload.id, type: 'UPLOADED' },
                  strength: 'MID',
                },
              ],
            },
            style_ids: ['111dc692-d470-4eec-b791-3475abac4c46'],
            prompt_enhance: 'OFF',
          },
          public: false,
        }),
      }
    )

    const genData = await genRes.json()
    console.log(
      'Leonardo generation response:',
      JSON.stringify(genData, null, 2)
    )

    const generationId = genData?.generate?.generationId

    if (!generationId) {
      console.error(
        'No generationId from Leonardo',
        JSON.stringify(genData, null, 2)
      )
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'No generationId from Leonardo' }),
      }
    }

    console.log('Saving generationId to Firestore:', generationId)

    await firestore.collection('drawings').doc(drawingId).update({
      leonardoJobId: generationId,
      aiStatus: 'processing',
    })

    return { statusCode: 200, body: JSON.stringify({ success: true }) }
  } catch (e) {
    console.error('startGeneration error FULL:', e)
    return { statusCode: 500, body: 'Internal Server Error' }
  }
}
