import { constants, ethers } from "./ethers-5.1.esm.min.js";
import { abi , contractAddress} from "./constants.js"

const connectFun = document.getElementById("connectBtn");
const fundFun = document.getElementById("fund");
const getBalanceFun = document.getElementById("getBalance");
const withdrawBtn = document.getElementById("withdraw");
console.log(ethers)
const connectToMetamask = async() =>
{
    if(typeof window.ethereum != undefined)
    {
        await window.ethereum.request({method: "eth_requestAccounts"})
        document.getElementById("connectBtn").innerHTML = "Connected";
        setTimeout(() => {
            document.getElementById("connectBtn").innerHTML = "Disconnect?";
        }, 2000)
    }
    else
    { 
        console.log("no metamask detected")
    }
}
 
const fund = async () => {
    const ethAmount = document.getElementById("inputETH").value;
    let transactionResponse;
    if(typeof window.ethereum != undefined)
    {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        signer.getAddress().then((e) => {console.log("hiii" ,  e)}) // this gives address
        const contract = new ethers.Contract(contractAddress , abi ,  signer);
        try {
            transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
        } catch (error) {
            console.log("Transaction calcelled with" , error);
        }
        await listenForTransactionMined(transactionResponse , provider);
        console.log(" done");
    }
}

const listenForTransactionMined = (transactionResponse , provider) => {
    return new Promise((resolve , reject) => {
        console.log(`Minig ${transactionResponse.hash}....`)
        provider.once(transactionResponse.hash , (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
            resolve();
        })
    })
}

const getBalance = async() => {
    console.log("Getting you balance")
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    const ethererium = ethers.utils.formatEther(balance); 
    document.getElementById("displayBalance").innerHTML = `${ethererium} ETH`
    // const signer = provider.getSigner();
    // const contract = await ethers.Contract( contractAddress , abi , signer)
}

const withdraw = async() => {
    let transactionResponse;
    console.log("withdrawing......");
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    signer.getAddress().then((e) => {console.log("hiii" ,  e)}) // this gives address
    const contract = new ethers.Contract(contractAddress , abi ,  signer);
    try {
        transactionResponse = await contract.withdraw();
        await listenForTransactionMined(transactionResponse , provider);
    } catch (error) {
        console.log(error);
    }
}

connectFun.onclick = connectToMetamask;
fundFun.onclick = fund;
getBalanceFun.onclick = getBalance;
withdrawBtn.onclick = withdraw;