import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("API /products body:", body);

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "inventoryapp");

    const res = await db.collection("orders").insertOne(body);

    return new Response(JSON.stringify({ ok: true, id: res.insertedId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API /products error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


// get 
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "productdata");

    const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray();

    return new Response(JSON.stringify({ ok: true, orders }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API /products GET error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}