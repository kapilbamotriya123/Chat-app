const MessageForm = ({sendMessage, newMessageText, setNewMessageText}) => {
    return (
        <form className="flex gap-2 " onSubmit={sendMessage} >
                    <input 
                        type = 'text' 
                        value={newMessageText}
                        onChange={(event) => {setNewMessageText(event.target.value)}}
                        placeholder="type you message" 
                        className="bg-white border flex-grow p-2 rounded-sm"/>
                    <button type="submit" className="bg-blue-500 p-2 text-white  rounded-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </button>   
        </form>
    )
}

export default MessageForm