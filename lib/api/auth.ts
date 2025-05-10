// ******** Imports ********
import axios from 'axios';

const API_REGISTER = 'https://test-fe.mysellerpintar.com/api/auth/register';
const API_LOGIN = 'https://test-fe.mysellerpintar.com/api/auth/login';

// ******** Function for register ********
export async function registerUser({ username, password, role }: { username: string; password: string; role: string }) {
  try {
    const res = await axios.post(
      `${API_REGISTER}`,
      {
        username,
        password,
        role,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return res.data;
  } catch (err) {
    throw new Error(`Error when register user from auth: ${err}`);
  }
}

// ******** Function for login user ********
export async function loginUser({ username, password, role }: { username: string; password: string; role: string }) {
  try {
    const res = await axios.post(
      `${API_LOGIN}`,
      {
        username,
        password,
        role,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return res.data;
  } catch (err) {
    throw new Error(`Error when login user from auth: ${err}`);
  }
}