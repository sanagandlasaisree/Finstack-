import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask, updateTask, createTask } from '../api';

import TaskForm from './TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const loadTasks = async () => {
    const res = await getTasks(filters);
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const handleStatusChange = async (task) => {
    await updateTask(task.id, { status: task.status === 'open' ? 'closed' : 'open' });
    loadTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    loadTasks();
  };

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const headerTitle = () => {
    if (filters.task_type) return `${filters.task_type.charAt(0).toUpperCase() + filters.task_type.slice(1)} Tasks`;
    return 'All Tasks';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{headerTitle()}</h2>
        <button className="btn btn-success rounded-circle" onClick={() => setShowForm(true)}><i className="bi bi-plus"></i></button>
      </div>

      <div className="row g-2 mb-3">
        <div className="col">
          <input name="contact_person" className="form-control" placeholder="Contact Person" onChange={handleFilterChange} />
        </div>
        <div className="col">
          <input name="task_type" className="form-control" placeholder="Task Type" onChange={handleFilterChange} />
        </div>
        <div className="col">
          <input name="entity_name" className="form-control" placeholder="Entity Name" onChange={handleFilterChange} />
        </div>
        <div className="col">
          <select name="status" className="form-select" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="col-auto">
          <button onClick={loadTasks} className="btn btn-secondary"><i className="bi bi-funnel"></i> Apply</button>
        </div>
      </div>
      {Object.keys(filters).length > 0 && (
  <div className="mb-3">
    {Object.entries(filters).map(([key, val]) =>
      val && (
        <span key={key} className="badge bg-primary me-2 d-inline-flex align-items-center">
          {val}
          <button
            type="button"
            className="btn-close btn-close-white ms-2"
            style={{ fontSize: '0.6rem' }}
            onClick={() => {
              const updatedFilters = { ...filters };
              delete updatedFilters[key]; // Remove just that filter
              setFilters(updatedFilters);
            }}
          ></button>
        </span>
      )
    )}
  </div>
)}


      {tasks.length === 0 ? (
        <div className="alert alert-warning">
          {Object.keys(filters).length ? 'No tasks match your filters.' : 'There are no tasks created yet. Use the + button to add a task.'}
        </div>
      ) : (
        <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Entity Name</th>
            <th>Task Type</th>
            <th>Contact Person</th>
            <th>Notes</th>
            <th>Status</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => {
            // If task.task_time contains both date & time (e.g. "2025-04-16T15:30"), split it:
            const [date, time] = task.task_time.split('T');
      
            return (
              <tr key={task.id}>
                <td>{date}</td>
                <td>{time}</td>
                <td>{task.entity_name}</td>
                <td className="d-flex align-items-center gap-1">
                  {task.task_type === 'Meeting' ? (
                    <i className="bi bi-geo-alt-fill text-primary"></i>
                  ) : (
                    <i className="bi bi-telephone-fill text-success"></i>
                  )}
                  {task.task_type}
                </td>
                <td>{task.contact_person}</td>
                <td className="text-truncate" style={{ maxWidth: '200px' }}>{task.note}</td>
                <td>
                  <span className={`badge ${task.status === 'open' ? 'text-warning' : 'text-success'}`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="dropdown">
                    <button className="btn btn-light dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown">
                      Options
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button className="dropdown-item" onClick={() => { setEditTask(task); setShowForm(true); }}>
                          Update
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={() => handleDelete(task.id)}>
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      )}

      {showForm && (
        <TaskForm
          task={createTask}
          onSave={async (taskData) => {
            if (taskData.id) await updateTask(taskData.id, taskData);
            else await createTask(taskData);
            loadTasks();
          }}
          onClose={() => { setEditTask(null); setShowForm(false); }}
        />
      )}
    </div>
  );
};

export default TaskList;
