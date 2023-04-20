use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod pdalimit {
    use super::*;

    pub fn init_pda(_ctx: Context<InitPda>) -> Result<()> {
        Ok(())
    }

    pub fn realloc_pda(_ctx: Context<ReallocPda>) -> Result<()> {
        Ok(())
    }

    pub fn single_byte_realloc_pda(_ctx: Context<SingleByteReallocPda>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitPda<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        seeds = ["never_trust_the_docs".as_ref()], bump,
        space = 10240,
        payer = signer
    )]
    pub thing: Account<'info, Thing>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReallocPda<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = ["never_trust_the_docs".as_ref()], bump,
        realloc = thing.to_account_info().data_len() + 10240,
        realloc::payer = signer,
        realloc::zero = true
    )]
    pub thing: Account<'info, Thing>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SingleByteReallocPda<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = ["never_trust_the_docs".as_ref()], bump,
        realloc = thing.to_account_info().data_len() + 1,
        realloc::payer = signer,
        realloc::zero = true
    )]
    pub thing: Account<'info, Thing>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Thing {
    pub val: u8,
}
