import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import idl from '../idl/tictactoe.json';

export const PROGRAM_ID = new PublicKey('your_program_id_here');

export function useProgram() {
  const wallet = useAnchorWallet();
  const connection = new Connection('https://api.devnet.solana.com');

  const program = useMemo(() => {
    if (wallet) {
      const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
      );
      return new Program(idl as Idl, PROGRAM_ID, provider);
    }
  }, [wallet]);

  return program;
} 