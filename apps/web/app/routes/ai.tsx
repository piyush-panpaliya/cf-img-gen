import { ActionFunctionArgs, json } from '@remix-run/cloudflare'
import { Form, useActionData } from '@remix-run/react'

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const prompt = formData.get('prompt') as string
  const errors: { prompt: string | null } = { prompt: null }
  if (!prompt) {
    errors.prompt = 'Prompt is required'
    return json({ erro: errors }, { status: 400 })
  }
  if (prompt.length > 500) {
    errors.prompt = 'Prompt is too long'
    return json({ error: errors }, { status: 400 })
  }
  console.log('prompt:', prompt)
  try {
    console.log(context.cloudflare.env.AI)
    const response = await context.cloudflare.env.AI.run(
      '@cf/bytedance/stable-diffusion-xl-lightning',
      {
        prompt,
        numResults: 1,
      },
    )
    return json({ response }, { status: 200 })
  } catch (error) {
    console.error('Error generating image:', error)
    return json({ error: 'Failed to generate image' }, { status: 500 })
  }
}

const Ai = () => {
  const actionData = useActionData<typeof action>()
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-8 bg-red-500">
      <p className="font-bold text-5xl">lmaooooooo img generation</p>
      <Form method="post" className="flex flex-col gap-4">
        <textarea
          className="min-w-64 min-h-32"
          name="prompt"
          placeholder="prompt"
        />
        <button className="px-4 py-2 bg-blue-500" type="submit">
          Generate
        </button>
      </Form>
      {actionData?.response ? (
        <img src={actionData.response.generatedImageUrl} alt="generated img" />
      ) : actionData?.error ? (
        <p className="text-blue-500">{actionData.error.prompt}</p>
      ) : null}
    </div>
  )
}

export default Ai
