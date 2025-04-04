import { Component, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import axios from "axios";

const Login = (selectedRole) => {
    const [credentials, setCredentials] = useState({username: "", password: "", role: selectedRole});
    const [usersArray, setUsersArray] = useState([]);
    const [validCred, setValidCred] = useState(false);


    const handleChange = (event) => {
        const {name, value} = event.target;
        setCredentials( (prev) => {
            return {
                ...prev,
                [name]: value,
            }
        });
    }

    const checkCredentials = async(event) => {
        try {
            const users = await axios.get("http://127.0.0.1:8000/users");
            setUsersArray(users.data);
            console.log("users: ", users.data);
        } catch (error) {
            console.error("Error getting data: ", error);
        }

        let result = usersArray.filter((user) => {user.username == credentials.username && user.password == credentials.password && user.role == selectedRole});
        if(result !== null){
            setValidCred(true);
            /* Go to inventory and pass on role */
        }else{
            const usernameInput = document.getElementById("username");
            const passwordInput = document.getElementById("password");
            usernameInput.style.border = "4px solid red";
            .style.border = "4px solid red";

        }
    }

    return(
        <div className='login'>
            <div className="w-full max-w-xs">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    {
                        
                    }
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="username" type="text" placeholder="Username" onChange={handleChange}/>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                        id="password" type="password" placeholder="******************"  onChange={handleChange} />
                        <p className="text-red-500 text-xs italic">Please choose a password.</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                            Sign In
                        </button>
                        <a className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-blue-800" href="#">
                            Forgot Password?
                        </a>
                    </div>
                </form>
                <p className="text-center text-gray-500 text-xs">
                    &copy;2025 Retriever&apos;s Essentials. All rights reserved.
                </p>
            </div>
        </div>
    )
}

export default Login;
