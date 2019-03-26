import * as actionTypes from './actionTypes';


export const authOpenModal = () => {
    return {
        type: actionTypes.AUTH_OPEN_MODAL
    };
};

export const authCloseModal = () => {
    return {
        type: actionTypes.AUTH_CLOSE_MODAL
    };
};

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (accessToken, userId, idToken, expiresAt, email, fbToken, fbExpiry) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        accessToken: accessToken,
        userId: userId,
        idToken: idToken,
        expiresAt: expiresAt,
        email: email,
        fbToken: fbToken,
        fbExpiry: fbExpiry

    };
};

export const socialAuth = (accessToken, userId, idToken, expiresAt, email, fbToken, fbExpiry) => {
    return dispatch => {
        dispatch(authSuccess(accessToken, userId, idToken, expiresAt, email, fbToken, fbExpiry));

        dispatch(checkAuthTimeout(86400));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('idToken', idToken);
        localStorage.setItem('email', email);
        localStorage.setItem('expiresAt', expiresAt);
        localStorage.setItem('fbToken', fbToken);
        localStorage.setItem('fbExpiry', fbExpiry)
    };
};


export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error: error
    };
};

export const logout = () => {
    
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};


const  getFirebaseToken = (token) => {
    const url = "https://us-central1-starforge-153cc.cloudfunctions.net/getFirebaseAuth?token=" + token;
    return new Promise( ( resolve, reject ) => {
        fetch(url)
            .then((response) => {
                resolve(response.json())
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
        })
}


export const authCheckState = () => {
        return async dispatch => {
                const accessToken = localStorage.getItem('accessToken');
                let fbToken = localStorage.getItem('fbToken');
                if(!accessToken || !fbToken){
                    dispatch(logout());
                } else {
                    const expiresAt = parseInt(localStorage.getItem('expiresAt'), 10);
                    let fbExpiry = parseInt(localStorage.getItem('fbExpiry'));
                    const userId = localStorage.getItem('userId');
                    const idToken = localStorage.getItem('idToken');
                    const expirationTime = new Date(expiresAt);
                    const fbExpirationTime = new Date(fbExpiry);
                    const nowTime = new Date();
                    console.log(fbExpirationTime.toDateString());
                    console.log(fbExpirationTime.getTime() - nowTime.getTime());
                    if(fbExpirationTime < nowTime){
                        fbExpiry =  await getFirebaseToken(idToken);
                    }
                    const email = localStorage.getItem('email');
                    if(expirationTime > nowTime){    
                        dispatch(authSuccess(accessToken, userId, idToken, expiresAt, email, fbToken, fbExpiry));
                        //dispatch(checkAuthTimeout((expirationTime.getTime() - new Date().getTime()) / 1000));
                    } else {
                        dispatch(logout());
                    }
                }
        };
};
