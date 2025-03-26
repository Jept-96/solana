import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TicTacToe } from "../target/types/tictactoe";
import { PublicKey, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

describe("tictactoe", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TicTacToe as Program<TicTacToe>;
  const creator = anchor.web3.Keypair.generate();
  const challenger = anchor.web3.Keypair.generate();
  const gameAccount = anchor.web3.Keypair.generate();
  const platformFeeAccount = anchor.web3.Keypair.generate();

  const wagerAmount = 0.1 * LAMPORTS_PER_SOL;
  const totalRounds = 3;
  const turnTimer = 30;

  before(async () => {
    // Airdrop SOL to creator and challenger
    const airdropCreator = await provider.connection.requestAirdrop(
      creator.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropCreator);

    const airdropChallenger = await provider.connection.requestAirdrop(
      challenger.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropChallenger);
  });

  it("Initializes game", async () => {
    await program.methods
      .initializeGame(
        new anchor.BN(wagerAmount),
        totalRounds,
        turnTimer
      )
      .accounts({
        game: gameAccount.publicKey,
        creator: creator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([creator, gameAccount])
      .rpc();

    const game = await program.account.gameAccount.fetch(gameAccount.publicKey);
    expect(game.creator.toString()).to.equal(creator.publicKey.toString());
    expect(game.wagerAmount.toNumber()).to.equal(wagerAmount);
    expect(game.totalRounds).to.equal(totalRounds);
    expect(game.turnTimer).to.equal(turnTimer);
    expect(game.gameState).to.deep.equal({ waitingForChallenger: {} });
  });

  it("Joins game", async () => {
    await program.methods
      .joinGame()
      .accounts({
        game: gameAccount.publicKey,
        challenger: challenger.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([challenger])
      .rpc();

    const game = await program.account.gameAccount.fetch(gameAccount.publicKey);
    expect(game.challenger.toString()).to.equal(challenger.publicKey.toString());
    expect(game.gameState).to.deep.equal({ inProgress: {} });
  });

  it("Makes moves", async () => {
    // Creator makes move
    await program.methods
      .makeMove(0, 0)
      .accounts({
        game: gameAccount.publicKey,
        player: creator.publicKey,
      })
      .signers([creator])
      .rpc();

    let game = await program.account.gameAccount.fetch(gameAccount.publicKey);
    expect(game.board[0][0]).to.deep.equal({ x: {} });
    expect(game.currentPlayer.toString()).to.equal(challenger.publicKey.toString());

    // Challenger makes move
    await program.methods
      .makeMove(1, 1)
      .accounts({
        game: gameAccount.publicKey,
        player: challenger.publicKey,
      })
      .signers([challenger])
      .rpc();

    game = await program.account.gameAccount.fetch(gameAccount.publicKey);
    expect(game.board[1][1]).to.deep.equal({ o: {} });
    expect(game.currentPlayer.toString()).to.equal(creator.publicKey.toString());
  });

  it("Detects winner and allows claiming prize", async () => {
    // Complete winning pattern for creator (X)
    await program.methods
      .makeMove(0, 1)
      .accounts({
        game: gameAccount.publicKey,
        player: creator.publicKey,
      })
      .signers([creator])
      .rpc();

    await program.methods
      .makeMove(2, 2)
      .accounts({
        game: gameAccount.publicKey,
        player: challenger.publicKey,
      })
      .signers([challenger])
      .rpc();

    await program.methods
      .makeMove(0, 2)
      .accounts({
        game: gameAccount.publicKey,
        player: creator.publicKey,
      })
      .signers([creator])
      .rpc();

    const game = await program.account.gameAccount.fetch(gameAccount.publicKey);
    expect(game.gameState).to.deep.equal({ finished: {} });
    expect(game.winner.toString()).to.equal(creator.publicKey.toString());

    // Claim winnings
    const creatorBalanceBefore = await provider.connection.getBalance(creator.publicKey);
    
    await program.methods
      .claimWinnings()
      .accounts({
        game: gameAccount.publicKey,
        winner: creator.publicKey,
        platform: platformFeeAccount.publicKey,
      })
      .signers([creator])
      .rpc();

    const creatorBalanceAfter = await provider.connection.getBalance(creator.publicKey);
    const expectedWinnings = (wagerAmount * 2) * 0.95; // 5% platform fee
    expect(creatorBalanceAfter - creatorBalanceBefore).to.be.approximately(
      expectedWinnings,
      1000000 // Allow for small difference due to transaction fees
    );
  });
}); 