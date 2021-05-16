const socket = io()

let name
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
var audio=new Audio('ting.mp3')

do {
    name=prompt('Please enter your name: ')
} while(!name)
socket.emit('new-user-joined', name)
socket.on('join', name=>{
    appendMessage({user:` `,message:`"${name}" joined the chat`}, 'center')
})
textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})


function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    if(type =='incoming')
    {
        audio.play()
    }
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}
socket.on('left', name=>{
    appendMessage({user:` `,message:`"${name}" left the chat`}, 'center')
})