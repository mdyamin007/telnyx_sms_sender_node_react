const sendMessage = async (apiKey, from, to, text, messaging_profile_id) => {
  const telnyx = require("telnyx")(apiKey);
  let res;

  await telnyx.messages.create(
    {
      from: from, // Your Telnyx number
      to: to,
      text: text,
      messaging_profile_id: messaging_profile_id,
    },
    function (err, response) {
      // asynchronously called
      console.log(err);
      console.log(response);
      if (err) res = err;
      return (res = response);
    }
  );
  return res;
};

module.exports = sendMessage;
