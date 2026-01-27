import { createConfig } from "wagmi"
import { injected } from "wagmi/connectors"
import { http } from "viem"
import { localhost } from "wagmi/chains"

export const wagmiConfig = createConfig({
  chains: [localhost],
  autoConnect: false,
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [localhost.id]: http("http://127.0.0.1:8545"),
  },
})
