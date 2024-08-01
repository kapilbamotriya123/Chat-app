import { useContext, useState } from "react"
import userService from '../services/userService.js'
import {UserContext} from "../userContext.jsx"
import ChatPage from "./Chatpage.jsx"


const Register = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('register')
    const {loggedInUsername, setLoggedInUsername, id, setId} = useContext(UserContext)

    
    const login = async(event) => {
        event.preventDefault()
        const data = await userService.login({username, password})

        setLoggedInUsername(data.username)
        setId(data.id)
    }
    
    const register = async (event) => {
        event.preventDefault()
        const data = await userService.register({username, password})
        
        setLoggedInUsername(data.username)
        setId(data.id)
    }

    let userSubmit = isLoginOrRegister === 'register' ? register : login;


   if(loggedInUsername) {
    return <ChatPage />
   }


    return (
        <div className="bg-blue-50 h-screen flex items-center">
            <form onSubmit={userSubmit} className="w-84 mx-auto mb-12">
                <input value = {username} 
                       onChange={({target}) => {setUsername(target.value)}}
                       type="text" placeholder="username" 
                       className="block w-full rounded-sm p-2 mb-2 border"/>

                <input value = {password} 
                       onChange={({target}) => {setPassword(target.value)}}
                       type='password' placeholder="password" 
                       className="block w-full rounded-sm p-2 mb-2 border"/>


                <button
                    type="submit" 
                    className="bg-blue-500 text-white block w-full p-2 rounded-sm">
                        {isLoginOrRegister === 'register' ? "Register" : "Login"}
                </button>

                {isLoginOrRegister === "register" && (
                    <div className="text-center mt-2 w-full">
                        ALready a member? 
                        <button onClick={() => {setIsLoginOrRegister("login")}}>
                            Login here
                        </button>
                    </div>
                )}

                {isLoginOrRegister === "login" && (
                    <div className="text-center mt-2 w-full">
                        Don't have an account?
                        <button onClick={() => setIsLoginOrRegister('register')}>
                            Register here
                        </button>
                    </div>
                )}
                
            </form>
        </div>
    )
}
export default Register 