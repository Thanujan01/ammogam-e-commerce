const axios = require('axios');

async function testConnectivity() {
  try {
    const response = await axios.post('http://localhost:5000/api/sellers/register', {
      name: "Test Connectivity",
      email: "test@connectivity.com"
    });
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Connectivity Failed:", error.response ? error.response.status : error.message);
  }
}

testConnectivity();
