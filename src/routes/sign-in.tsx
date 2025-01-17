import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center bg-cover'>
      <SignIn path="/sign-in" />
    </div>
  )
}