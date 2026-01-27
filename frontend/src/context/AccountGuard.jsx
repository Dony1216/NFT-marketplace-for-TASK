import { useAccount, useDisconnect } from "wagmi"
import { useEffect, useRef } from "react"

export default function AccountGuard({ children }) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const prevAddressRef = useRef(address)

  useEffect(() => {
    // first load
    if (!prevAddressRef.current) {
      prevAddressRef.current = address
      return
    }

    // account changed
    if (address && prevAddressRef.current !== address) {
      disconnect()
    }

    prevAddressRef.current = address
  }, [address, disconnect])

  if (!isConnected) return children

  return children
}
