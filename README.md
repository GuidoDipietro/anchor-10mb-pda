# What's the PDA limit in Solana?

If you check some docs, you'll find the [FACT](https://solanacookbook.com/core-concepts/accounts.html#facts) that:

> Accounts have a max size of 10MB (10 Mega Bytes)  
> PDA accounts have a max size of 10KB (10 Kilo Bytes)

Sounds weird, since PDAs are no different than any other account in storage...

So, you test it. And you find docs are once again WRONG and misleading.

# Testing

Install [Anchor](https://www.anchor-lang.com/docs/installation) and everything you need.

Set up your Solana environment with a keypair and all.

Run `anchor test` and don't trust the docs.
