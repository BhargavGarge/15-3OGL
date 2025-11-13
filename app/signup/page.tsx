import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { SignupForm } from "@/components/signup-form"

export default async function SignupPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <SignupForm />
    </div>
  )
}
