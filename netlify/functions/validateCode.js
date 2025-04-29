
exports.handler = async (event, context) => {
  const { code } = JSON.parse(event.body || '{}');

  // Example: You can define your codes in an object for easy extension
  const validCodes = {
    "niki_199912": "Congrats! Here's your next code: level2_start",
    // You can add more codes later
  };

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Code is required." }),
    };
  }

  const responseMessage = validCodes[code];

  if (responseMessage) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: responseMessage }),
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Invalid code." }),
    };
  }
};
