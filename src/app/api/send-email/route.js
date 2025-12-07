import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { to, customerName } = await req.json();

    if (!to) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing recipient email" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("GMAIL_USER", process.env.GMAIL_USER);
    console.log("GMAIL_PASS length", process.env.GMAIL_PASS?.length);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"TacT Lifestyle" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Thank you for shopping with TacT Lifestyle",
      html: `
        <p>Hi ${customerName || "there"},</p>
        <p>Thank you for shopping with <strong>TacT Lifestyle</strong>. 
        Your order has been recorded in our system.</p>
        <p>We will update you once your order is packed and shipped.</p>
        <p>Love,<br/>TacT Lifestyle Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Send email error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

