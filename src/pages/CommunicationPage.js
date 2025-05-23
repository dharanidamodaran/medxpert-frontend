import React, { useState } from 'react';
import {  FaPhoneSlash, FaVideo, FaPaperPlane, FaCommentDots,  } from 'react-icons/fa';

const CommunicationPage = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { text: message, sender: 'You' }]);
            setMessage('');
        }
    };

    return (
        <div style={containerStyle}>
            
            {/* HEADER */}
            <h2 style={headerStyle}>💬 Communication Panel</h2>

            <div style={contentContainer}>
                {/* CHAT SECTION */}
                <div style={sectionStyle}>
                    <h3 style={titleStyle}><FaCommentDots /> Live Chat</h3>
                    <div style={chatBox}>
                        {messages.map((msg, index) => (
                            <div key={index} style={messageStyle}>
                                <strong>{msg.sender}:</strong> {msg.text}
                            </div>
                        ))}
                    </div>
                    
                    <div style={inputContainer}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            style={inputStyle}
                        />
                        <button onClick={sendMessage} style={sendButton}>
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>

                

                {/* VIDEO CALL SECTION */}
                <div style={sectionStyle}>
                    <h3 style={titleStyle}><FaVideo /> Video Call</h3>
                    <div style={videoBox}>[Video Stream Placeholder]</div>
                    <div style={controls}>
                        <button style={callBtn}><FaVideo /> Turn Off</button>
                        <button style={endCallBtn}><FaPhoneSlash /> End Call</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh'
};

const headerStyle = {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#00796b',
    fontFamily: 'Times New Roman'
};

const contentContainer = {
    display: 'flex',
    gap: '30px',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1200px'
};

const sectionStyle = {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const titleStyle = {
    fontSize: '22px',
    color: '#00796b',
    marginBottom: '15px'
};

/* Chat Styles */
const chatBox = {
    flex: 1,
    width: '100%',
    height: '250px',
    overflowY: 'auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px'
};

const messageStyle = {
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#e0f2f1',
    width: '100%'
};

const inputContainer = {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    width: '100%'
};

const inputStyle = {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px'
};

const sendButton = {
    backgroundColor: '#00796b',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer'
};

/* Audio Call Styles */
const callBox = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    justifyContent: 'center',
    height: '250px',
    width: '100%',
    backgroundColor: '#e0f2f1',
    borderRadius: '8px'
};

const controls = {
    display: 'flex',
    gap: '15px'
};

const callBtn = {
    backgroundColor: '#00796b',
    color: '#fff',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
};

const endCallBtn = {
    backgroundColor: '#d32f2f',
    color: '#fff',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
};

/* Video Call Styles */
const videoBox = {
    width: '100%',
    height: '250px',
    backgroundColor: '#ccc',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#555',
    fontSize: '18px',
    marginBottom: '15px'
};

export default CommunicationPage;
