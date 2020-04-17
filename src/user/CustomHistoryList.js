import React from 'react';
import moment from 'moment';
import TimelineTwoToneIcon from '@material-ui/icons/TimelineTwoTone';
import CreditCardTwoToneIcon from '@material-ui/icons/CreditCardTwoTone';
import LocalMallTwoToneIcon from '@material-ui/icons/LocalMallTwoTone';
import ContactMailTwoToneIcon from '@material-ui/icons/ContactMailTwoTone';
import ReceiptTwoToneIcon from '@material-ui/icons/ReceiptTwoTone';
import LocalOfferTwoToneIcon from '@material-ui/icons/LocalOfferTwoTone';
import PropTypes from 'prop-types';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import TreeView from '@material-ui/lab/TreeView';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { makeStyles } from '@material-ui/core/styles';
import EventTwoToneIcon from '@material-ui/icons/EventTwoTone';
import FormatListNumberedTwoToneIcon from '@material-ui/icons/FormatListNumberedTwoTone';
import AccountBalanceWalletTwoToneIcon from '@material-ui/icons/AccountBalanceWalletTwoTone';
import AccountTreeTwoToneIcon from '@material-ui/icons/AccountTreeTwoTone';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    '&:hover > $content': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus > $content, &$selected > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)',
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'transparent',
    },
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    '& $content': {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    ...other
  } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color='inherit' className={classes.labelIcon} />
          <Typography variant='body2' className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant='caption' color='inherit'>
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
  cardRoot: {
    minWidth: 275,
  },
  breakPoint_375pxCardRoot: {
    maxWidth: 375,
  },
});

const CustomHistoryList = ({ history }) => {
  const classes = useStyles();
  const breakPoint_375px = useMediaQuery('(max-width:375px)');
  return (
    history &&
    history.map((h, i) => (
      <Grid item xs>
        <TreeView
          className={classes.root}
          defaultExpanded={['3']}
          defaultCollapseIcon={<ArrowDropDownIcon />}
          defaultExpandIcon={<ArrowRightIcon />}
          defaultEndIcon={<div style={{ width: 24 }} />}
        >
          <Card
            className={
              breakPoint_375px
                ? classes.breakPoint_375pxCardRoot
                : classes.cardRoot
            }
          >
            <CardContent>
              <StyledTreeItem
                nodeId={i}
                labelText={`Order ID:- ${h._id}`}
                labelIcon={LocalOfferTwoToneIcon}
              />
              <Divider variant='inset' component='li' />
              <StyledTreeItem
                nodeId={i + 1}
                labelText={`Status:- ${h.status}`}
                labelIcon={TimelineTwoToneIcon}
              />
              <Divider variant='inset' component='li' />
              <StyledTreeItem
                nodeId={i + 2}
                labelText={`Amount paid:- ${h.amount}`}
                labelIcon={CreditCardTwoToneIcon}
              />
              <Divider variant='inset' component='li' />
              <StyledTreeItem
                nodeId={i + 3}
                labelText={`Address:- ${h.address}`}
                labelIcon={ContactMailTwoToneIcon}
              />
              <Divider variant='inset' component='li' />
              <StyledTreeItem
                nodeId={i + 4}
                labelText={`Transaction ID:- ${h.transaction_id}`}
                labelIcon={ReceiptTwoToneIcon}
              />
              <Divider variant='inset' component='li' />
              <StyledTreeItem
                nodeId={i + 5}
                labelText='Ordered products'
                labelIcon={AccountTreeTwoToneIcon}
              >
                {h.products.map((p, j) => (
                  <StyledTreeItem
                    nodeId={i + 6 + j}
                    labelText={`${p.name}`}
                    labelIcon={LocalMallTwoToneIcon}
                  >
                    <StyledTreeItem
                      nodeId={i + 8 + j}
                      labelText={`MRP:- ${p.price}`}
                      labelIcon={AccountBalanceWalletTwoToneIcon}
                      color='#e3742f'
                      bgColor='#fcefe3'
                    />
                    <Divider variant='inset' component='li' />
                    <StyledTreeItem
                      nodeId={i + 9 + j}
                      labelText={`Ordered:- ${moment(p.createdAt).fromNow()}`}
                      labelIcon={EventTwoToneIcon}
                      color='#a250f5'
                      bgColor='#f3e8fd'
                    />
                    <Divider variant='inset' component='li' />
                    <StyledTreeItem
                      nodeId={i + 10 + j}
                      labelText={`Quantity:- ${p.count}`}
                      labelIcon={FormatListNumberedTwoToneIcon}
                      color='#3c8039'
                      bgColor='#e6f4ea'
                    />
                  </StyledTreeItem>
                ))}
              </StyledTreeItem>
            </CardContent>
          </Card>
        </TreeView>
      </Grid>
    ))
  );
};

export default CustomHistoryList;
