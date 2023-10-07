import React from 'react';
import './message.css';

function Message() {
  return (
    <div className='msg'>
      <div className='msg-info'>
        <span className='material-symbols-rounded icon'>sms</span>
        <p className='src'>~anonymous</p>
        &nbsp;
        <p className='time'>-</p>
        &nbsp;
        <p className='time'>10:01:04 AM</p>
        <button className='delete-btn'>Delete</button>
      </div>
      <div className='msg-content'>
        lskjbkjs sdkfhskjfh sdlfhs klf dfh klsdfhd fkjsh
      </div>
    </div>
  );
}

export default Message;
