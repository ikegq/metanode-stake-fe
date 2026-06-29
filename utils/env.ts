import { Address, zeroAddress } from "viem";

export const StakeContractAddress = process.env.NEXT_PUBLIC_STAKE_ADDRESS as Address || zeroAddress

export const ProjectId = process.env.NEXT_PUBLIC_PROJECT_ID || ''