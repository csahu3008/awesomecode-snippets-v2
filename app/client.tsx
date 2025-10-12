'use client';
import { SessionProvider } from "next-auth/react"

const ProviderWrapper = ({children, session})=>{
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}
export default ProviderWrapper;