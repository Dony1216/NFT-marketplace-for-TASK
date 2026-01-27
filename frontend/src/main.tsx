import React from 'react'
import AccountGuard from "./context/AccountGuard"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./queryClient"
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from './wagmiClient'
import App from './app/App'
import { NFTProvider } from './context/NFTContext';
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <WagmiProvider config={wagmiConfig}>
      <AccountGuard>
        <BrowserRouter>
          <NFTProvider>
            <App />
          </NFTProvider>
        </BrowserRouter>
      </AccountGuard>
    </WagmiProvider>
  </QueryClientProvider>
)
