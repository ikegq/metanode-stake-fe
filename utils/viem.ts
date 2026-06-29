import { createPublicClient, http, PublicClient } from "viem";
import { sepolia } from "viem/chains";

export const viemClients = (chainId: number): PublicClient => {
  const clients: { [key: number]: PublicClient } = {
    [sepolia.id]: createPublicClient({
      chain: sepolia,
      transport: http('https://sepolia.infura.io/v3/14d2cc72dff047159242fc64bdb865b1'),
    })
  }
  return clients[chainId];
}