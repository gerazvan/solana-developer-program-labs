use anchor_lang::prelude::*;

declare_id!("2wPaq2wr3LyT2tQt4mzg3utDD894PfhkYtZtR26rc6MV");

#[program]
pub mod test {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
