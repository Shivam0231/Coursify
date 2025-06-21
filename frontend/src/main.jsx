import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
const stripePromise = loadStripe("pk_test_51RZysrDClBJKAEx8A3gaQPdcoE8FXzZGCMq6xcNqyDjnnyMuvwzl5nYdS93cmqaLMNtB1QXIdiEBzJbdvvf7HBsd00BTot9UQo");
createRoot(document.getElementById('root')).render(
    
    <Elements  stripe={stripePromise}>
               <BrowserRouter>
                   <AuthProvider>
                      <App />
                  </AuthProvider>
              </BrowserRouter>
    </Elements>
)
