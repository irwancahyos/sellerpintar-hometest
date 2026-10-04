import axios from 'axios';

export async function registerUser({ username, password, role }: { username: string; password: string; role: string }) {
  try {
    const response = await axios.post('/api/auth/register', { username, password, role }, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Error when register user from auth: ${error}`);
  }
}

export async function loginUser({ username, password, role }: { username: string; password: string; role: string }) {
  try {
    const response = await axios.post('/api/auth/login', { username, password, role }, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Error when login user from auth: ${error}`);
  }
}
