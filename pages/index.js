import { useEffect, useState } from "react";
import styles from '../styles/Home.module.css';
import {ethers} from 'ethers';
import * as Constants from "../Utils/config"

function App() {

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  //connecting to metamask when the page loags
  useEffect(() => {
    const connectToMetamask = async () => { 
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          console.log(await signer.getAddress());
          //Using functions from smart contract
          const contractInstance = new ethers.Contract(Constants.contractAddress, Constants.contractAbi, signer);
          var tasks = await contractInstance.getAllTasks();
          setTasks(tasks);
          console.log(tasks);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch ("/api/addTask", {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(task)
  })

  if (!response.ok) {
    const error = await response.json();
    console.error(error);
  }

  const resp = await response.json();
  const status = resp.message;
  console.log(status);
}

  const handleChange = (event) => {
    setTask(event.target.value);
  }



  return (
    <div>
      <div className={styles.container}>
        Welcome to the Decentralized To-Do Application
      </div>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input type="text" name="task" placeholder="Enter your task" onChange={handleChange} value={task} />
          <input type="submit" value="Add Task" />
        </form>

      </div>
      <div className={styles.container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Task Description</th>
              <th>Task Status</th>
            </tr>
          </thead>
          <tbody>
            {
              tasks.map((task, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{task.desc}</td>
                    <td>{task.status === 0 ?  "Incomplete" : "Complete"}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

      </div>
    </div>
  )
}



export default App;