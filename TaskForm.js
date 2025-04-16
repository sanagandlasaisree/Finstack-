import React, { useState, useEffect } from 'react';

const TaskForm = ({ onSave, task = {}, onClose }) => {
  const [form, setForm] = useState({
    entity_name: '',
    task_type: '',
    task_date: '',
    task_hour: '',
    task_minute: '',
    task_ampm: 'AM',
    contact_person: '',
    note: '',
    status: 'open'
  });

  useEffect(() => {
    if (task.id) {
      const [date, time] = task.task_time?.split(' ') || ['', ''];
      const [hour, minute] = time?.split(':') || ['', ''];
      setForm({
        ...task,
        task_date: date,
        task_hour: hour,
        task_minute: minute?.slice(0, 2),
        task_ampm: minute?.slice(2) || 'AM'
      });
    }
  }, [task]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const formattedTime = `${form.task_date} ${form.task_hour}:${form.task_minute}${form.task_ampm}`;
    onSave({ ...form, task_time: formattedTime });
    onClose();
    setForm({
      entity_name: '',
      task_type: '',
      task_date: '',
      task_hour: '',
      task_minute: '',
      task_ampm: 'AM',
      contact_person: '',
      note: '',
      status: 'open'
    });
  };

  return (
    <div className="modal show fade d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header justify-content-between">
            <div>
              <div> New Task</div>
              <div className="btn-group me-3">
                <input type="radio" className="btn-check" name="status" id="open" value="open"
                  checked={form.status === 'open'} onChange={handleChange} />
                <label className="btn btn-outline-primary" htmlFor="open">Open</label>

                <input type="radio" className="btn-check" name="status" id="closed" value="closed"
                  checked={form.status === 'closed'} onChange={handleChange} />
                <label className="btn btn-outline-primary" htmlFor="closed">Closed</label>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <input type="text" name="entity_name" className="form-control mb-2" placeholder="Entity Name" value={form.entity_name} onChange={handleChange} required />

              <select name="task_type" className="form-control mb-2" value={form.task_type} onChange={handleChange} required>
                <option value="">Select Task Type</option>
                <option value="Call">Call</option>
                <option value="Meeting">Meeting</option>
                <option value="Conference">Conference</option>
                <option value="Follow-up">Follow-up</option>
              </select>

              <div className="d-flex mb-2 gap-2">
                <input type="date" name="task_date" className="form-control" value={form.task_date} onChange={handleChange} required />

                <select name="task_hour" className="form-control" value={form.task_hour} onChange={handleChange} required>
                  <option value="">HH</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                    <option key={h} value={h < 10 ? `0${h}` : h}>{h}</option>
                  ))}
                </select>

                <select name="task_minute" className="form-control" value={form.task_minute} onChange={handleChange} required>
                  <option value="">MM</option>
                  {['00', '15', '30', '45'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <select name="task_ampm" className="form-control" value={form.task_ampm} onChange={handleChange}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>

              <input type="text" name="contact_person" className="form-control mb-2" placeholder="Contact Person" value={form.contact_person} onChange={handleChange} required />

              <textarea name="note" className="form-control mb-2" placeholder="Note (optional)" value={form.note} onChange={handleChange} />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Task</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
