import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// this base url will be change based on
// if you need to point to production.
const BASE_URL = "http://10.0.2.2:8000";
const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

const getDataFromStorage = async (key) => {
  const res = await AsyncStorage.getItem(key);
  return Promise.resolve(res);
};

let tokenRequest = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

const getUserDetails = async (username) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/user/detail/${username}`);
    const data = response.json();
    return await Promise.resolve(data);
  } catch (error) {
    return await Promise.reject(error);
  }
};

const loginUser = async (username, password) => {
  const loginBody = { username: username, password: password };

  try {
    const response = await tokenRequest.post(`/auth/si/token/both/`, loginBody);
    AsyncStorage.setItem(ACCESS_TOKEN, response.data.access).then(() =>
      console.log("access token set meow")
    );
    AsyncStorage.setItem(REFRESH_TOKEN, response.data.refresh).then(() =>
      console.log("Refresh token set")
    );
    AsyncStorage.setItem("username", username).then(() =>
      console.log("Username set")
    );
    const user = await getUserDetails(username);
    return await Promise.resolve(user);
  } catch (error) {
    return await Promise.reject(error);
  }
};

const refreshToken = async () => {
  const refreshBody = {
    refresh: await AsyncStorage.getItem(REFRESH_TOKEN).then((value) => value),
  };
  try {
    const response = await tokenRequest.post(
      `/auth/si/token/access/`,
      refreshBody
    );
    AsyncStorage.setItem(ACCESS_TOKEN, response.data.access).then(() =>
      console.log("set")
    );
    return await Promise.resolve(response.data);
  } catch (error) {
    return await Promise.reject(error);
  }
};

const isCorrectRefreshError = (status) => {
  return status === 401;
};

/*
 * authRequest
 *
 * This refreshes the request and retries the token if it is invalid.
 * This is what you use to create any requests that need the Tokens.
 * Reference: https://hackernoon.com/110percent-complete-jwt-authentication-with-django-and-react-2020-iejq34ta
 *
 * Example:
 *     authRequest.get('/path/to/endpoint/',extraParameters)
 *        .then(response=>{
 *          // do something with successful request
 *        }).catch((error)=> {
 *          // handle any errors.
 *        });
 */
const authRequest = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${getDataFromStorage("access_token")}`,
    "Content-Type": "application/json",
  },
});
authRequest.interceptors.response.use(
  (response) => response, // this is for all successful requests.
  (error) => {
    //handle the request
    return errorInterceptor(error);
  }
);

const errorInterceptor = async (error) => {
  const originalRequest = error.config;
  const status = error.response.status;
  if (isCorrectRefreshError(status)) {
    try {
      const data = await refreshToken();
      const headerAuthorization = `Bearer ${AsyncStorage.getItem(
        ACCESS_TOKEN
      ).then((value) => value)}`;
      authRequest.defaults.headers["Authorization"] = headerAuthorization;
      originalRequest.headers["Authorization"] = headerAuthorization;
      return await authRequest(originalRequest);
    } catch (error_1) {
      // if token refresh fails, logout the user to avoid potential security risks.
      logoutUser();
      console.log("logout");
      return await Promise.reject(error_1);
    }
  }
  return Promise.reject(error);
};

const logoutUser = async () => {
  await AsyncStorage.removeItem(ACCESS_TOKEN);
  await AsyncStorage.removeItem(REFRESH_TOKEN);
  authRequest.defaults.headers["Authorization"] = "";
};

const isJWTinStorage = async () => {
  const access_token = await getDataFromStorage("access_token");
  const refresh_token = await getDataFromStorage("refresh_token");
  return !!(refresh_token && access_token);
};

const SignUpUser = async (username, email, password, image) => {
  let form_data = new FormData();
  form_data.append("username", username);
  form_data.append("profile_photo", image);
  form_data.append("password", password);
  form_data.append("email", email);
  try {
    // const response = await axios.post(`${BASE_URL}/auth/su/`, signUpBody);
    const res = await fetch("http://10.0.2.2:8000/auth/su/", {
      body: form_data,
      method: "post",
      headers: {
        "content-type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    });
    const data = await res.json();
    console.log(data);
    const user = await loginUser(username, password);
    return await Promise.resolve(user);
  } catch (error) {
    return await Promise.reject(error);
  }
};

export {
  tokenRequest,
  loginUser,
  logoutUser,
  refreshToken,
  authRequest,
  errorInterceptor,
  BASE_URL,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  getDataFromStorage,
  isJWTinStorage,
  SignUpUser,
  getUserDetails,
};
