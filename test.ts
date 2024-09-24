import http, { type RequestOptions, type ServerResponse } from "node:http";
import { assert, assertEquals, fail } from "jsr:@std/assert";

/*
Deno.test("[node/http] send request with chunked body", async () => {
  const deferred = Promise.withResolvers();

  // let requestHeaders;
  let requestBody = "";

  const hostname = "localhost";
  const port = 4505;

  const server = http.createServer((req, res) => {
    // requestHeaders = req.headers;
    req.on("data", (chunk) => {
      requestBody += chunk.toString();
    });
    req.on("end", () => {
      res.statusCode = 200;
      res.end(requestBody); // Echo the received body
    });
  });

  server.listen(port, hostname, async () => {
    const opts = {
      host: hostname,
      port: port,
      method: "POST",
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Length": "11",
        "Transfer-Encoding": "chunked",
      },
    };
    const req = http.request(opts, (res) => {
      let responseBody = "";
      res.on("data", (data) => {
        responseBody += data.toString();
      });
      res.on("end", () => {
        assertEquals(res.statusCode, 200);
        assertEquals(requestBody, "hello world");
        assertEquals(responseBody, "hello world"); // New assertion to check echoed body
        server.close(() => {
          deferred.resolve(null);
        });
      });
    });
    req.write("hello ");
    req.write("world");
    req.end();
  });
  await deferred.promise;
});
*/

Deno.test("[node/http] send request with chunked body - new", async () => {
  let requestHeaders: Headers;
  let requestBody = "";

  const hostname = "localhost";
  const port = 4505;

  const handler = async (req: Request) => {
    requestHeaders = req.headers;
    requestBody = await req.text();
    return new Response("ok");
  };
  const abortController = new AbortController();
  const servePromise = Deno.serve({
    hostname,
    port,
    signal: abortController.signal,
    onListen() {
      const opts = {
        hostname: "localhost",
        host: "localhost",
        port,
        method: "GET",
        /*
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Length": "11", // looks fishy
          "Transfer-Encoding": "chunked",
        },
        */
      };
      const req = http.request(opts, (res) => {
        res.on("data", () => {});
        res.on("end", () => {
          abortController.abort();
        });
        assertEquals(res.statusCode, 200);
        assertEquals(requestBody, "hello world");
      });
      req.write("hello ");
      req.write("world");
      req.end();
    },
  }, handler).finished;

  await servePromise;
});
