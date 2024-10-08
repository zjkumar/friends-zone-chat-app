import React from 'react';
import ReactDOM from 'react-dom/client';
// Link
import { ChakraProvider } from '@chakra-ui/react'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ChatProvider from './Context/ChatProvider';
import { BrowserRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <ChatProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </ChatProvider>

    </BrowserRouter>
      
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
