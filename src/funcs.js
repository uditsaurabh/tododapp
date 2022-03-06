import TodoListJSON from "../build/contracts/TodoList.json";
import Web3 from "web3";
const contract = require("@truffle/contract");

export const load = async () => {
  await loadWeb3();
  const accountAddress = await loadAccount();
  const { todoContract, tasks } = await loadContract(accountAddress);
  return { accountAddress, todoContract, tasks };
};

//loding the tasks which we have used in the blockchain
const loadTasks = async (contract, address) => {
  const tasksCount = await contract.tasksCount(address);
  const tasks = [];
  for (var i = 0; i < tasksCount; i++) {
    const task = await contract.tasks(address, i);
    tasks.push(task);
  }
  return tasks;
};

//load the instance of the truffle contract
const loadContract = async (address) => {
  const theContract = contract(TodoListJSON);
  theContract.setProvider(web3.eth.currentProvider);
  const toDoContract = await theContract.deployed();
  const tasks = await loadTasks(toDoContract, address);
  return { toDoContract, tasks };
};

const loadAccount = async () => {
  const account = await web3.eth.getCoinbase();
  return account;
};
const loadWeb3 = async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      // Request account access if needed
      await ethereum.enable();
      // Acccounts now exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    } catch (error) {
      // User denied account access...
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
    // Acccounts always exposed
    web3.eth.sendTransaction({
      /* ... */
    });
  }
  // Non-dapp browsers...
  else {
    console.log(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
};
