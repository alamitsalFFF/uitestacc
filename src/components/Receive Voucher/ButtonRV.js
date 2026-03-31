import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';

export default function ButtonRV({ actions }) {
  return (
    <Box sx={{ position: 'relative' }}> {/* ทำให้ Box เป็น Container สำหรับจัดตำแหน่ง SpeedDial */}
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        sx={{ position: 'absolute', top: 1, right: 1, transform: 'translateY(-65%)' }}
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
        direction="left"
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
            disabled={action.disabled} // เพิ่ม Props สำหรับควบคุมสถานะ Disabled
          />
        ))}
      </SpeedDial>
    </Box>
  );
}