App = {
  contracts: {},

  init: async () => {
    await App.loadEthereum();
    await App.loadAccount();
    await App.loadContracts();
    App.render();
    await App.renderTasks();
  },

  loadEthereum: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (window.web3) {
      App.web3 = new web3(window.web3.currentProvider);
    } else {
      console.log("There's no Ethereum Browser, install MetaMask");
    }
  },

  loadAccount: async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    App.account = accounts[0];
  },

  loadContracts: async () => {
    const res = await fetch("/TasksContract.json");
    const tasksContractjson = await res.json();
    App.contracts.tasksContract = TruffleContract(tasksContractjson);
    App.contracts.tasksContract.setProvider(App.web3Provider);
    App.tasksContract = await App.contracts.tasksContract.deployed();
  },

  render: () => {
    document.getElementById("account").innerText = App.account;
  },

  renderTasks: async () => {
    const counter = (await App.tasksContract.taskCounter()).toNumber();
    let html = "";
    for (let i = 0; i < counter; i++) {
      const task = await App.tasksContract.tasks(i);
      const taskId = task[0];
      const taskTitle = task[1];
      const taskDescription = task[2];
      const taskDone = task[3];
      const taskDate = task[4];

      let taskElement = `
        <div class = "card bg-dark rounded-0 mb-2">
          <div class="card-header d-flex justify-content-between align-items-center">
            <spam >${taskTitle}</spam>
            <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" data-id="${taskId}" ${
        taskDone && "checked"
      } onchange="App.toggleDone(this)"/>
            </div>
          </div>
          <div class="card-body">
            <p class="mb-3">${taskDescription}</p>
            <p class="text-muted">
              Date: ${new Date(taskDate * 1000).toLocaleString()}
            </p>
          </div>
        </div>
      `;

      html += taskElement;
    }

    document.getElementById("tasksList").innerHTML = html;
  },

  toggleDone: async (element) => {
    const id = element.dataset.id;
    await App.tasksContract.toggleDone(id, { from: App.account });
    window.location.reload();
  },

  createTask: async (title, description) => {
    await App.tasksContract.createTask(title, description, {
      from: App.account,
    });
    window.location.reload();
  },
};
