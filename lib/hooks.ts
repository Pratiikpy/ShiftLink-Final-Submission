import { useState, useEffect } from 'react';

export interface Coin {
  coin: string;
  name: string;
  networks: string[];
  mainnet: string;
  hasMemo: boolean;
  tokenDetails?: Record<string, { contractAddress: string; decimals: number }>;
}

export function useSideShiftCoins() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sideshift/coins')
      .then(res => res.json())
      .then(data => {
        setCoins(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return { coins, loading };
}
