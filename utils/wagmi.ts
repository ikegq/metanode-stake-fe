import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { ProjectId } from "./env";
import { sepolia } from "viem/chains";
import { http } from "viem";

export const config = getDefaultConfig({
  appName: 'Meta Node Stake',
  projectId: ProjectId,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://sepolia.infura.io/v3/14d2cc72dff047159242fc64bdb865b1'),
  },
  ssr: true,
});

export const defaultChainId: number = sepolia.id;