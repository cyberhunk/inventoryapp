import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// export async function POST(req) {

//   try {
//     const body = await req.json();
//     console.log("API /products body:", body);

//     const client = await clientPromise;
//     const db = client.db(process.env.MONGODB_DB || "productdata");

//     const res = await db.collection("orders").insertOne(body);

//     return new Response(JSON.stringify({ ok: true, id: res.insertedId }), {
//       status: 201,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (err) {
//     console.error("API /products error:", err);
//     return new Response(JSON.stringify({ ok: false, error: String(err) }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

// import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("API /products body:", body);

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "productdata");

    // yahan extra fields add kar sakte ho
    const docToInsert = {
      ...body, // items, customer, createdAt, etc.
      status: body.status || "paid", // optional default
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await db.collection("orders").insertOne(docToInsert);

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

    const orders = await db
      .collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

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

// delete all orders - for testing
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ ok: false, error: "Missing id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "productdata");

    const result = await db
      .collection("orders")
      .deleteOne({ _id: new ObjectId(id) });

    return new Response(
      JSON.stringify({ ok: true, deletedCount: result.deletedCount }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("API /products DELETE error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// kkk
export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ ok: false, error: "Missing id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updates = await req.json(); // e.g. { price: 1200, quantity: 2 }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "productdata");

    const result = await db
      .collection("orders")
      .updateOne({ _id: new ObjectId(id) }, { $set: updates });

    return new Response(
      JSON.stringify({
        ok: true,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("API /products PATCH error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
