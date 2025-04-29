exports.handler = async (event, context) => {
  const { code } = JSON.parse(event.body || '{}');

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Code is required." }),
    };
  }

  // Define different types of codes and their responses
  const codeResponses = {
    // CTF code
    "niki_199912": {
      action: "ctf_code_accepted",
      message: "Congrats! Here's your next code: level2_start"
    },
    // Discount code
    "191929": {
      action: "get_90_discount",
      message: "90% discount applied to all products! Shop now!"
    },
    // Add more codes as needed
  };

  const response = codeResponses[code];

  if (response) {
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({
        action: "invalid_code",
        message: "Invalid code."
      }),
    };
  }
};

