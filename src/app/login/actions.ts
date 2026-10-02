"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Login Error:", error.message)
    return redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  // Check if onboarding is needed
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("arc_start_date")
      .eq("id", user.id)
      .single()

    if (!profile?.arc_start_date) {
      return redirect("/onboarding")
    }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      }
    }
  })

  if (error) {
    console.error("Signup Error:", error.message)
    return redirect(`/signup?message=${encodeURIComponent(error.message)}`)
  }

  // If email confirmation is disabled, signUp will return a session
  if (data.session) {
    return redirect("/onboarding")
  }

  redirect("/login?message=Check email to continue sign in process")
}

export async function signInWithMagicLink(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // should point to our auth callback route
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    console.error("Magic Link Error:", error.message)
    return redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  return redirect("/login?message=Check your email for the magic link")
}
