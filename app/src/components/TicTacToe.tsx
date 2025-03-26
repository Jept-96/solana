import React, { useState, useEffect } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TicTacToe } from '../idl/tictactoe';
import { useConnection } from '@solana/wallet-adapter-react';

interface GameState {
  board: Array<Array<string | null>>;
  currentPlayer: string;
  winner: string | null;
  gameState: 'waiting' | 'inProgress' | 'finished' | 'claimed';
  wagerAmount: number;
  totalRounds: number;
  currentRound: number;
  turnTimer: number;
  lastMoveTimestamp: number;
}

const PROGRAM_ID = new PublicKey('your_program_id_here');
const PLATFORM_FEE_ACCOUNT = new PublicKey('your_platform_fee_account_here');

export const TicTacToeGame: React.FC = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<Program<TicTacToe> | null>(null);
  const [gameAccount, setGameAccount] = useState<web3.Keypair | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    board: Array(3).fill(Array(3).fill(null)),
    currentPlayer: '',
    winner: null,
    gameState: 'waiting',
    wagerAmount: 0.1 * LAMPORTS_PER_SOL,
    totalRounds: 3,
    currentRound: 1,
    turnTimer: 30,
    lastMoveTimestamp: 0,
  });

  useEffect(() => {
    if (wallet) {
      const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
      );
      // Initialize program here once IDL is available
      // setProgram(new Program(IDL, PROGRAM_ID, provider));
    }
  }, [wallet, connection]);

  const initializeGame = async () => {
    if (!program || !wallet) return;

    const newGameAccount = web3.Keypair.generate();
    setGameAccount(newGameAccount);

    try {
      await program.methods
        .initializeGame(
          new web3.BN(gameState.wagerAmount),
          gameState.totalRounds,
          gameState.turnTimer
        )
        .accounts({
          game: newGameAccount.publicKey,
          creator: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([newGameAccount])
        .rpc();

      // Subscribe to game account changes
      program.account.gameAccount.subscribe(newGameAccount.publicKey, {
        commitment: 'confirmed',
      }, (account: any) => {
        updateGameState(account);
      });
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  };

  const joinGame = async (gamePublicKey: PublicKey) => {
    if (!program || !wallet) return;

    try {
      await program.methods
        .joinGame()
        .accounts({
          game: gamePublicKey,
          challenger: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
    } catch (error) {
      console.error('Error joining game:', error);
    }
  };

  const makeMove = async (row: number, col: number) => {
    if (!program || !wallet || !gameAccount) return;

    try {
      await program.methods
        .makeMove(row, col)
        .accounts({
          game: gameAccount.publicKey,
          player: wallet.publicKey,
        })
        .rpc();
    } catch (error) {
      console.error('Error making move:', error);
    }
  };

  const claimWinnings = async () => {
    if (!program || !wallet || !gameAccount) return;

    try {
      await program.methods
        .claimWinnings()
        .accounts({
          game: gameAccount.publicKey,
          winner: wallet.publicKey,
          platform: PLATFORM_FEE_ACCOUNT,
        })
        .rpc();
    } catch (error) {
      console.error('Error claiming winnings:', error);
    }
  };

  const updateGameState = (account: any) => {
    setGameState({
      board: account.board.map((row: any[]) =>
        row.map((cell: any) => (cell ? (cell.x ? 'X' : 'O') : null))
      ),
      currentPlayer: account.currentPlayer.toString(),
      winner: account.winner ? account.winner.toString() : null,
      gameState: account.gameState,
      wagerAmount: account.wagerAmount.toNumber(),
      totalRounds: account.totalRounds,
      currentRound: account.currentRound,
      turnTimer: account.turnTimer,
      lastMoveTimestamp: account.lastMoveTimestamp.toNumber(),
    });
  };

  const renderCell = (row: number, col: number) => {
    const value = gameState.board[row][col];
    const isCurrentPlayer =
      wallet && gameState.currentPlayer === wallet.publicKey.toString();
    const canMove =
      isCurrentPlayer && gameState.gameState === 'inProgress' && !value;

    return (
      <button
        className={`cell ${value ? 'filled' : ''} ${canMove ? 'active' : ''}`}
        onClick={() => canMove && makeMove(row, col)}
        disabled={!canMove}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="tictactoe-container">
      <h1>Solana TicTacToe</h1>
      {!wallet ? (
        <p>Please connect your wallet to play</p>
      ) : gameState.gameState === 'waiting' ? (
        <div>
          <button onClick={initializeGame}>Create New Game</button>
          {/* Add game list and join functionality here */}
        </div>
      ) : (
        <div>
          <div className="game-info">
            <p>Round: {gameState.currentRound} / {gameState.totalRounds}</p>
            <p>Wager: {gameState.wagerAmount / LAMPORTS_PER_SOL} SOL</p>
            {gameState.winner && (
              <p>Winner: {gameState.winner === wallet.publicKey.toString() ? 'You' : 'Opponent'}</p>
            )}
          </div>
          <div className="board">
            {Array(3)
              .fill(null)
              .map((_, row) => (
                <div key={row} className="row">
                  {Array(3)
                    .fill(null)
                    .map((_, col) => (
                      <div key={col} className="cell">
                        {renderCell(row, col)}
                      </div>
                    ))}
                </div>
              ))}
          </div>
          {gameState.gameState === 'finished' && gameState.winner === wallet.publicKey.toString() && (
            <button onClick={claimWinnings}>Claim Winnings</button>
          )}
        </div>
      )}
      <style jsx>{`
        .tictactoe-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }

        .game-info {
          margin-bottom: 20px;
        }

        .board {
          display: inline-block;
          background: #2a2a2a;
          padding: 10px;
          border-radius: 8px;
        }

        .row {
          display: flex;
        }

        .cell {
          width: 100px;
          height: 100px;
          border: 2px solid #444;
          margin: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2em;
          font-weight: bold;
          background: #333;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cell:hover {
          background: #444;
        }

        .cell.filled {
          cursor: not-allowed;
        }

        .cell.active:hover {
          background: #555;
        }

        button {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 1em;
          cursor: pointer;
          margin: 10px;
          transition: background 0.2s;
        }

        button:hover {
          background: #45a049;
        }

        button:disabled {
          background: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}; 