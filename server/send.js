const sendMessage = async (apiKey, to, text, messaging_profile_id, res) => {
  const telnyx = require("telnyx")(apiKey);

  await telnyx.messages.create(
    {
      to: to,
      text: text,
      messaging_profile_id: messaging_profile_id,
    },
    function (err, response) {
      if (err) {
        console.log(err);
        return res.status(err.statusCode).send(err.type);
      }
      console.log(response);
      return res.status(200).send(response);
    }
  );
  return res;
};

module.exports = sendMessage;
