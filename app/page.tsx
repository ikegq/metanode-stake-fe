'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useStakeContract } from '@/hooks/useContract';
import useRewards from '@/hooks/useRewards';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { FiArrowDown, FiTrendingUp, FiZap } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Address, parseUnits, zeroAddress } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useAccount, useBalance, useWalletClient } from 'wagmi';

export default function Home() {
  const stakeContract = useStakeContract();
  const { address, isConnected } = useAccount();
  const { poolData, refresh } = useRewards();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { data } = useWalletClient();

  const isEthPool = useMemo(() => {
    const addr = poolData.stTokenAddress;
    return !addr || addr === zeroAddress || addr === '0x0000000000000000000000000000000000000000';
  }, [poolData.stTokenAddress]);

  const { data: balance, refetch: refetchBalance } = useBalance({
    address: address,
    token: isEthPool ? undefined : (poolData.stTokenAddress as Address | undefined),
    query: {
      enabled: isConnected && (isEthPool || !!poolData.stTokenAddress),
      refetchInterval: 10000,
      refetchIntervalInBackground: false,
    },
  });

  const handleStake = async () => {
    if (!stakeContract || !data) return;
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    const decimals = balance?.decimals ?? 18;
    const amountWei = parseUnits(amount, decimals);

    if (!balance || parseFloat(amount) > parseFloat(balance.formatted)) {
      toast.error('Amount cannot be greater than current balance');
      return;
    }

    try {
      setLoading(true);

      if (isEthPool) {
        const tx = await stakeContract.write.depositETH({ account: data.account, chain: data.chain, value: amountWei });
        const res = await waitForTransactionReceipt(data, { hash: tx });
        if (res.status == 'success') {
          toast.success('Staked successful!');
          setAmount('');
          refetchBalance?.();
          refresh();
          return;
        }
        toast.error('Staked failed!');
      } else {
      }
    } catch (error) {
      toast.error('Transaction failed. Please try again.');
      console.log(error, 'stake-error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-6">
        <div className="inline-block mb-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 rounded-full border-2 border-primary-500/20 flex items-center justify-center shadow-xl"
            style={{ boxShadow: '0 0 60px 0 rgba(14,165,233,0.15)' }}>
            <FiZap className="w-12 h-12 text-primary-500" />
          </motion.div>
        </div>
        <h1 className="text-4xl font-bold bg-linear-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent mb-2">MetaNode Stake</h1>
        <p className="text-gray-400 text-xl">Stake ETH to earn tokens</p>
      </motion.div>

      {/* Stake Card */}
      <Card className="min-h-105 p-4 sm:p-8 md:p-12 bg-linear-to-br from-gray-800/80 to-gray-900/80 shadow-2xl border-primary-500/20 border-[1.5px] rounded-2xl sm:rounded-3xl">
        <div className="space-y-8 sm:space-y-12">
          {/* Staked Amount Display */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-4 sm:p-8 bg-gray-800/70 rounded-xl sm:rounded-2xl border border-gray-700/50 group-hover:border-primary-500/50 transition-colors duration-300 shadow-lg">
            <div className="shrink-0 flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 bg-primary-500/10 rounded-full">
              <FiTrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-primary-400" />
            </div>
            <div className="flex flex-col justify-center flex-1 min-w-0 items-center sm:items-start">
              <span className="text-gray-400 text-base sm:text-lg mb-1">Staked Amount</span>
              <span className="text-3xl sm:text-5xl sm:leading-none font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent leading-tight break-all">
                {parseFloat(poolData.stTokenAmount || '0').toFixed(4)} {isEthPool ? 'ETH' : 'Token'}
              </span>
            </div>
          </div>

          {/* Input Field */}
          <div className="space-y-4 sm:space-y-6">
            <Input
              label="Amount to Stake"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.0"
              rightElement={<span className="text-gray-500">{isEthPool ? 'ETH' : 'Token'}</span>}
              helperText={balance ? `Available: ${parseFloat(balance.formatted).toFixed(4)} ${isEthPool ? 'ETH' : 'Token'}` : undefined}
              className="text-lg sm:text-xl py-3 sm:py-5"
            />
          </div>

          {/* Stake Button */}
          <div className="pt-4 sm:pt-8">
            {!isConnected ? (
              <div className="flex justify-center">
                <div className="glow">
                  <ConnectButton />
                </div>
              </div>
            ) : (
              <Button onClick={handleStake} disabled={loading || !amount} loading={loading} fullWidth className="py-3 sm:py-5 text-lg sm:text-xl">
                <FiArrowDown className="w-6 h-6 sm:w-7 sm:h-7" />
                <span>Stake {isEthPool ? 'ETH' : 'Token'}</span>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
