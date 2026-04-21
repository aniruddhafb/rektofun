'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_appId || ""}
      clientId={process.env.NEXT_PUBLIC_clientId || ""}
      config={{
        // Configure login methods - social logins + wallet
        loginMethods: ['google', 'twitter', 'wallet', 'email'],

        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets'
          },
          solana: {
            createOnLogin: 'users-without-wallets'
          }
        },

        // Default chain — Solana devnet
        supportedChains: {
          id: 103, // Solana devnet chain ID in Privy
          name: 'Solana Devnet',
          network: 'solana-devnet',
          nativeCurrency: { name: 'SOL', symbol: 'SOL', decimals: 9 },
          rpcUrls: {
            default: {
              http: [process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com'],
            },
          },
        } as any,
      }}
    >
      {children}
    </PrivyProvider>
  );
}
