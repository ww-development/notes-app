import { GoogleLogin, GoogleLogout } from "react-google-login";
import env from "react-dotenv";
import React, {useContext} from 'react';
import {Context} from '../store';

const refreshTokenSetup = (res) => {
  let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

  const refreshToken = async () => {
    const newAuthRes = await res.reloadAuthResponse();
    refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
    console.log("newAuthRes:", newAuthRes);

    console.log("new auth token", newAuthRes.id_token);
  }

  setTimeout(refreshToken, refreshTiming);
}

function Login() {
    const [state, dispatch] = useContext(Context);


  const handleLogin = async googleData => {
    dispatch({type: 'SET_LOGIN', payload: true});

    const res = await fetch("https://fauna-notes-api.herokuapp.com/auth/google", {
      method: "POST",
      body: JSON.stringify({
        token: googleData.tokenId
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    const data = await res.json()
    console.log(data);
  }

  return (
    <div>
      <GoogleLogin
        clientId={`${env.CLIENT_ID}`}
        buttonText="Login"
        onSuccess={handleLogin}
        // onFailure={handleLogin}
        cookiePolicy={"single_host_origin"}
        style={{ marginTop: "100px" }}
        isSignedIn={true}

        render={renderProps => (
            <button onClick={renderProps.onClick} disabled={renderProps.disabled}>This is my custom Google button</button>
          )}
      />
    </div>
  )
}


export default Login;