import { ethers } from "ethers";

import * as Constants from "../../Utils/config";

async function handler (req, res) {

    //backend uses JsonRpcProvider to connect to the blockchain
    try {
        const index = req.body;
        const provider = new ethers.providers.JsonRpcProvider(Constants.API_URL);
        const signer = new ethers.Wallet(Constants.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(Constants.contractAddress, Constants.contractAbi, signer);
        //the contract function
        const tx = await contract.removeTask(index);
        await tx.wait();
        //waits for it to send and then sends the following message
        res.status(200).json({ message: "Task Removed" });
    }
    catch (err) {
        console.error(err);
    }
}

export default handler;