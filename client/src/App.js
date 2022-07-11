import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

function App() {
  const [data, setData] = useState({
    from: "+18445241298",
  });
  const [sheets, setSheets] = useState();
  const [workBook, setWorkBook] = useState();
  const [selectedSheet, setSelectedSheet] = useState(0);
  const [message, setMessage] = useState(
    "Hello <name>, visit <link> to subscribe"
  );
  const [sentCount, setSentCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // console.log(data);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    const arrayBuffer = await file.arrayBuffer();
    const workBook = XLSX.read(arrayBuffer);
    setSheets(workBook.SheetNames);
    setWorkBook(workBook);
  };

  // console.log(sheets);

  const handleSelect = (e) => {
    setSelectedSheet(e.target.value);
  };

  // console.log(selectedSheet);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    console.log(workBook);
    console.log(selectedSheet);

    const workSheet = await workBook.Sheets[workBook.SheetNames[selectedSheet]];
    const jsonData = await XLSX.utils.sheet_to_json(workSheet);
    // console.log(jsonData);
    jsonData.forEach(async (row) => {
      // console.log(row);
      const text = await message
        .replace("<name>", row.Name)
        .replace("<link>", row.Link);
      console.log(text);
      const reqData = {
        ...data,
        to: `+${row.Phone}`,
        text: text,
      };
      try {
        const res = await axios.post(
          "http://localhost:5000/api/v1/send",
          reqData
        );
        console.log(reqData);
        console.log(res);
        setSentCount((prev) => prev + 1);
      } catch (error) {
        console.log(error);
        setFailedCount((prev) => prev + 1);
      }
    });
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit}>
        <div className="border shadow-md rounded py-10 px-20 flex flex-col items-center">
          <h1 className="text-4xl font-light mb-6 text-center">Send message</h1>
          <div className="my-2 ">
            <label className="text-sm block mb-1">API Keys</label>
            <input
              onChange={handleChange}
              name="apiKey"
              value={data?.apiKey}
              type={"text"}
              className="px-2 py-1 w-72 text-sm border-2 rounded-lg"
            />
          </div>
          <div className="my-2 ">
            <label className="text-sm block mb-1">Messaging Profile ID</label>
            <input
              onChange={handleChange}
              name="messaging_profile_id"
              value={data?.messaging_profile_id}
              type={"text"}
              className="px-2 py-1 w-72 text-sm border-2 rounded-lg"
            />
          </div>
          <div className="my-2">
            <label className="text-sm block mb-1">Select Data File</label>
            <input type={"file"} onChange={handleFileChange} />
          </div>
          <div className="my-2" hidden={sheets ? false : true}>
            <label className="text-sm block mb-1">Sheet #</label>
            <select
              value={selectedSheet}
              onChange={handleSelect}
              defaultValue={1}
            >
              {sheets &&
                sheets.map((sheet, idx) => (
                  <option value={idx}>{idx + 1}</option>
                ))}
            </select>
          </div>
          <div className="my-2 ">
            <label className="text-sm block mb-1">Message</label>
            <textarea
              onChange={handleMessage}
              name="message"
              value={message}
              className="px-2 py-1 w-72 text-sm border-2 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="my-2 px-2 py-2 w-20 text-white rounded-full bg-green-500"
          >
            Send
          </button>
        </div>
      </form>
      <div className="mt-2">
        <p className="text-green-500 text-sm">Sent: {sentCount}</p>
        <p className="text-red-500 text-sm">Failed: {failedCount}</p>
      </div>
    </div>
  );
}

export default App;
