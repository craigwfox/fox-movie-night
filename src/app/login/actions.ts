'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/src/utils/supabase/server'

export async function login(formData: FormData) {
	const supabase = await createClient()

	const data = {
		email: formData.get('email') as string,
		options: {
			emailRedirectTo: `${process.env.NEXT_LOGIN_REDIRECT}/auth/callback`,
		},
	}

	const { error } = await supabase.auth.signInWithOtp(data)

	if (error) {
		redirect('/error')
	}

	revalidatePath('/', 'layout')
	redirect('/')
}
