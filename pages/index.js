import { useEffect, useState } from "react";
import styles from '../styles/Home.module.css';
import { ethers } from 'ethers';
import * as Constants from "../Utils/config";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const connectToMetamask = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          console.log("Connected to Metamask")
          const contractInstance = new ethers.Contract(Constants.contractAddress, Constants.contractAbi, signer);
          const tasks = await contractInstance.getAllTasks();
          setTasks(tasks);
        } else {
          console.log("Metamask not found");
        }
      } catch (err) {
        console.error(err);
      }
    };

    connectToMetamask();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/addTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(task)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error);
    } else {
      window.location.reload();
    }

    setLoading(false);
  };

  const handleChange = (event) => {
    setTask(event.target.value);
  };
  
  const removeTask = async (index) => {
    setLoading(true);
    const response = await fetch('/api/removeTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(index)
    });
  
    if (!response.ok) {
      const error = await response.json();
      console.log(error);
    } else {
      // Filter out the removed task from the tasks array
      setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
    }
  
    setLoading(false);
  };
  

  const changeTaskStatus = async (taskId) => {
    setLoading(true);
    const response = await fetch('/api/changeStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskId)
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(error);
    } else {
      window.location.reload();
    }

    setLoading(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {loading && (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      )}
      
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
              <th>Action</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {
              tasks.map((task, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{task.desc}</td>
                  <td>{task.status === 0 ? "Incomplete" : "Complete"}</td>
                  <td >
                {task.status === 0 ? <button className={styles.button} onClick={() => changeTaskStatus(index)}>Click me</button> : null}
                
                </td>
                  <td>
                    <button className={styles.button} onClick={() => removeTask(index)}>Remove</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
