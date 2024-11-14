const contractAddress = '0xcfcca7fde0e135919a3318e82c5469692f38238d';
const abi = [
    {
        "inputs": [{ "internalType": "uint8", "name": "playerChoice", "type": "uint8" }],
        "name": "play",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getGameHistory",
        "outputs": [
            { "internalType": "address[]", "name": "", "type": "address[]" },
            { "internalType": "uint8[]", "name": "", "type": "uint8[]" },
            { "internalType": "uint8[]", "name": "", "type": "uint8[]" },
            { "internalType": "uint8[]", "name": "", "type": "uint8[]" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let contract;
let web3;

async function initialize() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        await ethereum.request({ method: 'eth_requestAccounts' });
        contract = new web3.eth.Contract(abi, contractAddress);
        console.log('Contract connected');
    } else {
        alert('Please install MetaMask!');
    }
}

async function playGame(playerChoice) {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const player = accounts[0];

    await contract.methods.play(playerChoice).send({ from: player })
        .on('receipt', async () => {
            const history = await getHistory();
            const playerMove = history[1][history[1].length - 1];
            const computerMove = history[2][history[2].length - 1];
            const result = history[3][history[3].length - 1];

            showAnimation(playerMove, computerMove, result);
        });
}

function showAnimation(playerMove, computerMove, result) {
    const animationElement = document.getElementById("result-animation");
    animationElement.style.display = "block";

    if (playerMove == 0 && computerMove == 1) {
        animationElement.innerHTML = `<img src="rw.gif" alt="Explosion">`;
    } else if (playerMove == 1 && computerMove == 2) {
        animationElement.innerHTML = `<img src="ssw.gif" alt="Cut">`;
    } else if (playerMove == 2 && computerMove == 0) {
        animationElement.innerHTML = `<img src="ppw.gif" alt="Wrap">`;
    } else {
        animationElement.innerHTML = `<p>Ничья!</p>`;
    }

    setTimeout(() => {
        animationElement.style.display = "none";
    }, 3000);
}

async function getHistory() {
    return await contract.methods.getGameHistory().call();
}

window.addEventListener('load', initialize);
