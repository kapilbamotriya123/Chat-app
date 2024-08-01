const Avatar = (props) => {

    const colors = ['bg-blue-200', 'bg-red-200', 'bg-green-200',
                    'bg-purple-200', 'bg-teal-200', 'bg-yellow-200']
    //this parse int treats this user Id as hexadicimal and finds a number a then reminder with 6 gives a specifi number fot each userId
    const colorPicker = props.username.charCodeAt(0) % colors.length;
    const color = colors[colorPicker];
    return (
        <div className={`w-6 p-6 rounded-full h-6 flex items-center justify-center ${color}`}>
        <div className="flex items-center justify-center opacity-70">
            {props.username[0]}
        </div>        
    </div>
    )
}

export default Avatar