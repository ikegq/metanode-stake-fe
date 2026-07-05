import { stakeAbi } from "@/abis/stake"
import { getContract } from "@/utils/contractHelper"
import { StakeContractAddress } from "@/utils/env"
import { useMemo } from "react"
import { Abi, Address } from "viem"
import { useChainId, useWalletClient } from "wagmi"

type UseContractOptions = {
  chainId?: number
}

export function useContract<TAbi extends Abi>(addressOrAddressMap: Address | { [chainId: number]: Address }, abi?: TAbi, options?: UseContractOptions) {
  const currentChainId = useChainId()
  const chainId = options?.chainId || currentChainId
  const { data: walletClient } = useWalletClient()

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null
    let address: Address | undefined
    if (typeof addressOrAddressMap === "string") {
      address = addressOrAddressMap
    } else {
      address = addressOrAddressMap[chainId]
    }
    if (!address) return null
    try {
      return getContract({ abi, address, chainId, signer: walletClient })
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, abi, chainId, walletClient])
}

export const useStakeContract = () => {
  return useContract(StakeContractAddress, stakeAbi)
}