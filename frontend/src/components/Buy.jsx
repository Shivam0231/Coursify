import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import axios from 'axios';
 import { Link, useNavigate, useParams } from'react-router-dom';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { backendUrl } from '../utils/utils';
const Buy = () => {
    const { courseid } = useParams();
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState({});
    // this error is basically page error which is during page rendring
    // const [error, setError] = useState(""); 
    const [clientsecret, setClientsecret] = useState("");
     // this error is basically card error which is during card payment
    const [carderror, setCardError] = useState("");
    const [error,setError]=useState("");
   const stripe = useStripe();
   const elements = useElements();
    const dummytoken = JSON.parse(localStorage.getItem('user'));
    const token=dummytoken?.token;
    console.log('Token:', token);
    const navigate=useNavigate();
    useEffect(()=>{

        const fetchdetails=async()=>{
            if(!token){
             setError('Please login to buy the course');
             navigate('/login');
            return;
        }
        try{
          setLoading(true);
          const response=await axios.post(`${backendUrl}/courses/buy/${courseid}`,{},{
            headers: {
              'authorization': `Bearer ${token}`
            },
            withCredentials: true,
        }
        )
        setLoading(false);
        console.log(response.data);
        setCourse(response.data.iscourseavailable);
        setClientsecret(response.data.clientsecret);
        }
        catch(error){
                if(error.response?.status===400){
                    setError('You already purchased this course');
                    setLoading(false);
                    return;
                }
                console.log(error);
               toast.error(error.response?.data?.message || 'Failed to purchase the course');
        }
        };fetchdetails();
    },[courseid])


    const handlepurchase=async(event)=>{
         setLoading(true);
         event.preventDefault();// prevent reloading the page

    if (!stripe || !elements) {
      console.log("stripe or elements not found");
       setLoading(false)
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
   
    const card = elements.getElement(CardElement);

    if (card == null) {
        console.log("No card element found");
        setLoading(false);
        return;
    }

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log("stripe payment method error", error);
      setLoading(false);
      return;
    } else {
      console.log("payment method created", paymentMethod);
    }
    if(!clientsecret ){
        setCardError('No client secret found');
        setLoading(false);
        return;
    }
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientsecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: dummytoken?.user?.firstname,
            email: dummytoken?.user?.email,
          },
        },
      });
    if (confirmError) {
      setCardError(confirmError.message);
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment succeeded: ", paymentIntent);
      setCardError("your payment id: ", paymentIntent.id);
      const paymentInfo = {
        email: dummytoken?.user?.email,
        userId: dummytoken.user._id,
        courseId:courseid,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      };
      console.log("Payment info: ", paymentInfo);
      await axios
        .post(`${backendUrl}/conferm/order`, paymentInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error in making payment");
        });
      toast.success("Payment Successful");
      navigate("/purchases");
    }
    setLoading(false);
    
    }
  return (
    <>
      {error ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
              to={"/purchases"}
            >
              Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row my-40 container mx-auto">
          <div className="w-full md:w-1/2">
            <h1 className="text-xl font-semibold underline">Order Details</h1>
            <div className="flex items-center text-center space-x-2 mt-4">
              <h2 className="text-gray-600 text-sm">Total Price</h2>
              <p className="text-red-500 font-bold">${course.price}</p>
            </div>
            <div className="flex items-center text-center space-x-2">
              <h1 className="text-gray-600 text-sm">Course name</h1>
              <p className="text-red-500 font-bold">{course.title}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                Process your Payment!
              </h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2"
                  htmlFor="card-number"
                >
                  Credit/Debit Card
                </label>
                <form onSubmit={handlepurchase}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!stripe || loading} // Disable button when loading
                    className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                  >
                    {loading ? "Processing..." : "Pay"}
                  </button>
                </form>
                {carderror && (
                  <p className="text-red-500 font-semibold text-xs">
                    {carderror}
                  </p>
                )}
              </div>

              <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
                <span className="mr-2">🅿️</span> Other Payments Method
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Buy