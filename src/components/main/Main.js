import React, { useEffect, useState } from 'react';
import './main.css';
import moment from 'moment';

const apiUrl = 'https://mapi.harmoney.dev/api/v1/messages/';
const headers = { Authorization: '0LZER559TVedxahu' };

function Main() {
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([]);

  const [popup, setPopup] = useState(false);
  const [loaderHidden, setLoaderHidden] = useState(true);

  const getMessages = async () => {
    setLoaderHidden(false);
    let res = await fetch(apiUrl, {
      headers: headers,
    });
    res = await res.json();
    setLoaderHidden(true);
    setMessages(res);
  };

  useEffect(() => {
    getMessages();
  }, []);

  const handlePost = async () => {
    if (!inputVal.trim().length) return;
    setLoaderHidden(false);
    let response = await fetch(apiUrl, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputVal }),
    });
    await response.json();
    setLoaderHidden(true);
    getMessages();
    setInputVal('');
  };

  const handleInputVal = (e) => {
    setInputVal(e.target.value);
  };

  const deleteMessage = (id) => {
    setLoaderHidden(false);
    const result = handleDelete(id);
    result.then(() => {
      setLoaderHidden(true);
      getMessages();
    });
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${apiUrl}${id}/`, {
      method: 'DELETE',
      headers: headers,
    });
    return res;
  };

  const handleDeleteAll = async () => {
    let ids = messages.map((item) => item.id);
    if (ids.length === 0) return;
    setLoaderHidden(false);
    let promises = ids.map(handleDelete);
    await Promise.all(promises);
    setLoaderHidden(true);
    getMessages();
  };

  const closePopup = () => {
    setPopup(false);
  };

  const handleYes = () => {
    setPopup(false);
    handleDeleteAll();
  };

  return (
    <div className='main'>
      <div className='cta-container'>
        <input className='cta' value={inputVal} onChange={handleInputVal} />
        <button className='cta btn' onClick={handlePost}>
          Post!
        </button>
        <button
          className='cta btn delete'
          onClick={() => {
            let ids = messages.map((item) => item.id);
            if (ids.length === 0) return;
            setPopup(true);
          }}
        >
          Delete All
        </button>
      </div>

      <div className='msg-conatiner'>
        {messages.map((item, index) => {
          return (
            <div className='msg' key={index}>
              <div className='msg-info'>
                <span className='material-symbols-rounded icon'>sms</span>
                <p className='src'>{item.source}</p>
                &nbsp;
                <p className='time'>-</p>
                &nbsp;
                <p className='time'>
                  {moment(item.timestamp).format('hh:mm:ss a')}
                </p>
                <button
                  className='delete-btn'
                  onClick={() => {
                    deleteMessage(item.id);
                  }}
                >
                  Delete
                </button>
              </div>
              <div className='msg-content'>{item.text}</div>
            </div>
          );
        })}
      </div>

      <div className='loader' hidden={loaderHidden}>
        <img src='loader.svg' alt='loading' />
      </div>

      {popup && (
        <div className='cross-popup'>
          <div className='popup-content'>
            <span className='close-button' onClick={closePopup}>
              &times;
            </span>
            <h2 className='dialog-title'>Disclaimer</h2>

            <p className='dialog-question'>Are you sure to delete them all?</p>

            <div className='buttons-container'>
              <button className='buttons' onClick={closePopup}>
                No
              </button>
              <button className='buttons' onClick={handleYes}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
