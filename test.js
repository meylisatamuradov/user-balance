import fetch from 'node-fetch';
import fs from 'fs';

// Define the URL and the payload
const url = 'http://localhost:3000/api/users/balance/update';
const data = {
  userId: 1,
  amount: -2
};

// File where we will save responses
const outputFile = 'responses.json';

// Function to send a single request
const sendRequest = (requestNumber) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(responseData => ({ requestNumber, responseData }))
    .catch(error => ({ requestNumber, error: error.message }));
};

// Function to send requests in batches and write responses to a file
const sendConcurrentRequests = async (totalRequests, batchSize) => {
  let batchCount = Math.ceil(totalRequests / batchSize);
  let currentRequest = 0;
  const responses = [];

  // Open file stream to write responses
  const writeStream = fs.createWriteStream(outputFile, { flags: 'w' });

  while (currentRequest < batchCount) {
    // Create an array of promises to send a batch of requests
    let batchPromises = [];
    for (let i = 0; i < batchSize && currentRequest * batchSize + i < totalRequests; i++) {
      batchPromises.push(sendRequest(currentRequest * batchSize + i + 1)); // Include request number
    }

    // Wait for all promises in the batch to finish
    const batchResponses = await Promise.all(batchPromises);

    // Write each response to the file
    batchResponses.forEach(response => {
      writeStream.write(JSON.stringify(response) + '\n'); // Writing each response in a new line
    });

    console.log(`Batch ${currentRequest + 1} completed.`);
    currentRequest++;
  }

  writeStream.end();
  console.log('All requests completed, responses saved to file!');
};

// Send 10,000 requests in batches of 500 concurrently
sendConcurrentRequests(10000, 500)
  .catch(error => {
    console.error('Error:', error);
  });
