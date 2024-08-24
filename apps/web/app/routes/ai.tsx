import { ActionFunctionArgs, json } from '@remix-run/cloudflare'
import { useState } from 'react'

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const prompt = formData.get('prompt') as string
  const errors = {} as Record<string, string>
  if (!prompt) {
    errors.prompt = 'Prompt is required'
    return json({ error: errors }, { status: 400 })
  }
  if (prompt.length > 500) {
    errors.prompt = 'Prompt is too long'
    return json({ error: errors }, { status: 400 })
  }
  try {
    const response = await context.cloudflare.env.AI.run(
      '@cf/bytedance/stable-diffusion-xl-lightning',
      { prompt },
    )
    return new Response(response, {
      status: 200,
      headers: {
        'Content-Type': 'img/png',
      },
    })
  } catch (error) {
    console.error('Error generating image:', error)
    errors.gen = 'Failed to generate image'
    return json({ error: errors }, { status: 500 })
  }
}

const Ai = () => {
  const [p, sp] = useState('')
  const [i, si] = useState<string | null>(null)

  const getImg = async () => {
    const formData = new FormData()
    formData.append('prompt', p)
    const res = await fetch('/ai?_data=routes%2Fai', {
      method: 'POST',
      body: formData,
    })
    const img = await res.blob()
    console.log(img)
    console.log(URL.createObjectURL(img))
    si(URL.createObjectURL(img))
  }
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-8 bg-red-500">
      <p className="font-bold text-5xl">lmaooooooo img generation</p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          getImg()
        }}
        className="flex flex-col gap-4"
      >
        <textarea
          value={p}
          onChange={(e) => sp(e.target.value)}
          className="min-w-64 min-h-32"
          name="prompt"
          placeholder="prompt"
        />
        <button className="px-4 py-2 bg-blue-500" type="submit">
          Generate
        </button>
      </form>
      {i && <img className="w-[80vw]" src={i} alt="generated img" />}
    </div>
  )
}

export default Ai
