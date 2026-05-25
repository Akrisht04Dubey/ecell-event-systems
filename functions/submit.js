export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    
    // Inserts form data securely into your Cloudflare D1 Database binding
    await context.env.DB.prepare(
      "INSERT INTO registrations (name, email, department) VALUES (?, ?, ?)"
    ).bind(data.name, data.email, data.department).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
