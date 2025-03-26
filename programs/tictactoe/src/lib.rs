use anchor_lang::prelude::*;

#[program]
pub mod tictactoe {
    use super::*;

    pub fn initialize_game(
        ctx: Context<InitializeGame>,
        wager_amount: u64,
        total_rounds: u8,
        turn_timer: u8,
    ) -> Result<()> {
        let game = &mut ctx.accounts.game;
        let creator = &ctx.accounts.creator;

        game.creator = creator.key();
        game.challenger = None;
        game.wager_amount = wager_amount;
        game.total_rounds = total_rounds;
        game.current_round = 1;
        game.turn_timer = turn_timer;
        game.board = [[None; 3]; 3];
        game.current_player = creator.key();
        game.game_state = GameState::WaitingForChallenger;
        game.wins = 0;
        game.losses = 0;
        game.draws = 0;
        game.last_move_timestamp = Clock::get()?.unix_timestamp;

        // Transfer wager to game account
        let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
            &creator.key(),
            &game.key(),
            wager_amount,
        );
        anchor_lang::solana_program::program::invoke(
            &transfer_ix,
            &[
                creator.to_account_info(),
                game.to_account_info(),
            ],
        )?;

        Ok(())
    }

    pub fn join_game(ctx: Context<JoinGame>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        let challenger = &ctx.accounts.challenger;

        require!(
            game.game_state == GameState::WaitingForChallenger,
            TicTacToeError::GameNotOpen
        );

        // Transfer wager to game account
        let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
            &challenger.key(),
            &game.key(),
            game.wager_amount,
        );
        anchor_lang::solana_program::program::invoke(
            &transfer_ix,
            &[
                challenger.to_account_info(),
                game.to_account_info(),
            ],
        )?;

        game.challenger = Some(challenger.key());
        game.game_state = GameState::InProgress;
        game.last_move_timestamp = Clock::get()?.unix_timestamp;

        Ok(())
    }

    pub fn make_move(ctx: Context<MakeMove>, row: u8, col: u8) -> Result<()> {
        let game = &mut ctx.accounts.game;
        let player = &ctx.accounts.player;

        require!(
            game.game_state == GameState::InProgress,
            TicTacToeError::GameNotInProgress
        );
        require!(
            game.current_player == player.key(),
            TicTacToeError::NotPlayerTurn
        );
        require!(
            row < 3 && col < 3,
            TicTacToeError::InvalidMove
        );
        require!(
            game.board[row as usize][col as usize].is_none(),
            TicTacToeError::InvalidMove
        );

        // Check if move is within time limit
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time - game.last_move_timestamp <= game.turn_timer as i64,
            TicTacToeError::TurnTimeout
        );

        // Make the move
        let symbol = if player.key() == game.creator {
            Symbol::X
        } else {
            Symbol::O
        };
        game.board[row as usize][col as usize] = Some(symbol);
        game.last_move_timestamp = current_time;

        // Check for winner
        if let Some(winner) = game.check_winner() {
            game.handle_game_end(winner);
        } else if game.is_board_full() {
            game.handle_draw();
        } else {
            // Switch turns
            game.current_player = if game.current_player == game.creator {
                game.challenger.unwrap()
            } else {
                game.creator
            };
        }

        Ok(())
    }

    pub fn claim_winnings(ctx: Context<ClaimWinnings>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        let winner = &ctx.accounts.winner;

        require!(
            game.game_state == GameState::Finished,
            TicTacToeError::GameNotFinished
        );
        require!(
            game.winner == Some(winner.key()),
            TicTacToeError::NotWinner
        );

        let total_wager = game.wager_amount * 2;
        let platform_fee = total_wager / 20; // 5% fee
        let winner_amount = total_wager - platform_fee;

        // Transfer winnings to winner
        **game.to_account_info().try_borrow_mut_lamports()? -= winner_amount;
        **winner.try_borrow_mut_lamports()? += winner_amount;

        // Transfer platform fee
        let platform = &ctx.accounts.platform;
        **game.to_account_info().try_borrow_mut_lamports()? -= platform_fee;
        **platform.try_borrow_mut_lamports()? += platform_fee;

        game.game_state = GameState::PrizeClaimed;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(init, payer = creator, space = 8 + GameAccount::SPACE)]
    pub game: Account<'info, GameAccount>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinGame<'info> {
    #[account(mut)]
    pub game: Account<'info, GameAccount>,
    #[account(mut)]
    pub challenger: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MakeMove<'info> {
    #[account(mut)]
    pub game: Account<'info, GameAccount>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimWinnings<'info> {
    #[account(mut)]
    pub game: Account<'info, GameAccount>,
    #[account(mut)]
    pub winner: Signer<'info>,
    /// CHECK: This is the platform fee account
    #[account(mut)]
    pub platform: AccountInfo<'info>,
}

#[account]
pub struct GameAccount {
    pub creator: Pubkey,
    pub challenger: Option<Pubkey>,
    pub wager_amount: u64,
    pub total_rounds: u8,
    pub current_round: u8,
    pub turn_timer: u8,
    pub board: [[Option<Symbol>; 3]; 3],
    pub current_player: Pubkey,
    pub game_state: GameState,
    pub winner: Option<Pubkey>,
    pub wins: u8,
    pub losses: u8,
    pub draws: u8,
    pub last_move_timestamp: i64,
}

impl GameAccount {
    pub const SPACE: usize = 32 + 33 + 8 + 1 + 1 + 1 + (9 * 2) + 32 + 1 + 33 + 1 + 1 + 1 + 8;

    fn check_winner(&self) -> Option<Pubkey> {
        // Check rows
        for row in 0..3 {
            if let Some(symbol) = self.board[row][0] {
                if self.board[row][1] == Some(symbol) && self.board[row][2] == Some(symbol) {
                    return Some(if symbol == Symbol::X {
                        self.creator
                    } else {
                        self.challenger.unwrap()
                    });
                }
            }
        }

        // Check columns
        for col in 0..3 {
            if let Some(symbol) = self.board[0][col] {
                if self.board[1][col] == Some(symbol) && self.board[2][col] == Some(symbol) {
                    return Some(if symbol == Symbol::X {
                        self.creator
                    } else {
                        self.challenger.unwrap()
                    });
                }
            }
        }

        // Check diagonals
        if let Some(symbol) = self.board[0][0] {
            if self.board[1][1] == Some(symbol) && self.board[2][2] == Some(symbol) {
                return Some(if symbol == Symbol::X {
                    self.creator
                } else {
                    self.challenger.unwrap()
                });
            }
        }

        if let Some(symbol) = self.board[0][2] {
            if self.board[1][1] == Some(symbol) && self.board[2][0] == Some(symbol) {
                return Some(if symbol == Symbol::X {
                    self.creator
                } else {
                    self.challenger.unwrap()
                });
            }
        }

        None
    }

    fn is_board_full(&self) -> bool {
        self.board.iter().all(|row| row.iter().all(|cell| cell.is_some()))
    }

    fn handle_game_end(&mut self, winner: Pubkey) {
        if winner == self.creator {
            self.wins += 1;
        } else {
            self.losses += 1;
        }

        if self.current_round >= self.total_rounds {
            self.game_state = GameState::Finished;
            self.winner = Some(if self.wins > self.losses {
                self.creator
            } else {
                self.challenger.unwrap()
            });
        } else {
            self.current_round += 1;
            self.reset_board();
            self.current_player = self.creator;
        }
    }

    fn handle_draw(&mut self) {
        self.draws += 1;

        if self.current_round >= self.total_rounds {
            self.game_state = GameState::Finished;
            self.winner = Some(if self.wins > self.losses {
                self.creator
            } else {
                self.challenger.unwrap()
            });
        } else {
            self.current_round += 1;
            self.reset_board();
            self.current_player = self.creator;
        }
    }

    fn reset_board(&mut self) {
        self.board = [[None; 3]; 3];
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum GameState {
    WaitingForChallenger,
    InProgress,
    Finished,
    PrizeClaimed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq)]
pub enum Symbol {
    X,
    O,
}

#[error_code]
pub enum TicTacToeError {
    #[msg("Game is not open for joining")]
    GameNotOpen,
    #[msg("Game is not in progress")]
    GameNotInProgress,
    #[msg("Not player's turn")]
    NotPlayerTurn,
    #[msg("Invalid move")]
    InvalidMove,
    #[msg("Turn timeout")]
    TurnTimeout,
    #[msg("Game is not finished")]
    GameNotFinished,
    #[msg("Not the winner")]
    NotWinner,
} 