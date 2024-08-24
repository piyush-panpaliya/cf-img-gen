import { json, LoaderFunctionArgs, redirect } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'

export const loader = ({ params }: LoaderFunctionArgs) => {
  if (!params.lmao) return redirect('/')
  return json({ data: params.lmao })
}
export default function Index() {
  const { data } = useLoaderData<typeof loader>()
  return (
    <div className='font-sans p-4'>
      <h1 className='text-3xl'>Welcome to Remix on Cloudflare at {data}</h1>
    </div>
  )
}
