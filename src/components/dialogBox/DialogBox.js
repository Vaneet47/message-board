import React from 'react';
import './dialogBox.css';

function DialogBox({ closePopup, handleDeleteAll, message }) {
  return (
    <div className='cross-popup'>
      <div className='popup-content'>
        <span className='close-button' onClick={closePopup}>
          &times;
        </span>
        <h2 className='dialog-title'>Disclaimer</h2>

        <p className='dialog-question'>{message}</p>

        <div className='buttons-container'>
          <button className='buttons' onClick={closePopup}>
            No
          </button>
          <button className='buttons' onClick={handleDeleteAll}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default DialogBox;
