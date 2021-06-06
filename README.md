# web3-wallet-auth

Proof of concept password-less login with web3.

1. We connect a browser wallet like Metamask, which gives us the public wallet address and access to the Ethreum JSON RPC.
2. Using the public wallet address we lookup the user account or create one, and return a nonce.
3. The user signs a message containing the nonce with their private keys.
4. We recover the public address of the signed message, and verify that it matches the public wallet address we have in our database.
5. If the addresses match, we have successfully verified the user.
