import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const AlertDialog = ({ sx, variant, color, onClick }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleConfirm = () => {
    onClick()
    setOpen(false);
  }

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button sx={sx} variant={variant} color={color} onClick={handleClickOpen}>
        刪除
      </Button>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
          確定刪除?
        </DialogTitle>
        <DialogActions>
          <Button variant='contained' color={color} onClick={handleConfirm}>確定</Button>
          <Button variant='outlined' onClick={handleCancel} autoFocus>
            取消
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}


export default AlertDialog