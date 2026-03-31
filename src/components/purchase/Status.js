import React from 'react';

    function Status({ status }) {
      let statusColor = '';
    
      switch (status) {
        case 0:
          statusColor = 'gray';
          break;
        case 1:
          statusColor = 'green';
          break;
        case 2:
          statusColor = 'blue';
          break;
        case 99:
          statusColor = 'red';
          break;
        default:
          statusColor = 'black';
      }
    
      return (
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: statusColor,
            display: 'inline-block', // ทำให้เป็น inline element เพื่อแสดงในบรรทัดเดียวกัน
            marginLeft: '5px', // เพิ่มระยะห่างจากข้อความ
          }}
        ></div>
      );
    }

    export default Status;