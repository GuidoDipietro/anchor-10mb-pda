import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import { Pdalimit } from "../target/types/pdalimit";

describe("pdalimit", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Pdalimit as Program<Pdalimit>;

  it("Doesn't trust the docs", async () => {
    console.log("\nSo max size is 10240 bytes?\n");

    // Initialize PDA of 10KB, max size according to Solana Cookbook (WRONG!)
    await program.methods
      .initPda()
      .accounts({ signer: provider.wallet.publicKey })
      .rpc();

    // Send enough txs (27 ixs at a time + leftover) to make it 10MB
    let tx = new anchor.web3.Transaction();
    for (let i = 0; i < 1023; i++) {
      let ix = await program.methods
        .reallocPda()
        .accounts({ signer: provider.wallet.publicKey })
        .instruction();

      tx.add(ix);
      if (!(i % 27)) {
        await provider.sendAndConfirm(tx);
        tx = new anchor.web3.Transaction();

        console.log(`Size: ${(1 + 27 * Math.floor(i / 27)) * 10240}`);
      }
    }
    await provider.sendAndConfirm(tx);
    tx = new anchor.web3.Transaction();

    // Get PDA
    let [thingPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("never_trust_the_docs")],
      program.programId
    );
    let thingRaw = await provider.connection.getAccountInfo(thingPda);

    // Show size
    console.log("Data length: ", thingRaw.data.length, "(yes, 10MB)");
    assert.equal(thingRaw.data.length, Math.pow(2, 20) * 10);

    // Fails with more than 10MB, which is the actual max size of ANY ACCOUNT in Solana
    try {
      await program.methods
        .singleByteReallocPda()
        .accounts({ signer: provider.wallet.publicKey })
        .rpc();
    } catch (e) {
      assert.ok(e.toString().includes("Failed to reallocate account data"));
    }
  });
});
