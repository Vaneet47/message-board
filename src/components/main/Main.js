import React, { useEffect, useState } from 'react';
import './main.css';
import moment from 'moment';
import DialogBox from '../dialogBox/DialogBox';

const apiUrl = 'https://mapi.harmoney.dev/api/v1/messages/';
const headers = { Authorization: '0LZER559TVedxahu' };

const handleSort = (order, currentItems) => {
  let sortedItems;
  if (order === 'oldest first') {
    sortedItems = currentItems.sort(
      (x, y) => new Date(x.timestamp) - new Date(y.timestamp)
    );
  } else {
    sortedItems = currentItems.sort(
      (x, y) => new Date(y.timestamp) - new Date(x.timestamp)
    );
  }
  return sortedItems;
};

const messagesPerPage = 5;

function Main() {
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([]);
  const [checkedMsgs, setCheckedMsgs] = useState([]);

  const [popup, setPopup] = useState(false);
  const [order, setOrder] = useState('oldest first');
  const [popupSelected, setPopupSelected] = useState(false);
  const [loaderHidden, setLoaderHidden] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * messagesPerPage;
  const endIndex = startIndex + messagesPerPage;
  let currentItems = handleSort(order, messages).slice(startIndex, endIndex);
  if (currentItems.length === 0 && messages.length !== 0) {
    setCurrentPage((prev) => prev - 1);
  }

  const getMessages = async () => {
    setLoaderHidden(false);
    let res = await fetch(apiUrl, {
      headers: headers,
    });
    res = await res.json();
    setLoaderHidden(true);
    res = handleSort(order, res);
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

  const changeSortOrder = () => {
    if (order === 'oldest first') {
      setOrder('most recent first');
    } else {
      setOrder('oldest first');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
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
              changeSortOrder();
            }}
            disabled={messages.length === 0}
          >
            Sort by Timestamp
          </button>
          <p className={`order-info ${messages.length === 0? 'backg':''}`}>Current order: {order}</p>
        </div>

        <div className='msg-conatiner'>
          {currentItems.map((item, index) => {
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
                    {moment(item.timestamp).format('hh:mm:ss a, DD/MM/YYYY')}
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

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(messages.length / messagesPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className='pagination'>
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`${
            pageNumber === currentPage ? 'active' : ''
          } cta btn page-btn`}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
    </div>
  );
};

export default Main;
