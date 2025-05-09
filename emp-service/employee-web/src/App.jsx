import './App.css'
import { useTable } from 'react-table'
import * as React from 'react'
import { useState } from 'react'
import axios from 'axios'

function App() {
  const [employees, setEmployees] = useState([]);

  const columns = React.useMemo(() => [
    {
      Header: 'Employee ID',
      accessor: 'employeeId'
    },
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Manager',
      accessor: 'manager'
    },
    {
      Header: 'Salary',
      accessor: 'salary'
    }
  ], []);

  const data = React.useMemo(() => employees, [employees]);

  const [employeeData, setEmployeeData] = useState({name:'', manager:'', salary:''});

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data });

const getAllEmployees = () => {
  axios.get('http://localhost:8080/employees').then((res)=>{
    console.log(res.data);
    setEmployees(res.data);
  });
}

const handleSubmit=async (e) => {
  e.preventDefault();
  await axios.post('http://localhost:8080/employees', employeeData).then((res)=>{
    console.log(res.data);
  })
}

const handleChange = (e) => {
  setEmployeeData({
    ...employeeData,
    [e.target.name]: e.target.value
  });
}

React.useEffect(() => {
  getAllEmployees();
}
, []);

  return (
    <>
      <div className='main-container'>
        <h3>Employee Management System</h3>
        <div className="add-panel">
          <div className='addpaneldiv'>
            <label htmlFor="name">Name</label><br />
            <input className='addpanelinput' value={employeeData.name} type="text" onChange={handleChange} id='name' name='name' />
          </div>
          <div className='addpaneldiv'>
            <label htmlFor="manager">Manager</label><br />
            <input className='addpanelinput' value={employeeData.manager} type="text" onChange={handleChange} id='manager' name='manager' />
          </div>
          <div className='addpaneldiv'>
            <label htmlFor="salary">Salary</label><br />
            <input className='addpanelinput' value={employeeData.salary} type="text" onChange={handleChange} id='salary' name='salary' />
          </div>
          <button
            className='addBtn'
            onClick={() => {
              const name = document.getElementById('name').value;
              const manager = document.getElementById('manager').value;
              const salary = document.getElementById('salary').value;
              if (name && manager && salary) {
                setEmployees(prev => [
                  ...prev,
                  { employeeId: prev.length + 1, name, manager, salary }
                ]);
              }
            }}
          >
            Add
          </button>
          <button className='cancelBtn'>Cancel</button>
        </div>
        <input className='searchinput' type='search' name='inputsearch' id='inputsearch' placeholder='Search Employee' />
      </div>

      <table className='table' {...getTableProps()}>
        <thead>
          {headerGroups.map(hg => (
            <tr {...hg.getHeaderGroupProps()} key={hg.getHeaderGroupProps().key}>
              {hg.headers.map(column => (
                <th {...column.getHeaderProps()} key={column.getHeaderProps().key}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.getRowProps().key}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} key={cell.getCellProps().key}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  )
}

export default App;
