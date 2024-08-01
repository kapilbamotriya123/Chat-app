import axios from 'axios';
import { createContext, useState , useEffect} from 'react';

const UserContext = createContext({})

const UserContextProvider = ({children}) => {
    const [loggedInUsername, setLoggedInUsername] = useState(null)
    const [id, setId]  = useState(null)

    useEffect( () => {
        axios.get('/profile').then((response) => {
            
            
            setLoggedInUsername(response.data.username)
            setId(response.data.userId)
        });
    }, []);
    
    return (
        <UserContext.Provider value = {{loggedInUsername,setLoggedInUsername , id, setId}}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserContextProvider };