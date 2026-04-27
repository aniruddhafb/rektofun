'use client'

import { PhantomProvider, darkTheme, lightTheme, AddressType } from '@phantom/react-sdk'
import { ReactNode } from 'react'

/**
 * Props for the ConnectionProvider component
 */
interface ConnectionProviderProps {
  children: ReactNode
}

/**
 * ConnectionProvider wraps the app with PhantomProvider for wallet connectivity
 *
 * Phantom Connect SDK v1.0.7
 * @see https://docs.phantom.com/sdks/react-sdk
 */
export default function ConnectionProvider({ children }: ConnectionProviderProps) {
  // Debug: Log environment variables (only in development)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('🔧 Environment Check:', {
      appId: process.env.NEXT_PUBLIC_PHANTOM_APP_ID ? '✅ Set' : '❌ Missing',
      rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL ? '✅ Set' : '❌ Missing',
    })
  }

  return (
    <PhantomProvider
      config={{
        // Network support - Solana blockchain
        addressTypes: [AddressType.solana],
        // App ID from Phantom Portal (required for embedded providers)
        appId: process.env.NEXT_PUBLIC_PHANTOM_APP_ID || '',
        // Authentication providers available to users
        // The modal will automatically detect and display available wallets
        providers: [
          'google', // Google OAuth
          'apple', // Apple ID
          'phantom', // Phantom Login
          'injected', // Browser extension + discovered wallets via Wallet Standard
        ],
        // OAuth redirect configuration (required for Google/Apple login)
        authOptions: {
          redirectUrl: process.env.NEXT_PUBLIC_REDIRECT_URL
        },
      }}
      // Theme for built-in modal UI (darkTheme or lightTheme available)
      theme={lightTheme}
      // App branding for the connection modal
      appName="RektoFun"
      // App icon displayed in the modal (optional)
      appIcon="/fav_old.png"
    >
      {children}
    </PhantomProvider>
  )
}