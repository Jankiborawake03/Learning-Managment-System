// import React, { useState } from "react";

// const PaymentForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     address: "",
//     city: "",
//     state: "",
//     zip: "",
//     cardName: "",
//     cardNumber: "",
//     expMonth: "",
//     expYear: "",
//     cvv: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Proceeding to checkout.");
//     console.log(formData);
//   };

//   return (
//     <div className="container mx-auto mt-10">
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-xl mx-auto bg-white p-8 rounded shadow-lg"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-9">{/* -- */}
//           {/* Billing Address */}
//           <div>
//             <h3 className="text-lg font-semibold text-red-600 mb-7">{/* -- */}
//               Billing Address
//             </h3>

//             {[
//               { id: "name", label: "Full Name", type: "text" },
//               { id: "email", label: "Email", type: "email" },
//               { id: "address", label: "Address", type: "text" },
//               { id: "city", label: "City", type: "text" },
//               { id: "state", label: "State", type: "text" },
//               { id: "zip", label: "Zip Code", type: "text" },
//             ].map(({ id, label, type }) => (
//               <div key={id} className="mb-4">
//                 <label htmlFor={id} className="block text-sm font-medium text-gray-700">
//                   {label}:
//                 </label>
//                 <input
//                   type={type}
//                   id={id}
//                   value={formData[id]}
//                   onChange={handleChange}
//                   placeholder={`Enter your ${label.toLowerCase()}`}
//                   required
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Payment Details */}
//           <div>
//             <h3 className="text-lg font-semibold text-red-600 mb-7">Payment</h3>{/* -- */}

//             {[
//               { id: "cardName", label: "Name on Card", type: "text" },
//               { id: "cardNumber", label: "Credit Card Number", type: "text" },
//               { id: "cvv", label: "CVV", type: "text" },
//             ].map(({ id, label, type }) => (
//               <div key={id} className="mb-4">
//                 <label htmlFor={id} className="block text-sm font-medium text-gray-700">
//                   {label}:
//                 </label>
//                 <input
//                   type={type}
//                   id={id}
//                   value={formData[id]}
//                   onChange={handleChange}
//                   placeholder={`Enter ${label.toLowerCase()}`}
//                   required
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                 />
//               </div>
//             ))}

//             {/* Expiration Date */}
//             <div className="flex justify-between mb-4">
//               {[
//                 { id: "expMonth", label: "Expiration Month", placeholder: "MM" },
//                 { id: "expYear", label: "Expiration Year", placeholder: "YYYY" },
//               ].map(({ id, label, placeholder }) => (
//                 <div key={id} className="w-1/2 mr-2">
//                   <label htmlFor={id} className="block text-sm font-medium text-gray-700">
//                     {label}:
//                   </label>
//                   <input
//                     type="text"
//                     id={id}
//                     value={formData[id]}
//                     onChange={handleChange}
//                     placeholder={placeholder}
//                     required
//                     className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//         >
//           Proceed to Checkout
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PaymentForm;



import React, { useState } from "react";

