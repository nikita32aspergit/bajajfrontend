import React, { useState } from 'react';
import axios from 'axios';

function App() {
  // States to manage inputs and responses
  const [inputData, setInputData] = useState("");
  const [jsonResponse, setJsonResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  // Handle change for the input field
  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  // Handle submit for the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate if the input is a valid JSON
      const parsedData = JSON.parse(inputData);
      
      // Call the backend API
      const response = await axios.post('http://localhost:3000/bfhl', parsedData);
      
      // If response is successful, store the response in state
      setJsonResponse(response.data);
      setError(null);  // Clear any previous errors
      
    } catch (err) {
      // Handle invalid JSON or request errors
      setError("Invalid JSON format. Please enter valid JSON.");
      setJsonResponse(null);
    }
  };

  // Handle multi-select dropdown change
  const handleSelectChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedOptions(selected);
  };

  // Render the filtered response based on selected options
  const renderResponse = () => {
    if (!jsonResponse) return null;

    const { alphabets, numbers, highest_lowercase_alphabet } = jsonResponse;
    const filteredData = {};

    // Filter data based on selected options
    if (selectedOptions.includes("Alphabets")) {
      filteredData.alphabets = alphabets;
    }
    if (selectedOptions.includes("Numbers")) {
      filteredData.numbers = numbers;
    }
    if (selectedOptions.includes("Highest lowercase alphabet")) {
      filteredData.highest_lowercase_alphabet = highest_lowercase_alphabet;
    }

    return (
      <div>
        <h3>Response:</h3>
        <pre>{JSON.stringify(filteredData, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Your Roll Number: ABCD123</h1>
      
      {/* Form to accept JSON input */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputData}
          onChange={handleInputChange}
          placeholder='Enter JSON here'
          rows="5"
          cols="50"
        />
        <button type="submit">Submit</button>
      </form>

      {/* Display error if invalid JSON */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Multi-select dropdown after successful JSON submission */}
      {jsonResponse && (
        <div>
          <h3>Select Data to Display</h3>
          <select multiple={true} value={selectedOptions} onChange={handleSelectChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
        </div>
      )}

      {/* Render the response based on dropdown selection */}
      {renderResponse()}
    </div>
  );
}

export default App;
