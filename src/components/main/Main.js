import React, { useEffect, useState } from 'react';
import './main.css';
import moment from 'moment';
import DialogBox from '../dialogBox/DialogBox';

const apiUrl = 'https://mapi.harmoney.dev/api/v1/messages/';
const headers = { Authorization: '0LZER559TVedxahu' };

function Main() {
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([]);
  const [checkedMsgs, setCheckedMsgs] = useState([]);

  const [popup, setPopup] = useState(false);
  const [order, setOrder] = useState('oldest first');
  const [popupSelected, setPopupSelected] = useState(false);
  const [loaderHidden, setLoaderHidden] = useState(true);

  const getMessages = async () => {
    setLoaderHidden(false);
    let res = await fetch(apiUrl, {
      headers: headers,
    });
    res = await res.json();
    setLoaderHidden(true);
    if (order === 'oldest first') {
      res = res.sort((x, y) => new Date(x.timestamp) - new Date(y.timestamp));
    } else {
      res = res.sort((x, y) => new Date(y.timestamp) - new Date(x.timestamp));
    }

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
      let checkedM = checkedMsgs.filter((item) => item !== id);
      setCheckedMsgs(checkedM);
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

  const handleDeleteMultiple = async (selected) => {
    let ids = messages.map((item) => item.id);
    if (selected) {
      ids = checkedMsgs;
      setCheckedMsgs([]);
    }
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
  const closePopupSelected = () => {
    setPopupSelected(false);
  };

  const handleDeleteAll = () => {
    setPopup(false);
    handleDeleteMultiple();
  };

  const handleDeleteSelected = () => {
    setPopupSelected(false);
    handleDeleteMultiple('selected');
  };

  const handleChecked = (id, e) => {
    if (e.target.checked) {
      let checkedM = [...checkedMsgs];
      checkedM.push(id);
      setCheckedMsgs(checkedM);
    } else {
      let checkedM = checkedMsgs.filter((item) => item !== id);
      setCheckedMsgs(checkedM);
    }
  };

  const handleSort = () => {
    let newMsgs;
    if (order === 'oldest first') {
      newMsgs = messages.sort(
        (x, y) => new Date(y.timestamp) - new Date(x.timestamp)
      );
      setOrder('most recent first');
    } else {
      newMsgs = messages.sort(
        (x, y) => new Date(x.timestamp) - new Date(y.timestamp)
      );
      setOrder('oldest first');
    }
    setMessages(newMsgs);
  };

  return (
    <div className='main'>
      <div className='cta-container'>
        <input className='cta' value={inputVal} onChange={handleInputVal} />
        <button
          className='cta btn'
          onClick={handlePost}
          disabled={inputVal.trim().length === 0}
        >
          Post!
        </button>
        <button
          className='cta btn delete'
          onClick={() => {
            let ids = messages.map((item) => item.id);
            if (ids.length === 0) return;
            setPopup(true);
          }}
          disabled={messages.length === 0}
        >
          Delete All
        </button>
        <button
          className='cta btn delete'
          onClick={() => {
            let ids = messages.map((item) => item.id);
            if (ids.length === 0) return;
            setPopupSelected(true);
          }}
          disabled={checkedMsgs.length === 0}
        >
          Delete Selected
        </button>
        <button
          className='cta btn sort'
          onClick={() => {
            handleSort();
          }}
          disabled={messages.length === 0}
        >
          {`Sort (currently ${order})`}
        </button>
      </div>

      <div className='msg-conatiner'>
        {messages.map((item, index) => {
          return (
            <div className='msg' key={index}>
              <div className='msg-info'>
                <input
                  type='checkbox'
                  id={index}
                  onChange={(e) => {
                    handleChecked(item.id, e);
                  }}
                  checked={checkedMsgs.includes(item.id)}
                />
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
        <DialogBox
          closePopup={closePopup}
          handleDeleteAll={handleDeleteAll}
          message={'Are you sure to delete them all?'}
        />
      )}
      {popupSelected && (
        <DialogBox
          closePopup={closePopupSelected}
          handleDeleteAll={handleDeleteSelected}
          message={'Are you sure to delete all the selected messages?'}
        />
      )}
    </div>
  );
}

export default Main;
