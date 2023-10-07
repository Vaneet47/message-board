import React, { useEffect, useState } from 'react';
import './main.css';
import moment from 'moment';

const apiUrl = 'https://mapi.harmoney.dev/api/v1/messages/';
const headers = { Authorization: '0LZER559TVedxahu' };

function Main() {
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([]);

  const getMessages = () => {
    fetch(apiUrl, {
      headers: headers,
    })
      .then((res) => res.json())
      .then((result) => setMessages(result));
  };

  useEffect(() => {
    getMessages();
  }, []);

  const handlePost = () => {
    fetch(apiUrl, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputVal }),
    }).then((res) => {
      getMessages();
      setInputVal('');
    });
  };

  const handleInputVal = (e) => {
    setInputVal(e.target.value);
  };

  const deleteMessage = (id) => {
    const result = handleDelete(id);
    result.then(() => getMessages());
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
    let promises = ids.map(handleDelete);
    try {
      await Promise.all(promises);
      getMessages();
    } catch (error) {}
  };

  return (
    <div className='main'>
      <div className='cta-container'>
        <input className='cta' value={inputVal} onChange={handleInputVal} />
        <button className='cta btn' onClick={handlePost}>
          Post!
        </button>
        <button className='cta btn delete' onClick={handleDeleteAll}>
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
    </div>
  );
}

export default Main;
