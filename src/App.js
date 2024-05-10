import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/students')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editing) {
      axios.put(`http://localhost:3001/students/${id}`, { name, studentId })
        .then(response => {
          setStudents(students.map(student => student.id === id ? { ...response.data } : student));
          setEditing(false);
          setId(null);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      axios.post('http://localhost:3001/students', { name, studentId })
        .then(response => {
          setStudents([...students, response.data]);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/students/${id}`)
      .then(response => {
        setStudents(students.filter(student => student.id !== id));
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleEdit = (id) => {
    axios.get(`http://localhost:3001/students/${id}`)
      .then(response => {
        setName(response.data.name);
        setStudentId(response.data.studentId);
        setEditing(true);
        setId(id);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h1 className="text-3xl font-bold mb-4">Students CRUD App</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Name:
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} className="block w-full pl-10 text-sm text-gray-700" />
        </label>
        <label className="block mb-2">
          Student ID:
          <input type="text" value={studentId} onChange={(event) => setStudentId(event.target.value)} className="block w-full pl-10 text-sm text-gray-700" />
        </label>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{editing ? 'Update' : 'Create'}</button>
      </form>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Student ID</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="px-4 py-2">{student.name}</td>
              <td className="px-4 py-2">{student.studentId}</td>
              <td className="px-4 py-2">
                <button onClick={() => handleEdit(student.id)} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(student.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

