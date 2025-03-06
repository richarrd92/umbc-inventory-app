import { useState, useEffect, useCallback } from 'react'
import axios from "axios";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [userArray, setUserArray] = useState([]);
  const [itemArray, setItemArray] = useState([]);
  
  const fetchAPI = useCallback(async (params) => {
    try {
      const users = await axios.get("http://127.0.0.1:8000/users");
      const items = await axios.get("http://127.0.0.1:8000/items");
      console.log("users: ", users.data);
      console.log("data: ", items.data);
      setUserArray(users.data);
      setItemArray(items.data);
    } catch (error) {
      console.error("Error getting data: ", error);
    }
  }, []);

  useEffect(
    () => {fetchAPI()}
    , [fetchAPI]);

  return (
    <>
      <h1 className='text-3xl font-bold underline'>Welcome to Retriever Essentials!</h1>
      <div className="main-page">
        <br></br>
        <button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'>
          Get Users
        </button>
        <button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'>
          Get Items
        </button>
        <button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'>
          Admin Login
        </button>
      </div>
      <div>
        <table className='border-separate border-spacing-2 border'>
          <thead>
            <th>
              Name
            </th>
            <th>
              Username
            </th>
            <th>
              User Role
            </th>
          </thead>
          <tbody>
              {
                userArray.map((user) => {
                  return(
                      <tr key={user.id}>
                        <td>
                          {user.name}
                        </td>
                        <td>
                          {user.username}
                        </td>
                        <td>
                          {user.role}
                        </td>
                      </tr>
                    )
                  })
              }
          </tbody>
        </table>

        <table className='border-separate border-spacing-2 border'>
          <thead>
            <th>
              Item Name
            </th>
            <th>
              Quantity
            </th>
            <th>
              Restock Threshold
            </th>
          </thead>
          <tbody>
              {
                itemArray.map((item) => {
                  return(
                      <tr key={item.id}>
                        <td>
                          {item.name}
                        </td>
                        <td>
                          {item.quantity}
                        </td>
                        <td>
                          {item.restock_threshold}
                        </td>
                      </tr>
                    )
                  })
              }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
