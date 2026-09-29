import { firestore } from './firebaseAdmin'

export const handler = async (event) => {
  try {
    const payload = JSON.parse(event.body || '{}')

    if (payload.type !== 'image_generation.complete') {
      return { statusCode: 200 }
    }

    const generation = payload.data?.object
    const generationId = generation?.id
    const imageUrl = generation?.images?.[0]?.url

    if (!generationId || !imageUrl) {
      console.error('Invalid webhook payload', payload)
      return { statusCode: 400 }
    }

    const snap = await firestore
      .collection('drawings')
      .where('leonardoJobId', '==', generationId)
      .limit(1)
      .get()

    if (snap.empty) {
      console.error('No drawing found for generationId', generationId)
      return { statusCode: 404 }
    }

    await snap.docs[0].ref.update({
      aiUrl: imageUrl,
      aiStatus: 'done',
    })

    return { statusCode: 200 }
  } catch (e) {
    console.error('leonardoWebhook error', e)
    return { statusCode: 500 }
  }
}
