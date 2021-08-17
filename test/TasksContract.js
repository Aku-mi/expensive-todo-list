const TasksContract = artifacts.require("TasksContract");

contract("TasksContract", async () => {
  before(async () => {
    this.tasksContract = await TasksContract.deployed();
  });

  it("migration successfull", async () => {
    const address = this.tasksContract.address;
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
  });

  it("get tasks list", async () => {
    const counter = await this.tasksContract.taskCounter();
    const task = await this.tasksContract.tasks(counter - 1);
    assert.equal(task.id.toNumber(), counter - 1);
    assert.equal(task.title, "title");
    assert.equal(task.description, "description");
    assert.equal(task.done, false);
  });

  it("create task", async () => {
    const result = await this.tasksContract.createTask(
      "some title",
      "some description"
    );

    const taskEvent = result.logs[0].args;
    const counter = await this.tasksContract.taskCounter();
    assert.equal(counter, 2);
    assert.equal(taskEvent.id.toNumber(), 1);
    assert.equal(taskEvent.title, "some title");
    assert.equal(taskEvent.description, "some description");
    assert.equal(taskEvent.done, false);
  });

  it("toggle done", async () => {
    const task = await this.tasksContract.tasks(1);
    const result = await this.tasksContract.toggleDone(1);
    const taskEvent = result.logs[0].args;
    const result2 = await this.tasksContract.toggleDone(1);
    const taskEvent2 = result2.logs[0].args;
    assert.equal(task.id.toNumber(), taskEvent.id.toNumber());
    assert.notEqual(task.done, taskEvent.done);
    assert.equal(task.done, taskEvent2.done);
  });
});
