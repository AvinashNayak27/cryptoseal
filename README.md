### User Documentation for CryptoSeal DApp

#### Overview
CryptoSeal is a blockchain-based game where players can mint unique NFTs, enhance their attributes, and use them in games to win ZAMA tokens. This guide will help you navigate the CryptoSeal DApp.

#### Helpful Resources
- **Demo Video**: For a visual guide on how to use CryptoSeal, watch our [demo video on YouTube](https://www.youtube.com/watch?v=OBtFgSpLSsY).
- **Play the Game**: Experience CryptoSeal firsthand by visiting the [live game here](https://cryptoseal.vercel.app/).


#### Getting Started
1. **Connect Wallet**: To interact with the DApp, connect your Ethereum wallet (such as MetaMask) by clicking the 'Connect Wallet' button.(ZAMA DEVNET)

2. **Mint NFTs**: 
   - Click on the 'Mint NFT' tab.
   - Click the 'Mint NFT' button to mint your CryptoSeal NFT. The minting fee is 1 ZAMA.

3. **View Your NFTs**:
   - Navigate to the 'NFTs' tab to view your minted NFTs.
   - Each NFT displays its Token ID and encrypted strength.

4. **Increase NFT Strength**:
   - In the 'NFTs' tab, click 'Increase Strength' for the desired NFT.
   - Confirm the transaction (0.1 ZAMA fee) in your wallet.

5. **Decrypt NFT Strength**:
   - Click 'Decrypt Strength' to view the actual strength of your NFT.
   - The decrypted strength will replace the encrypted value using EIP 712 signature.

#### Playing the Game
1. **Create a Game**:
   - Go to the 'Games' tab.
   - Enter the Token ID of your NFT and set an entry fee in ZAMA.
   - Click 'Create Game' and confirm the transaction.

2. **Join a Game**:
   - In the 'Games' tab, find an available game.
   - Enter your Token ID and click 'Join Game'.
   - Pay the entry fee (equal to the game's entry fee) to join.
   - **Winning Conditions**: The winner of the game is determined based on the strength of the participating NFTs. The NFT with higher strength wins the game, and the winner receives double the entry fee. Ensure your NFT's strength is sufficiently high to increase your chances of winning.

3. **View Game Status**:
   - Ongoing and completed games are listed in the 'Games' tab.
   - Completed games will display the winner.
   

#### Troubleshooting
- Ensure your wallet is connected and has sufficient ZAMA on ZAMA devenet for transactions.
- If a transaction succeed an the ui doesn't update,refresh/reload the page

### Use of fhEVM in CryptoSeal: Harnessing Hidden Information

#### Overview
CryptoSeal uniquely integrates the Zama's Fully Homomorphic Encryption Virtual Machine (fhEVM) to revolutionize gameplay through the use of hidden information. This advanced cryptographic technology enables a gaming experience where critical data, such as the strength of NFTs, remains encrypted and undisclosed, creating a layer of mystery and strategy that is challenging to achieve without fhEVM.

#### Key Features Enabled by fhEVM

1. **Encrypted NFT Attributes**:
   - In CryptoSeal, each NFT's strength is encrypted using fhEVM. This means the actual strength values are concealed, creating an element of surprise and strategy.
   - Players can enhance their NFTs' strength, but the exact values remain a secret, known only to the NFT owner.

2. **Secure Strength Comparison**:
   - During gameplay, the comparison of NFT strengths to determine the winner is executed within the encrypted domain provided by fhEVM.
   - This ensures that the strengths of NFTs are compared without revealing their actual values, maintaining fairness and competition integrity.

3. **Homomorphic Operations**:
   - fhEVM allows for homomorphic operations on encrypted data. Players can perform actions like incrementing their NFT's strength, and these changes are computed on encrypted values.
   - This feature is crucial for maintaining the secrecy and security of each NFT's attributes throughout the game.

#### Advantages in Gameplay

1. **Enhanced Strategic Depth**:
   - The hidden information aspect compels players to make decisions based on limited data, adding a significant strategic layer to the game.
   - Players must gauge the potential strength of opponents' NFTs and decide their actions accordingly, enhancing the game's complexity and engagement.

2. **Fair and Unbiased Gameplay**:
   - Since the strengths of NFTs are encrypted and unknown to other players and even the game operators, the gameplay remains unbiased and fair.
   - This level of privacy ensures a balanced playing field where strategic planning trumps prior knowledge of opponents' strengths.

3. **Innovative Game Mechanics**:
   - Utilizing fhEVM allows CryptoSeal to implement game mechanics that are not feasible in traditional blockchain games, where all data is typically transparent.
   - This innovation opens up new possibilities in game design, where hidden information plays a central role.

#### Conclusion
The use of Zama's fhEVM in CryptoSeal showcases a groundbreaking approach to blockchain gaming. By leveraging the power of fully homomorphic encryption, the game introduces a unique dimension where hidden information is key, leading to a more intriguing and strategically rich experience. This implementation not only enhances the gameplay but also demonstrates the potential of advanced cryptographic techniques in the gaming industry.
