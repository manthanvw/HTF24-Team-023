"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createClient } from '@/utils/supabase/client'
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { toast } from "sonner"

interface SignOutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export default function SignOutButton({ 
  variant = "default", 
  size = "default",
  className 
}: SignOutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      
      // First, call your server-side signout route
      const response = await fetch('/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to sign out')
      }

      // Then, sign out on the client side
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }

      // Clear any local storage or state if needed
      localStorage.removeItem('supabase.auth.token')
      
      toast.success("Signed out successfully")
      router.refresh()
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message || "Error signing out")
      console.error("Sign out error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (<>
    <Button
      variant={variant}
      size={size}
      onClick={handleSignOut}
      disabled={isLoading}
      className={className}
    >
      {/* {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <
        // <Icons.logout className="mr-2 h-4 w-4" />
      )} */}
      Sign out
    </Button>
    </>
  )
}