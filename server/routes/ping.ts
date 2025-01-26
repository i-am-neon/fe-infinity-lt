export function handlePing(): Response {
  console.log("in ping");

  return new Response(JSON.stringify({ result: "Pong" }), {
    headers: { "Content-Type": "text/plain" },
  });
}