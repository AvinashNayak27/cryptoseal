import { useState, useEffect } from "react";
import { init } from "./utils/fhevm";
import { Connect } from "./Connect";
import NFTs from "./Nfts";
import { contractABI, contractAddress } from "./Nfts";
import { ethers } from "ethers";
import { slice } from "./Nfts";
import "./App.css";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        setIsInitialized(true);
      })
      .catch(() => setIsInitialized(false));
  }, []);

  if (!isInitialized) return null;

  return (
    <div className="App bg-gray-900 text-gray-100 min-h-screen">
      <div className="container mx-auto p-4">
        <Connect>
          {(account, provider) => (
            <Example account={account} provider={provider} />
          )}
        </Connect>
      </div>
    </div>
  );
}

function Games({ account, provider }) {
  if (!provider || !account) return;
  console.log("account:", account);

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [creatingGame, setCreatingGame] = useState(false);
  const [joiningGame, setJoiningGame] = useState(false);
  const [newGameTokenId, setNewGameTokenId] = useState("");
  const [newGameEntryFee, setNewGameEntryFee] = useState("");

  const loadGames = async () => {
    setLoading(true);
    try {
      // Assuming you have a way to get the total number of games
      const signer = await provider.getSigner();

      const contractWithSigner = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const totalGames = await contractWithSigner.nextGameId();
      console.log("totalGames:", totalGames);
      const gameData = [];
      for (let i = 0; i < totalGames; i++) {
        const game = await contractWithSigner.games(i);
        gameData.push({ id: i, ...game });
      }
      console.log("games:", gameData);
      setGames(gameData);
    } catch (error) {
      console.error("Error loading games:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGames();
  }, []);

  const joinGame = async (gameId, tokenid) => {
    setJoiningGame(true);
    try {
      const game = games.find((g) => g.id.toString() === gameId);
      console.log("game:", game);
      if (!game) {
        alert("Game not found");
        return;
      }
      const signer = await provider.getSigner();

      const contractWithSigner = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      console.log("gameId:", gameId);
      console.log("tokenid:", tokenid);

      const transaction = await contractWithSigner.joinGame(gameId, tokenid, {
        value: game[4].toString(),
      });
      await transaction.wait();
      alert("Joined game successfully!");
      loadGames();
    } catch (error) {
      console.error("Error joining game:", error);
      alert("Failed to join game.");
    }
    setJoiningGame(false);
  };

  const createGame = async () => {
    setCreatingGame(true);
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const entryFee = ethers.parseEther(newGameEntryFee);
      const transaction = await contractWithSigner.createGame(
        newGameTokenId,
        entryFee,
        { value: entryFee }
      );
      await transaction.wait();
      alert("Game created successfully!");
      loadGames();
    } catch (error) {
      console.error("Error creating game:", error);
      alert(
        "Game creation failed. It appears that you do not own the NFT with the specified token ID."
      );
    }
    setCreatingGame(false);
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-2 text-blue-400">
        <span className="text-green-300">Games</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {games.map((game) => (
          <div
            key={game.id.toString()}
            className={`bg-gray-800 p-4 rounded-lg shadow-lg transition duration-300 border border-white ${
              game[5] ? "opacity-50" : ""
            }`}
          >
            <div className="mb-4">
              <p className="text-gray-400">
                Player 1:{" "}
                <a
                  href={`https://main.explorer.zama.ai/address/${game[2]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  {slice(game[2])}
                </a>
              </p>
              <p className="text-gray-400">
                Token 1:{" "}
                <span className="text-blue-400">{game[0].toString()}</span>
              </p>
              <p className="text-gray-400">
                Entry Fee:{" "}
                <span className="text-green-400">
                  {ethers.formatEther(game[4].toString()) + " Ether"}
                </span>
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              {game[2].toLowerCase() === account.toLowerCase() ? (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 relative"
                  disabled
                >
                  Join Game
                  <span className="tooltip-text absolute w-auto p-2 bg-black text-white text-xs rounded-lg shadow-md -mt-8 hidden">
                    You are the creator
                  </span>
                </button>
              ) : (
                game[3] === "0x0000000000000000000000000000000000000000" &&
                !game[5] && (
                  <>
                    <input
                      type="text"
                      placeholder="Enter Token ID"
                      className="px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                      value={tokenId}
                      onChange={(e) => setTokenId(e.target.value)}
                    />
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                      onClick={() => joinGame(game.id.toString(), tokenId)}
                      disabled={joiningGame}
                    >
                      {joiningGame ? "Joining..." : "Join Game"}
                    </button>
                  </>
                )
              )}
              {game[5] && (
                <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg shadow-lg">
                  <p className="text-white text-lg font-bold mb-2">
                    Game Completed
                  </p>
                  <a
                    href={`https://main.explorer.zama.ai/address/${game[6]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-300 hover:text-yellow-200 font-semibold"
                  >
                    {"Winner " + slice(game[6])}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-white">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">
              Create New Game
            </h3>
            <input
              type="number"
              placeholder="Token ID"
              className="w-full px-3 py-2 mb-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              value={newGameTokenId}
              onChange={(e) => setNewGameTokenId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Entry Fee (ETH)"
              className="w-full px-3 py-2 mb-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              value={newGameEntryFee}
              onChange={(e) => setNewGameEntryFee(e.target.value)}
            />
            <button
              onClick={createGame}
              disabled={creatingGame}
              className={`w-full px-4 py-2 rounded text-white ${
                creatingGame ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
              } transition duration-300`}
            >
              {creatingGame ? "Creating..." : "Create Game"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const MintNFT = ({ account, provider }) => {
  if (!provider || !account) return;

  const mint = async () => {
    const signer = await provider.getSigner();

    const contractWithSigner = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    // Call the safeMint function with the value
    const mintPrice = ethers.parseEther("1.0"); // The mint price (1 ETH in this example)
    const transaction = await contractWithSigner.safeMint({ value: mintPrice });
    // Wait for the transaction to be mined
    await transaction.wait();
    console.log("Transaction mined!");

    alert("NFT minted successfully! check NFTs tab");
  };

  return (
    <div className="text-center">
      <h2 className=" mb-3 text-center">
        {" "}
        Mint an NFT by clicking the button below
      </h2>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded-md mb-4"
        onClick={mint}
      >
        Mint NFT
      </button>
    </div>
  );
};

function Example({ account, provider }) {
  const [activeTab, setActiveTab] = useState("NFTs");

  return (
    <div className="text-center bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-2 text-green-400 -mt-2">
        Welcome to <span className="text-green-300">CryptoSeal</span>
      </h1>
      {account && (
        <h2 className="text-xl font-semibold mb-3 text-center">
          Connected to {account}
        </h2>
      )}

      {/* Navigation Bar */}
      <div className="mb-4">
        <button
          className={`px-4 py-2 mr-2 ${
            activeTab === "NFTs"
              ? "bg-green-600 text-white"
              : "bg-green-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("NFTs")}
        >
          NFTs
        </button>
        <button
          className={`px-4 py-2 mr-2 ${
            activeTab === "Games"
              ? "bg-green-600 text-white"
              : "bg-green-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("Games")}
        >
          Games
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "MintNFT"
              ? "bg-green-600 text-white"
              : "bg-green-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("MintNFT")}
        >
          Mint NFT
        </button>
      </div>

      {/* Conditional Rendering of Components */}
      {activeTab === "NFTs" && <NFTs account={account} provider={provider} />}
      {activeTab === "Games" && <Games account={account} provider={provider} />}
      {activeTab === "MintNFT" && (
        <MintNFT account={account} provider={provider} />
      )}
    </div>
  );
}

export default App;
