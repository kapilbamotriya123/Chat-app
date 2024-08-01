import { useContext, useEffect, useState } from "react"
import { UserContext } from "../userContext"

import SidebarLeft from "./SidebarLeft"
import MessageForm from "./MessageForm"

const ChatPage = () => {
    const [ws, setWs] = useState(null)
    const [onlinePeople, setOnlinePeople] = useState([])
    const [selectedUsername, setSelectedUsername] = useState(null)
    const [newMessageText, setNewMessageText] = useState('')
    const [messages, setMessages] = useState([])
    

    const {loggedInUsername, id} = useContext(UserContext);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001')
        setWs(ws)
        ws.addEventListener('message', handleMessage)
    }, [])

    const contactsToShow = onlinePeople.filter(person => person !== loggedInUsername)

    const showOnlinePeople = (peopleArray) => {
        const uniqueUsernames = [];
        peopleArray.forEach((person) => {
          if (!uniqueUsernames.includes(person.username)) {
            uniqueUsernames.push(person.username);
          }
        });
        setOnlinePeople(uniqueUsernames);
      };
      
    const sendMessage=(event) => {
        event.preventDefault()
        ws.send(JSON.stringify({
            recipient: selectedUsername,
            text: newMessageText
        }))
        setMessages(messages.concat({text: newMessageText, isOur: true}))
        setNewMessageText('')
    } 

    const handleMessage = (event) => {
        const messageData = JSON.parse(event.data)
        
        if('online' in messageData) {
            //right now the array of message data contains repeated value of users for multiple requests
            showOnlinePeople(messageData.online)
        } else {
            setMessages(messages.concat({text: messageData.text, isOur: false}))
        }
    }

   

    return (
        <div className="flex h-screen">
            <SidebarLeft
                loggedInUsername ={loggedInUsername}
                contactsToShow = {contactsToShow}
                setSelectedUsername = {setSelectedUsername}
                selectedUsername = {selectedUsername}
            />
            <div className="bg-blue-100 w-2/3 p-2 flex flex-col">
                <div className="flex-grow">
                    {!selectedUsername && (
                        <div className="flex items-center h-full justify-center">
                            <div className="text-gray-400">&larr; Select a contact to chat</div>
                        </div>
                    )}
                    {selectedUsername && (
                        <div>
                            {messages.map(message => (
                                 <div>
                                    {message.text}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {selectedUsername && (
                    <MessageForm
                        sendMessage = {sendMessage}
                        newMessageText = {newMessageText} 
                        setNewMessageText = {setNewMessageText} 
                    />
                )}
                
            </div>
        </div>
    )
}

export default ChatPage