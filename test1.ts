import http from "node:http";
import { assertEquals } from "jsr:@std/assert";

Deno.test("[node/http] send request with chunked body - new", async () => {
  const port = 4500;

  const server = Deno.serve({
    port,
    onListen() {
      const req = http.request({
        hostname: "localhost",
        port,
        method: "POST",
      }, (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk.toString();
        });
        res.on("end", () => {
          assertEquals(res.statusCode, 200);
          assertEquals(body, "hello world");
          server.shutdown();
        });
      });
      req.write("hello ");
      req.write("world");
      req.end();
    },
  }, async (req) => new Response(await req.text()));

  await server.finished;
});
