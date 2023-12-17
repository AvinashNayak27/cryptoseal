// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "fhevm/lib/TFHE.sol"; // Importing the TFHE library
import "fhevm/abstracts/EIP712WithModifier.sol";

contract CryptoSeal is ERC721, Ownable, EIP712WithModifier {
    uint256 private _nextTokenId;
    mapping(uint256 => euint32) public _encryptedTokenStrengths; // Using encrypted integer type
    struct Game {
        uint256 token1;
        uint256 token2;
        address player1;
        address player2;
        uint256 entryFee;
        bool isComplete;
        address winner;
    }

    uint256 public nextGameId;
    mapping(uint256 => Game) public games;

    event GameCreated(uint256 gameId, uint256 token1, uint256 entryFee);
    event GameJoined(uint256 gameId, uint256 token2);
    event GameFinished(uint256 gameId, address winner);

    constructor()
        EIP712WithModifier("Authorization token", "1")
        ERC721("CryptoSeal", "CS")
        Ownable(msg.sender)
    {}

    uint256 public mintPrice = 1 ether; // Minting price set to 1 ETH

    function safeMint() public payable {
        require(msg.value == mintPrice, "Incorrect Ether value");

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _encryptedTokenStrengths[tokenId] = TFHE.asEuint32(0); // Storing encrypted strength
    }

    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
    }

    function incrementStrength(uint256 tokenId) public payable {
        require(
            msg.value == 0.1 ether,
            "You must send exactly 0.1 ether to increment strength"
        );

        require(
            ownerOf(tokenId) == msg.sender,
            "You must own the token to increase its strength"
        );
        _encryptedTokenStrengths[tokenId] = TFHE.add(
            _encryptedTokenStrengths[tokenId],
            TFHE.rem(TFHE.randEuint8(), 10) + TFHE.asEuint8(1)
        );
    }

    function getStrength(
        uint256 tokenId,
        bytes32 publicKey,
        bytes calldata signature
    )
        public
        view
        onlySignedPublicKey(publicKey, signature)
        returns (bytes memory)
    {
        require(
            ownerOf(tokenId) == msg.sender,
            "You must own the token to view original strength"
        );

        return TFHE.reencrypt(_encryptedTokenStrengths[tokenId], publicKey, 0);
    }

    function _isTokenExists(uint256 tokenId) private view returns (bool) {
        try this.ownerOf(tokenId) {
            return true;
        } catch {
            return false;
        }
    }

    function totalMinted() public view returns (uint256) {
        return _nextTokenId;
    }

    // Create a new game
    function createGame(uint256 tokenId, uint256 entryFee) external payable {
        require(_isTokenExists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "You must own the token");
        require(msg.value == entryFee, "Incorrect entry fee");

        uint256 gameId = nextGameId++;
        games[gameId] = Game({
            token1: tokenId,
            token2: 0,
            player1: msg.sender,
            player2: address(0),
            entryFee: entryFee,
            isComplete: false,
            winner: address(0)
        });

        emit GameCreated(gameId, tokenId, entryFee);
    }

    // Join an existing game
    function joinGame(uint256 gameId, uint256 tokenId) external payable {
        Game storage game = games[gameId];
        require(game.player2 == address(0), "Game already has two players");
        require(_isTokenExists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "You must own the token");
        require(msg.value == game.entryFee, "Incorrect entry fee");

        game.token2 = tokenId;
        game.player2 = msg.sender;

        _determineWinner(gameId);

        emit GameJoined(gameId, tokenId);
    }

    // Internal function to determine the winner
    function _determineWinner(uint256 gameId) internal {
        Game storage game = games[gameId];
        require(game.player2 != address(0), "Second player not joined");

        bool isFirstTokenStronger = TFHE.decrypt(
            TFHE.gt(
                _encryptedTokenStrengths[game.token1],
                _encryptedTokenStrengths[game.token2]
            )
        );

        address winner = isFirstTokenStronger ? game.player1 : game.player2;
        game.winner = winner;
        payable(winner).transfer(game.entryFee * 2); // Paying the winner double the entry fee

        game.isComplete = true;

        emit GameFinished(gameId, winner);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available to withdraw");

        // Transfer the balance to the owner
        (bool sent, ) = payable(owner()).call{value: balance}("");
        require(sent, "Failed to send Ether");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
