export default {
  async fetch(req) {
    const text = await req.text();
    if (text) {
      console.log(text);
    }
    return new Response("hi");
  }
}
