# web3-wallet-auth

Proof of concept password-less login with web3.

Instead of using a traditional username and password combo, we use a crypto wallet like Metamask as a key-signing tool.

## Overview

Connecting a wallet only provides us with a public wallet address. In order to verify the user actually controls the connected account at the moment of login, we need them to sign a message containing a one-time hash.

Once they sign that message, the server can then use that signature to recover the public address of the signer, which we would expect to match the public address of the connected wallet. At that point we can then return a signed token.

## Known Issues

- Login needs to be attempted twice before the account is registered
