'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkUser()
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      setIsAdmin(profile?.is_admin || false)
    } else {
      setIsAdmin(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="bg-liq-card border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <img src="/images/logo.png" alt="LIQ Logo" className="h-10 w-auto" />
            <span className="text-liq-accent font-bold text-xl hidden sm:block">
              Liberty In Qinya
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link 
              href="/search" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Search
            </Link>

            {isAdmin && (
              <Link 
                href="/admin" 
                className="text-liq-accent hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium"
              >
                Editor
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/admin"
                className="bg-liq-accent hover:bg-yellow-600 text-black px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
