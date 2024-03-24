import { useEffect, useState } from "react";
import styles from '../styles/Home.module.css';
import {ethers} from 'ethers';
import * as Constants from "../Utils/config"

function App() {

  //connecting to metamask when the page loags
  useEffect(() => {
    const connectToMetamask = async () => { 
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          console.log(await signer.getAddress());
        }
        else {
          console.log("Metamask not found 2");
        }
      }
      catch (err) {
        console.error(err);
      }
    }

    connectToMetamask();

  }, []);
}



export default App;