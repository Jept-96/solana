# Solana TicTacToe

A decentralized TicTacToe game built on Solana blockchain where players can compete and wager SOL tokens.

## Features

- Create and join games with SOL wagers
- Real-time game state updates
- Multiple rounds support
- Turn timer
- Automatic winner detection
- Prize claiming system with platform fees

## Prerequisites

- Node.js 14+ and npm
- Rust and Cargo
- Solana CLI
- Anchor Framework
- Phantom Wallet or other Solana wallet

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd solana-tictactoe
```

2. Install Rust dependencies:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup component add rustfmt
```

3. Install Solana CLI:
```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.17.16/install)"
```

4. Install Anchor:
```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest
avm use latest
```

5. Install program dependencies:
```bash
cd programs/tictactoe
cargo build
```

6. Install frontend dependencies:
```bash
cd ../../app
npm install
```

## Configuration

1. Set up your Solana wallet:
```bash
solana-keygen new
```

2. Configure Solana to use devnet:
```bash
solana config set --url https://api.devnet.solana.com
```

3. Get some devnet SOL:
```bash
solana airdrop 2
```

## Building and Deploying

1. Build and deploy the program:
```bash
anchor build
anchor deploy
```

2. Update the program ID in:
- `Anchor.toml`
- `app/src/utils/anchor.ts`

3. Start the frontend:
```bash
cd app
npm start
```

## Usage

1. Connect your Solana wallet
2. Create a new game by specifying:
   - Wager amount
   - Number of rounds
   - Turn timer duration
3. Share your game ID with another player
4. Play the game!
5. Winner can claim their prize after the game ends

## Development

- Smart Contract: `programs/tictactoe/src/lib.rs`
- Frontend Component: `app/src/components/TicTacToe.tsx`
- Anchor Utils: `app/src/utils/anchor.ts`

## Testing

Run the test suite:
```bash
anchor test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 