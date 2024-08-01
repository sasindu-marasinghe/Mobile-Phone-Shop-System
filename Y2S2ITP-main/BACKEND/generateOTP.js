// Define the generateOTP function
function generateOTP(length = 6) {
    const characters = '0123456789';
    let OTP = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      OTP += characters[randomIndex];
    }
  
    return OTP;
  }
  
  // Export the generateOTP function to make it accessible from other files if needed
  module.exports = { generateOTP };

  