const PaymentForm = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
    // billingAddress: "",
    // country: "",
    // zip: "",
    paymentMethod: "credit", // Default selection
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id || e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if any field is empty
    for (const key in formData) {
      if (formData[key].trim() === "") {
        alert(`Please fill the ${key.replace(/([A-Z])/g, " $1").toLowerCase()} field.`);
        return;
      }
    }

    alert("Payment successful! ✅");
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-300 min-h-screen flex items-center justify-center">
      {/* Form Container */}
      <form onSubmit={handleSubmit} className="max-w-xl w-full bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-200">
        
        <h2 className="text-orange-500 text-2xl font-semibold text-gray-800 text-center mb-6">
          Payment Details
        </h2>

        {/* Full Name Field */}
        <div className="mb-4">
          <label htmlFor="cardNumber" className="block text-gray-700 font-semibold mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            // placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Email Field */}
        <label htmlFor="cardNumber" className="block text-gray-700 font-semibold mb-1">
            Email Address
          </label>
        <div className="mb-4">
          <input
            type="email"
            id="email"
            placeholder="**************@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Phone Number Field */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 font-semibold mb-1">
            Contact Number
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => {
              let value = e.target.value;

              // Remove all non-numeric characters
              value = value.replace(/\D/g, "").slice(0, 10);

            // Ensure only numbers and limit to 10 digits
            value = value.replace(/\D/g, "").slice(0, 10);


              setFormData({ ...formData, phone: value });
            }}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          {formData.phone.length > 0 && formData.phone.replace(/\D/g, "").length < 10 && (
            <p className="text-red-500 text-sm mt-1">
              Contact number must be 10 digits
            </p>
          )}
        </div>


        {/* Card Number Field */}
        <div className="mb-4">
        <label htmlFor="cardNumber" className="block text-gray-700 font-semibold mb-1">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            placeholder=" **** **** **** ****"
            value={formData.cardNumber}
            onChange={(e) => {
              let value = e.target.value;

              // Check if the input contains any non-numeric character (excluding spaces)
              if (/\D/.test(value.replace(/\s/g, ""))) {
                alert("Please enter only numbers for the card number.");
                return;
              }

              // Remove non-numeric characters and limit to 16 digits
              value = value.replace(/\D/g, "").slice(0, 16);

              // Format: Insert a space every 4 digits
              value = value.replace(/(.{4})/g, "$1 ").trim();

              setFormData({ ...formData, cardNumber: value });
            }}
            maxLength="19" // 16 digits + 3 spaces
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          {formData.cardNumber.replace(/\s/g, "").length > 0 &&
            formData.cardNumber.replace(/\s/g, "").length < 16 && (
              <p className="text-red-500 text-sm mt-1">
                Card number must be 16 digits
              </p>
            )}
        </div>


        {/* Expiration Date & CVV Fields */}
        <div className="mb-4">
          <label htmlFor="cardNumber" className="block text-gray-700 font-semibold mb-1">
            Expiration Date & CVV Fields
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expiration Date Input */}
            <div>
              <input
                type="text"
                id="expDate"
                placeholder="MM/YY"
                value={formData.expDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

                  if (value.length > 4) {
                    value = value.slice(0, 4); // Restrict to MMYY format
                  }

                  if (value.length > 2) {
                    value = value.replace(/(\d{2})(\d{0,2})/, "$1/$2"); // Auto-add slash after MM
                  }

                  setFormData({ ...formData, expDate: value });
                }}
                maxLength="5"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              {formData.expDate.length > 0 &&
                (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expDate) ? (
                  <p className="text-red-500 text-sm mt-1">Enter a valid MM/YY format</p>
                ) : null)}
            </div>

            {/* CVV Input */}
            <div>
              <input
                type="text"
                id="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, ""); // Only numbers

                  if (value.length > 4) {
                    value = value.slice(0, 4); // Restrict CVV to 4 digits
                  }

                  setFormData({ ...formData, cvv: value });
                }}
                maxLength="4"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              {formData.cvv.length > 0 && (formData.cvv.length < 3 || formData.cvv.length > 4) && (
                <p className="text-red-500 text-sm mt-1">CVV must be 3 or 4 digits</p>
              )}
            </div>
          </div>
        </div>


        {/* Billing Address Field */}
        {/* <div className="mb-4">
          <input
            type="text"
            id="billingAddress"
            placeholder="Billing Address"
            value={formData.billingAddress}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div> */}

        {/* Country & ZIP Code Fields */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <select
            id="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Select Country</option>
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
          </select>
          <input
            type="text"
            id="zip"
            placeholder="ZIP Code"
            value={formData.zip}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div> */}

        {/* Payment Method Selection */}
        {/* <div className="mb-6">
          <label className="text-gray-700 font-semibold">Payment Method:</label>
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod" // ✅ Name should be the same
                value="credit"
                checked={formData.paymentMethod === "credit"}
                onChange={handleChange}
                className="accent-red-500"
              />
              <span>Credit Card</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod" // ✅ Name should be the same
                value="paypal"
                checked={formData.paymentMethod === "paypal"}
                onChange={handleChange}
                className="accent-red-500"
              />
              <span>PayPal</span>
            </label>
          </div>
        </div>*/}


        {/* Submit Button with Animation & Gradient */}
        <button
          type="submit"
          className="mt-6 w-full py-3 bg-gradient-to-r from-orange-500 to-orange-500 text-white text-lg font-semibold rounded-lg shadow-md hover:scale-105 transform transition-all duration-200 hover:from-orange-450 hover:to-orange-450"
        >
          Proceed to Checkout
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
