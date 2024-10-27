"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from '@/utils/supabase/client'
import { toast } from "sonner"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [step, setStep] = React.useState<"email" | "password">("email")
  const [emailError, setEmailError] = React.useState("")
  const supabase = createClient()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  async function onEmailSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }
    setEmailError("")
    setIsLoading(true)

    try {
      const { data } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })
      setStep("password")
    } catch (error) {
      toast.error("Error verifying email")
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function onPasswordSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast.success("Logged in successfully!")
      router.refresh()
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  async function signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      })
      console.log(data);
      if (error) {
        throw error
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google")
    }
  }

  function onBackToEmail() {
    setStep("email")
    setPassword("")
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {step === "email" ? (
        <form onSubmit={onEmailSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p className="text-sm text-red-500 mt-1">{emailError}</p>
              )}
            </div>
            <Button disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Continue with Email
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={onPasswordSubmit}>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onBackToEmail}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                ← Back
              </button>
              <span className="text-sm text-muted-foreground">{email}</span>
            </div>
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                placeholder="Enter your password"
                type="password"
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </div>
        </form>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button 
        variant="outline" 
        type="button" 
        disabled={isLoading}
        onClick={signInWithGoogle}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  )
}