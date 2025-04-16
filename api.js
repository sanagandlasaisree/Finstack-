import axios from 'axios';

const API_BASE = 'http://localhost:5000/tasks';

export const getTasks = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    return await axios.get(`${API_BASE}?${params.toString()}`);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return { data: [] };
  }
};

export const createTask = async (task) => {
  try {
    return await axios.post(API_BASE, task);
  } catch (error) {
    console.error('Failed to create task:', error);
    throw error;
  }
};

export const updateTask = async (id, updates) => {
  try {
    return await axios.put(`${API_BASE}/${id}`, updates);
  } catch (error) {
    console.error('Failed to update task:', error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    return await axios.delete(`${API_BASE}/${id}`);
  } catch (error) {
    console.error('Failed to delete task:', error);
    throw error;
  }
};
