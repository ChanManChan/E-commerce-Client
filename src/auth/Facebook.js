import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import FacebookIcon from '@material-ui/icons/Facebook';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    padding: '.7rem',
  },
}));

const Facebook = ({ informParent = (f) => f }) => {
  const classes = useStyles();
  const responseFacebook = (response) => {
    // We need to send 'accessToken' and 'userID' from 'response' object to our backend and from our backend we make another request to Facebook to fetch the valid users profile details (email, name, ...)
    fetch(`${process.env.REACT_APP_API_URL}/facebook-login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: response.userID,
        accessToken: response.accessToken,
      }),
    })
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        informParent(data);
        console.log('FACEBOOK SIGNIN SUCCESS>>>', data);
      })
      .catch((err) => console.log('FACEBOOK SIGNIN ERROR>>>', err));
  };
  return (
    <div className='pb-3'>
      <FacebookLogin
        appId={`${process.env.REACT_APP_FACEBOOK_APP_ID}`}
        autoLoad={false}
        callback={responseFacebook}
        render={(renderProps) => (
          <Button
            variant='outlined'
            color='primary'
            fullWidth
            onClick={renderProps.onClick}
            className={classes.button}
            startIcon={<FacebookIcon />}
          >
            Login with Facebook
          </Button>
        )}
      />
    </div>
  );
};

export default Facebook;
