import http from "node:http"
import { text } from "node:stream/consumers";

const req = http.request("http://localhost:8000", { method: "POST" }, async (res) => {
  console.log(await text(res));
});
req.write("hi");
req.end();
