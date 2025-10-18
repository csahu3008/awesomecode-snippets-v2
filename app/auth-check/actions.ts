'use server';
import { signIn } from 'next-auth/react';
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    console.log('formData',formData)
    await signIn('Credentials', {...formData});
  } catch (error) {
    // if (error instanceof ) {
    //   switch (error.type) {
    //     case 'CredentialsSignin':
    //       return 'Invalid credentials.';
    //     default:
    //       return 'Something went wrong.';
    //   }
    // }
    // throw error;
    console.log("Errdddor",error)
  }
}