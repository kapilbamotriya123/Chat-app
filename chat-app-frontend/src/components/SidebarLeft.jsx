import Logo from "./Logo"
import Avatar from "./Avatar"

const SidebarLeft = ({loggedInUsername, contactsToShow, setSelectedUsername, selectedUsername}) => {
    return (
        <div className="bg-white w-1/3  pt-4"> 
                <Logo/>
                {loggedInUsername}
                {contactsToShow.map(username => (
                    <div key={username} onClick={ () => setSelectedUsername(username)} 
                        className={"border-b border-gray-100 flex items-center gap-2 cursor-pointer" + (username === selectedUsername ? " bg-blue-50 " : "")}>
                        {username === selectedUsername && (
                            <div className="w-1 bg-blue-500 h-12"></div>
                        )}
                        <div className="flex items-center gap-2  py-2 pl-4">
                            <Avatar username={username} />
                            <span className="font-">{username}</span>
                        </div>
                    </div>
                ))}
            </div>
    )
}

export default SidebarLeft