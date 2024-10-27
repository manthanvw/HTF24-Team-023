// app/(protected)/layout.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from '@/components/sign-out'; // Import your SignupButton component
import { Toaster } from 'sonner';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser()
  console.log('data', data)
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="relative min-h-screen"> 
      
      {data?.user && (
        <div className="absolute bottom-4 left-4 z-10"> {/* z-10 for stacking order */}
          <SignOutButton />
        </div>
      )}
      {children}
      <Toaster />
    </div>
  )
}
