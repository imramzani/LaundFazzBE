import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import { Chat } from "./ChatBox";
const socket = io.connect("http://localhost:3000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShow] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShow(true);
    }
  };
  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join a chat</h3>
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Name"
          />
          <input
            type="text"
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Room ID"
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
