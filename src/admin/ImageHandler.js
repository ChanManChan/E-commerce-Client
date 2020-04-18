import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import StorageIcon from '@material-ui/icons/Storage';
import DoneIcon from '@material-ui/icons/Done';
import DefaultProductImage from '../images/defaultProduct.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

const defaultImageStyle = {
  display: 'block',
  width: '5rem',
  height: 'auto',
};

const conditionalToast = (type, message) => {
  if (type)
    toast.success(message, {
      position: toast.POSITION.BOTTOM_LEFT,
    });
  else
    toast.error(message, {
      position: toast.POSITION.BOTTOM_LEFT,
      toastId: 13,
    });
};

const ImageHandler = (props) => {
  const classes = useStyles();
  const { setFieldValue, maxSize } = props;
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, rejectedFiles, open } = useDropzone({
    accept: 'image/*',
    maxSize,
    onDrop: (acceptedFiles) => {
      setFieldValue('photo', acceptedFiles[0]);
      setFiles(
        acceptedFiles.map((file) => {
          conditionalToast(true, `${file.name} is ready for upload`);
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
    },
    noClick: true,
    noKeyboard: true,
  });

  const isFileTooLarge =
    rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;

  const thumbs =
    files.length > 0 ? (
      files.map((file) => (
        <div style={thumb} key={file.name}>
          <div style={thumbInner}>
            <img src={file.preview} style={img} />
          </div>
        </div>
      ))
    ) : (
      <img src={DefaultProductImage} style={defaultImageStyle} />
    );
  const dynamicLabel =
    files.length > 0 ? `${files[0].size} Bytes` : 'No file selected';

  useEffect(() => {
    let subNodes = document.getElementsByClassName(
      'MuiExpansionPanelSummary-content Mui-expanded'
    );

    for (let j = 0; j < subNodes.length; j++)
      subNodes[j].style.margin = '5px 0';

    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <div className={classes.root}>
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1c-content'
          id='panel1c-header'
        >
          <div className={classes.column}>
            <Typography className={classes.heading}>Preview</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>
              Select product image
            </Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <div className={classes.column}>
            <aside style={thumbsContainer}>{thumbs}</aside>
          </div>
          <div className={classes.column}>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <Chip
                icon={<ImageSearchIcon />}
                label='Select Image'
                clickable
                color='secondary'
                onClick={open}
                deleteIcon={<DoneIcon />}
                variant='outlined'
              />
              {isFileTooLarge &&
                conditionalToast(false, 'File size should be less than 100KB')}
            </div>
          </div>
          <div className={clsx(classes.column, classes.helper)}>
            <Typography variant='caption'>
              File information
              <br />
              <Chip
                icon={<StorageIcon />}
                label={dynamicLabel}
                clickable
                color='primary'
                deleteIcon={<DoneIcon />}
                variant='outlined'
              />
            </Typography>
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button
            size='small'
            onClick={() => {
              if (window.confirm('Deselect the image?')) setFiles([]);
            }}
          >
            Cancel
          </Button>
          <Button size='small' color='primary'>
            Save
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </div>
  );
};

export default ImageHandler;
