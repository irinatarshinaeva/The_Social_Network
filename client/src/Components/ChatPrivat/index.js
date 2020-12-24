import React, { useState, useEffect, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './index.css'
import LightSpeed from 'react-reveal/LightSpeed';
import { useParams } from 'react-router-dom';
import { chatPrivatThunk } from '../../redux/creators/posts';
import { TextField, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';


function Chat() {

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { id } = useParams()
  const dispatch = useDispatch()
  const posts = useSelector((state) => state)
  const socket = useSelector(state => state.socket)
  console.log('posts', posts.socket.id);
  const ID = posts.socket.id

  useEffect(() => {


    dispatch(chatPrivatThunk(id))

    socket.on("private message", async (allMessages) => {
      hashMessege(allMessages)
    })


    return () => {
      dispatch(chatPrivatThunk())
    }
  }, [])

  function hashMessege(someMessage) {
    setMessages(oldMsgs => [...oldMsgs, someMessage])
  }

  const handleChange = (e) => {
    setMessage(e.target.value);
  }

  const submitHandler = (e) => {
    e.preventDefault()
    const messageObjectPrivate = {
      message: message,
      id: id,
      yourId: socket.id,
    }
    setMessage('')
    socket.emit('message notification', {
      title: 'Вам пришло сообщение!',
      wrongID: id,
      offenderSocketID: socket.id
    })
    socket.emit("message", messageObjectPrivate)

  }


  return (
    <>
      <section className="chat">
        {messages.map((message, index) => {

          return (<div className=
            {`${message.yourId === ID ? 'myRow' : 'partnerRow'}`}
            key={index}>
            <div className={`${message.yourId === ID ? 'myMessage' : 'partnerMessage'}`}>
              {message.yourId === ID ? (<LightSpeed left>{message.message}</LightSpeed>)
                : (<LightSpeed right>{message.message}</LightSpeed>)}</div>
          </div>
          )
        })}
      </section>

      <form onSubmit={submitHandler} name="chatForm">
        <label>
          Сообщение:
            <input value={message} onChange={handleChange} placeholder="Say something..." name="message2" type="text" />
        </label>
        <button>Отправить</button>
      </form>
    </>
  )

}


export default Chat;

//  {/* <>
//         {/* <h1>1111111111111111</h1> */}
//         {/* <section className="chat">
//           {messages.map((message, index) => {
//             return (<div className={`${message.id === yourId ? 'myRow' : 'partnerRow'}`} key={index}><div className={`${message.id === yourId ? 'myMessage' : 'partnerMessage'}`}>{message.id === yourId ? (<LightSpeed left>{message.body}</LightSpeed>) : (<LightSpeed right>{message.body}</LightSpeed>)}</div></div>)
//           })}
//         </section> */}
//         {/* <section className="chat">
//           {messages.map((message, index) => {
//             return (

//             <div>
//               {message.message}
//             </div>
//             )
//           })}
//         </section>

//         <form onSubmit={submitHandler} name="chatForm">
//           <label>
//             Сообщение:
//             <input value={message} onChange={handleChange} placeholder="Say something..." name="message2" type="text" />
//           </label>
//           <button>Отправить</button>
//         </form>
//       </> */} */}
// {/* <section className="chat">
//         {messages.map((message, index) => {
//           return (<div className={`${message.id === yourID ? 'myRow' : 'partnerRow'}`} key={index}><div className={`${message.id === yourID ? 'myMessage' : 'partnerMessage'}`}>{message.id === yourID ? (<LightSpeed left>{message.message}</LightSpeed>) : (<LightSpeed right>{message.message}</LightSpeed>)}</div></div>)
//         })}
//       </section>

//       <form onSubmit={submitHandler} name="chatForm">
//         <label>
//           Сообщение:
//           <input value={message} onChange={handleChange} placeholder="Say something..." name="message2" type="text" />
//         </label>
//         <button>Отправить</button>
//       </form> */}
