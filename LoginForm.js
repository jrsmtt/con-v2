//Create a file named loginStore.js:
import create from 'zustand';

const initialState = {
  username: '',
  password: '',
  loginStatus: null,
  message: '',
  error: null,
};

const useLoginStore = create((set) => ({
  ...initialState,
  setUsername: (username) => set({ username }),
  setPassword: (password) => set({ password }),
  setLogin: (status, message, error) =>
    set({ loginStatus: status, message, error }),
  reset: () => set({ ...initialState }),
}));

export default useLoginStore;


//Create a file named LoginForm.js:
import React from 'react';
import useLoginStore from './loginStore';

const LoginForm = () => {
  const { username, password, loginStatus, message, error, setUsername, setPassword, setLogin, reset } = useLoginStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate backend call (replace with your actual API call)
    const response = await simulateLogin(username, password);

    setLogin(response.login_status, response.message, response.error);

    // Reset form after successful login (optional)
    if (response.login_status === 'success') {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username:</label>
      <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      {loginStatus && (
        <div>
          {loginStatus === 'success' ? (
            <p style={{ color: 'green' }}>{message}</p>
          ) : (
            <p style={{ color: 'red' }}>{error}</p>
          )}
        </div>
      )}
    </form>
  );
};

export default LoginForm;

// Simulate backend login (replace with your actual API call)
const simulateLogin = async (username, password) => {
  // Simulate logic to validate username and password against your backend database
  const validCredentials = username === 'admin' && password === 'password123';
  return {
    login_status: validCredentials ? 'success' : 'fail',
    message: validCredentials ? 'Login successful!' : 'Invalid credentials.',
    error: null,
  };
};

//Update your App.js to render the LoginForm:
import React from 'react';
import LoginForm from './LoginForm';

function App() {
  return (
    <div className="App">
      <LoginForm />
    </div>
  );
}

export default App;


const simulateLogin = async (username, password) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { login_status: 'fail', message: 'Login failed', error: error.message };
  }
};


