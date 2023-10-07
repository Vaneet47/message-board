import React, { useEffect } from 'react';
import './main.css';

function Main() {
  return (
    <div className='main'>
      <div className='cta-container'>
        <input className='cta' />
        <button className='cta btn'>Post!</button>
        <button className='cta btn delete'>Delete All</button>
      </div>

      <div className='msg-conatiner'>
        <div className='msg'>
          <div className='msg-info'>
            <span class='material-symbols-rounded icon'>sms</span>
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
      </div>
    </div>
  );
}

export default Main;
