const express = require("express");
const cors = require("cors");
const sendMessage = require("./send");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.post("/api/v1/send", async (req, res) => {
  const { apiKey, from, to, text, messaging_profile_id } = req.body;
  const response = await sendMessage(
    apiKey,
    from,
    to,
    text,
    messaging_profile_id
  );
  return res.send(response);
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
