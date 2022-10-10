$(function(){
  
    
    const socket= io()


// opteniendo los elementos del DOM desde la interfaz nickname

const $nickForm=$('#nickForm')
const $nickError=$('#nickError')
const $nickname=$('#nickname')

const $users=$('#usernames')

const $userTitle=$('#userTitle')

// captura de los eventos nickname

$nickForm.submit(e=>{
    e.preventDefault()

    socket.emit('new user', $nickname.val(), data=>{
        if(data){
            $('#nickWrap').hide()
            $('#contentWrap').show();
            $userTitle.html(`${$nickname.val()}`)
        }else{
            $nickError.html(`
            <div class=" alert alert-danger">
            The user already exist
            </div>
            `)
        }
    })


    

})


// opteniendo los elementos del DOM desde la interfaz

const $messageForm=$('#message-form')
const $messageBox=$('#message')
const $chat=$('#chat')


// captura de los eventos 

$messageForm.submit(e=>{
    e.preventDefault()
    socket.emit('send message',$messageBox.val(),data=>{
        $chat.append(`<p class="error">${data}</p>`)
    })
    $messageBox.val('')
})


socket.on('new message',function(data){
    $chat.append('<b>'+data.nick +'</b>: '+data.msg+'<br>')
})



socket.on('usernames',data=>{
   
   let html='';

    for(let i=0; i<data.length;i++){
        html+=`<p><i class="bi bi-person-fill mr-2"></i>${data[i]}</p>`
       
    }


$users.html(html)
})

socket.on('whisper',data=>{
    $chat.append(`<p class="whisper"><b>${data.nick}</b>${data.msg}</p>`)
})

socket.on('load old msgs',msgs=>{
    for (let i=0;i<msgs.length;i++){
        displayMsg(msgs[i])
        
    }
})


function displayMsg(data){
    $chat.append(`<p class="whisper"><b>${data.nick}: </b>${data.msg}</p>`)
}


})