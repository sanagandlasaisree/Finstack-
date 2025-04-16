import React from 'react';
import TaskList from './components/TaskList';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <div className="container py-4">
      <TaskList />
    </div>
  );
}

export default App;
