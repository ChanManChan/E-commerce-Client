import React, { Fragment, useState } from 'react';
import Draggable from 'react-draggable';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { isAuthenticated } from '../auth';
import { toast } from 'react-toastify';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { deleteMultipleProducts } from './apiAdmin';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

function PaperComponent(props) {
  return (
    <Draggable
      handle='#draggable-dialog-title'
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, selectedProducts, resetSelected } = props;
  const [open, setOpen] = useState(false);
  const { user, token } = isAuthenticated();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteMultipleProducts(user._id, token, selectedProducts).then(
      (response) => {
        if (response.error) {
          toast.error(`${response.error}`, {
            position: toast.POSITION.BOTTOM_LEFT,
          });
          setOpen(false);
        } else {
          resetSelected([]);
          toast.success('Permanently deleted selected records', {
            position: toast.POSITION.BOTTOM_LEFT,
          });
          setOpen(false);
        }
      }
    );
  };

  return (
    <Fragment>
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {numSelected > 0 ? (
          <Typography
            className={classes.title}
            color='inherit'
            variant='subtitle1'
            component='div'
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            className={classes.title}
            variant='h6'
            id='tableTitle'
            component='div'
          >
            Products
          </Typography>
        )}

        {numSelected > 0 ? (
          <Tooltip title='Delete'>
            <IconButton aria-label='delete' onClick={handleClickOpen}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title='Filter list'>
            <IconButton aria-label='filter list'>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby='draggable-dialog-title'
      >
        <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
          Modify Database
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Do you want to permanently delete ${numSelected} selected products from database? `}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDelete} color='primary'>
            {`Delete ${numSelected} items`}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default EnhancedTableToolbar;
