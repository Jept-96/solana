use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_tictactoe {
    use super::*;

    pub fn initialize_game(ctx: Context<InitializeGame>, player_two: Pubkey) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.players = [ctx.accounts.player_one.key(), player_two];
        game.turn = 1;
        game.board = [[None; 3]; 3];
        game.state = GameState::Active;
        Ok(())
    }

    pub fn make_move(ctx: Context<MakeMove>, row: u8, col: u8) -> Result<()> {
        require!(row < 3 && col < 3, TicTacToeError::InvalidMove);

        let game = &mut ctx.accounts.game;

        require!(game.state == GameState::Active, TicTacToeError::GameNotActive);
        require!(game.board[row as usize][col as usize].is_none(), TicTacToeError::TileAlreadySet);

        let player_index = if ctx.accounts.player.key() == game.players[0] { 0 } else { 1 };
        require!(player_index + 1 == game.turn, TicTacToeError::NotPlayersTurn);

        game.board[row as usize][col as usize] = Some(Sign::from(player_index));
        game.turn = if game.turn == 1 { 2 } else { 1 };

        if let Some(winner) = get_winner(&game.board) {
            game.state = GameState::Won { winner };
        } else if is_board_full(&game.board) {
            game.state = GameState::Tie;
        }

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum Sign {
    X,
    O,
}

impl From<usize> for Sign {
    fn from(index: usize) -> Self {
        if index == 0 { Sign::X } else { Sign::O }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GameState {
    Active,
    Tie,
    Won { winner: Sign },
}

#[account]
pub struct Game {
    players: [Pubkey; 2],
    turn: u8,
    board: [[Option<Sign>; 3]; 3],
    state: GameState,
}

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(init, payer = player_one, space = 8 + 64 + 1 + 9 + 32)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub player_one: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MakeMove<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
}

#[error_code]
pub enum TicTacToeError {
    TileAlreadySet,
    GameNotActive,
    NotPlayersTurn,
    InvalidMove,
}

fn get_winner(board: &[[Option<Sign>; 3]; 3]) -> Option<Sign> {
    // Check rows
    for row in board {
        if row.iter().all(|&tile| tile == Some(Sign::X)) {
            return Some(Sign::X);
        }
        if row.iter().all(|&tile| tile == Some(Sign::O)) {
            return Some(Sign::O);
        }
    }

    // Check columns
    for col in 0..3 {
        if (0..3).all(|row| board[row][col] == Some(Sign::X)) {
            return Some(Sign::X);
        }
        if (0..3).all(|row| board[row][col] == Some(Sign::O)) {
            return Some(Sign::O);
        }
    }

    // Check diagonals
    if (0..3).all(|i| board[i][i] == Some(Sign::X)) || 
       (0..3).all(|i| board[i][2 - i] == Some(Sign::X)) {
        return Some(Sign::X);
    }
    if (0..3).all(|i| board[i][i] == Some(Sign::O)) || 
       (0..3).all(|i| board[i][2 - i] == Some(Sign::O)) {
        return Some(Sign::O);
    }

    None
}

fn is_board_full(board: &[[Option<Sign>; 3]; 3]) -> bool {
    board.iter().all(|row| row.iter().all(|tile| tile.is_some()))
}