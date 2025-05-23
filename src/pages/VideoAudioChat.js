import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaVideo, FaPhoneAlt, FaCalendarAlt, FaMapMarkerAlt, FaSignOutAlt, FaXRay } from 'react-icons/fa';

const VideoAudioChat = () => {
  const [isVideoCall, setIsVideoCall] = useState(true); // Toggle between video and audio call
  const videoRef = useRef(null); // Ref to the video element for the local video stream
  const [stream, setStream] = useState(null); // Store the video stream
  const [isCallEnded, setIsCallEnded] = useState(false); // To track if the call has ended
  const [isRinging, setIsRinging] = useState(false); // To track if audio call is ringing
  const ringingSound = useRef(new Audio('../src/assets/mixkit-office-telephone-ring-1350.mp3')); // Audio element for ringing sound

  useEffect(() => {
    if (isVideoCall) {
      startVideo();
    } else {
      if (isRinging) {
        ringingSound.current.play(); // Play the ringing sound when audio call starts
      }
    }

    return () => {
      stopVideo(); // Clean up the stream when the component unmounts
    };
  }, [isVideoCall]);

  const startVideo = async () => {
    try {
      const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(userMediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = userMediaStream; // Set the video element source to the media stream
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };

  const stopVideo = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop()); // Stop all tracks to release camera resources
      setStream(null);
    }
  };

  const endCall = () => {
    stopVideo(); // Stop the video stream
    setIsCallEnded(true); // Mark the call as ended
    setIsRinging(false); // Stop the ringing sound if any
  };

  const startRinging = () => {
    setIsRinging(true); // Start ringing when switching to audio call
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      {/* Sidebar */}
      <div style={{
        width: '250px',
        backgroundColor: '#004d40',
        color: '#fff',
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        boxShadow: '5px 0 15px rgba(0, 0, 0, 0.1)',
        height: '100vh',
        fontFamily: 'Times New Roman',
      }}>
        <h2 style={{
          fontSize: '26px',
          marginBottom: '40px',
          fontFamily: 'Times New Roman',
          color: '#f0f0f0'
        }}>
          Video/Audio Chat
        </h2>

        <a href="/patient" style={linkStyle}>
          <FaUser style={{ marginRight: '12px' }} /> Dashboard
        </a>

        <a href="/patient/appointments" style={linkStyle}>
          <FaCalendarAlt style={{ marginRight: '12px' }} /> Appointments
        </a>

        <a href="/patient/patient-prescription" style={linkStyle}>
          <FaMapMarkerAlt style={{ marginRight: '12px' }} /> Medical History
        </a>

        <a href="/patient/scan-patient" style={linkStyle}>
          <FaXRay style={{ marginRight: '12px' }} /> Scans
        </a>

        <a href="#" style={linkStyle}>
          <FaSignOutAlt style={{ marginRight: '12px' }} /> Logout
        </a>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#f4f4f4' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#00796b', fontFamily: 'Times New Roman' }}>Video/Audio Chat</h1>

        <div style={chatContainerStyle}>
          {/* Chat UI */}
          <div style={chatBoxStyle}>
            <div style={chatHeaderStyle}>
              <h3 style={{ color: '#fff', fontFamily: 'Times New Roman' }}>Doctor: Dr. Smith</h3>
              {/* Video/Audio Toggle Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <button
                  onClick={() => {
                    setIsVideoCall(true);
                    setIsCallEnded(false); // Reset call end state when switching to video
                  }}
                  style={callButtonStyle}
                >
                  <FaVideo style={{ marginRight: '8px' }} /> Video Call
                </button>
                <button
                  onClick={() => {
                    setIsVideoCall(false);
                    startRinging(); // Start ringing sound for audio call
                    setIsCallEnded(false); // Reset call end state when switching to audio
                  }}
                  style={callButtonStyle}
                >
                  <FaPhoneAlt style={{ marginRight: '8px' }} /> Audio Call
                </button>
              </div>
            </div>

            {/* Video/Audio Call */}
            <div style={callAreaStyle}>
              {isCallEnded ? (
                <div style={videoCallAreaStyle}>
                  <h4 style={{ color: '#00796b' }}>Video chat is ended</h4>
                </div>
              ) : isVideoCall ? (
                <div style={videoCallAreaStyle}>
                  <h4 style={{ color: '#00796b' }}>Video Call is Ongoing</h4>
                  {/* Video element to display the local stream */}
                  <div style={videoScreenStyle}>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      style={{ width: '100%', height: '100%', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              ) : (
                <div style={audioCallAreaStyle}>
                  <h4 style={{ color: '#00796b' }}>Audio Call is Ongoing</h4>
                  {/* Placeholder for audio stream */}
                  <div style={audioScreenStyle}>
                    <p style={{ color: '#00796b' }}>Audio Stream Here</p>
                  </div>
                </div>
              )}
            </div>

            {/* End Call Button */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={endCall} style={endCallButtonStyle}>End Call</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const linkStyle = {
  color: '#f0f0f0',
  textDecoration: 'none',
  fontSize: '18px',
  padding: '12px 0',
  display: 'flex',
  alignItems: 'center',
  transition: '0.3s',
  fontFamily: 'Times New Roman',
  width: '100%',
};

const chatContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#fff',
  borderRadius: '8px',
  padding: '20px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const chatBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '500px',
};

const chatHeaderStyle = {
  backgroundColor: '#00796b',
  padding: '10px',
  borderRadius: '8px 8px 0 0',
  width: '100%',
  textAlign: 'center',
};

const callAreaStyle = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
};

const videoCallAreaStyle = {
  textAlign: 'center',
  width: '80%',
  backgroundColor: '#f4f4f4',
  borderRadius: '8px',
  padding: '20px',
  border: '2px solid #00796b',
};

const videoScreenStyle = {
  width: '100%',
  height: '300px',
  backgroundColor: '#e0e0e0',
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
};

const audioCallAreaStyle = {
  textAlign: 'center',
  width: '80%',
  backgroundColor: '#f4f4f4',
  borderRadius: '8px',
  padding: '20px',
  border: '2px solid #00796b',
};

const audioScreenStyle = {
  width: '100%',
  height: '50px',
  backgroundColor: '#e0e0e0',
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
};

const endCallButtonStyle = {
  backgroundColor: '#d32f2f',
  color: '#fff',
  border: 'none',
  padding: '12px 20px',
  fontSize: '16px',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: '0.3s',
  width: '100%',
};

const callButtonStyle = {
  backgroundColor: '#00796b',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  fontSize: '16px',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: '0.3s',
};

export default VideoAudioChat;
