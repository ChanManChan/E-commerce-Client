import React from 'react';
import GoogleLogin from 'react-google-login';
import Button from '@material-ui/core/Button';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    padding: '.5rem',
  },
}));

const Google = () => {
  const classes = useStyles();
  const responseGoogle = (response) => {
    // We are sending only the 'tokenId' from 'response' object to our backend, and another package in our backend will take this token, and based on this token it will make request to 'Google' and make sure that we have the valid user (the same 'REACT_APP_GOOGLE_CLIENT_ID' we are going to use in our backend as well )
    fetch(`${process.env.REACT_APP_API_URL}/google-login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: response.tokenId }),
    })
      .then((data) => {
        return data.json();
      })
      .then((result) => {
        // Inform parent (Signin.js)

        console.log('GOOGLE SIGNIN SUCCESS>>>', result);
      })
      .catch((err) => console.log('GOOGLE SIGNIN ERROR>>>', err));
  };
  return (
    <div className='pb-3'>
      <GoogleLogin
        clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        render={(renderProps) => (
          <Button
            variant='outlined'
            color='secondary'
            fullWidth
            className={classes.button}
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            startIcon={<GTranslateIcon />}
          >
            Login with Google
          </Button>
        )}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default Google;
