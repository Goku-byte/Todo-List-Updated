import React, { useState, useEffect } from "react";
import { Table, Input, Select, Popconfirm, Button } from "antd";
import moment from "moment";
import "../App.css";
const { Option } = Select;

const TodoListTable = () => {
  const [dataSource, setDataSource] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("Low");
  const [newDeadline, setNewDeadline] = useState("");
  const [newStatus, setNewStatus] = useState("Incomplete");
  const [editingKey, setEditingKey] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setDataSource(tasks);
  }, []);

  const handleAddRow = () => {
    const newTaskObj = {
      key: dataSource.length + 1,
      task: newTask,
      priority: newPriority,
      deadline: newDeadline,
      status: newStatus,
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    setDataSource([...dataSource, newTaskObj]);

    localStorage.setItem("tasks", JSON.stringify([...dataSource, newTaskObj]));

    setNewTask("");
    setNewPriority("Low");
    setNewDeadline("");
    setNewStatus("Incomplete");
  };

  const handleEditRow = (key) => {
    setEditingKey(key);
  };

  const handleSaveRow = (key) => {
    const newDataSource = [...dataSource];
    const index = newDataSource.findIndex((item) => key === item.key);
    const task = newDataSource[index];
    newDataSource.splice(index, 1, { ...task });
    setDataSource(newDataSource);
    setEditingKey("");
    localStorage.setItem("tasks", JSON.stringify(newDataSource));
  };

  const handleCancelRow = () => {
    setEditingKey("");
  };

  const handleDeleteRow = (key) => {
    const newDataSource = dataSource.filter((item) => key !== item.key);
    setDataSource(newDataSource);
    localStorage.setItem("tasks", JSON.stringify(newDataSource));
  };

  const handleSaveCell = (record, dataIndex, value) => {
    const newDataSource = [...dataSource];
    const index = newDataSource.findIndex((item) => record.key === item.key);
    const task = newDataSource[index];
    newDataSource.splice(index, 1, { ...task, [dataIndex]: value });
    setDataSource(newDataSource);
    localStorage.setItem("tasks", JSON.stringify(newDataSource));
  };
  /* Styles for screens with a width of 600px or less */

  const columns = [
    {
      title: "Task",
      dataIndex: "task",
      key: "task",
      editable: true,
      sorter: (a, b) => {
        return a.task.toLowerCase().localeCompare(b.task.toLowerCase());
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      editable: true,
      render: (text, record) => (
        <Select
          defaultValue={text}
          onChange={(value) => handleSaveCell(record, "priority", value)}
        >
          <Option value="Low">Low</Option>
          <Option value="Medium">Medium</Option>
          <Option value="High">High</Option>
        </Select>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      editable: true,
      render: (text, record) => (
        <Input
          defaultValue={text}
          onChange={(e) => handleSaveCell(record, "deadline", e.target.value)}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      editable: true,
      render: (text, record) => (
        <Select
          defaultValue={text}
          onChange={(value) => handleSaveCell(record, "status", value)}
        >
          <Option value="Working">Working</Option>
          <Option value="Done">Done</Option>
          <Option value="Overdue">Overdue</Option>
        </Select>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a href="#!" onClick={() => handleSaveRow(record.key)}>
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={handleCancelRow}>
              <a href="#!" style={{ marginLeft: 8 }}>
                {" "}
                Cancel
              </a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <a
              href="#!"
              disabled={editingKey !== ""}
              onClick={() => handleEditRow(record.key)}
            >
              Edit
            </a>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDeleteRow(record.key)}
            >
              <a href="#!" style={{ marginLeft: 8 }}>
                Delete
              </a>
            </Popconfirm>
          </span>
        );
      },
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      width: "10%",
      render: (text) => (
        <span>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</span>
      ),
    },
  ];

  <Table dataSource={dataSource} columns={columns} />;

  const isEditing = (record) => record.key === editingKey;

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSaveCell: handleSaveCell,
      }),
    };
  });

  const sortTasksInAscending = () => {
    const sortedTasks = [...dataSource].sort((a, b) =>
      a.task.localeCompare(b.task)
    );
    setDataSource(sortedTasks);
  };

  const sortTasksInDescending = () => {
    const sortedTasks = [...dataSource].sort((a, b) =>
      b.task.localeCompare(a.task)
    );
    setDataSource(sortedTasks);
  };

  return (
    <div>
      <div>
        <h2>Todo-List</h2>
        <Input
          placeholder="Search"
          className="searchkey"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <Button className="btn" onClick={sortTasksInAscending}>
        Sort by Task in Ascending Order
      </Button>
      <Button className="btn" onClick={sortTasksInDescending}>
        Sort by Task in Descending Order
      </Button>
      <Table
        className="tabledata"
        rowClassName={() => "editable-row"}
        dataSource={dataSource.filter((item) =>
          item.task.toLowerCase().includes(searchText.toLowerCase())
        )}
        columns={mergedColumns}
        pagination={{ pageSize: 5 }}
      />
      <div className="inputbtn" style={{ marginTop: 16 }}>
        <Input
          className="task"
          placeholder="Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{ width: "20%", marginRight: 8 }}
        />
        <Select
          className="task"
          value={newPriority}
          onChange={(value) => setNewPriority(value)}
          style={{ width: "20%", marginRight: 8 }}
        >
          <Option value="Low">Low</Option>
          <Option value="Medium">Medium</Option>
          <Option value="High">High</Option>
        </Select>
        <Input
          className="task"
          placeholder="Deadline"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
          style={{ width: "20%", marginRight: 8 }}
        />
        <Select
          className="task"
          value={newStatus}
          onChange={(value) => setNewStatus(value)}
          style={{ width: "20%", marginRight: 8 }}
        >
          <Option value="Working">Working</Option>
          <Option value="Done">Done</Option>
          <Option value="Overdue">Overdue</Option>
        </Select>
        <Button className="btn2" onClick={handleAddRow} type="primary">
          Add
        </Button>
      </div>
    </div>
  );
};

export default TodoListTable;
