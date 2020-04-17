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
import { deleteMultipleProducts } from './apiAdmin';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import CustomModal from './CustomModal';
import { FixedSizeList } from 'react-window';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import { useEffect } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Link } from 'react-router-dom';

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

function renderRow(props) {
  const { index, style, data } = props;
  return (
    <ListItem
      button
      style={style}
      key={index}
      component={Link}
      to={`/admin/product/update/${data[index]._id}`}
    >
      <ListItemText primary={`${data[index].name}`} />
    </ListItem>
  );
}

renderRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

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
  modalListRoot: {
    width: '100%',
    height: 400,
    backgroundColor: theme.palette.background.paper,
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, selectedProducts, resetSelected, records } = props;
  const [open, setOpen] = useState(false);
  const { user, token } = isAuthenticated();
  const [modalOpen, setModalOpen] = useState(false);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    let list = [];
    for (let i = 0; i < records.length; i++)
      list.push({ _id: records[i]._id, name: records[i].name });
    setProductList(list);
  }, []);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

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
          <Tooltip title='Update products' onClick={handleModalOpen}>
            <IconButton aria-label='update list'>
              <SystemUpdateAltIcon />
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
      <CustomModal modalOpen={modalOpen} handleModalClose={handleModalClose}>
        <div className={classes.modalListRoot}>
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                height={height}
                width={width}
                itemSize={46}
                itemCount={productList.length}
                itemData={productList}
              >
                {renderRow}
              </FixedSizeList>
            )}
          </AutoSizer>
        </div>
      </CustomModal>
    </Fragment>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default EnhancedTableToolbar;
