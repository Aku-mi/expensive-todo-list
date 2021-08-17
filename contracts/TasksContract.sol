// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TasksContract {
    uint256 public taskCounter;

    constructor() {
        taskCounter = 0;
        createTask("title", "description");
    }

    event TaskCreated(
        uint256 id,
        string title,
        string description,
        bool done,
        uint256 createdAt
    );

    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    mapping(uint256 => Task) public tasks;

    function createTask(string memory _title, string memory _description)
        public
    {
        tasks[taskCounter] = Task(
            taskCounter,
            _title,
            _description,
            false,
            block.timestamp
        );
        emit TaskCreated(
            taskCounter,
            _title,
            _description,
            false,
            block.timestamp
        );
        taskCounter++;
    }

    function toggleDone(uint256 _id) public {
        tasks[_id].done = !tasks[_id].done;
        emit TaskCreated(
            tasks[_id].id,
            tasks[_id].title,
            tasks[_id].description,
            tasks[_id].done,
            tasks[_id].createdAt
        );
    }
}
