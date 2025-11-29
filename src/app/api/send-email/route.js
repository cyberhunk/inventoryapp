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

    console.log("SMTP_HOST", process.env.SMTP_HOST);
    console.log("SMTP_PORT", process.env.SMTP_PORT);
    console.log("SMTP_USER", process.env.SMTP_USER);
    console.log("SMTP_PASS length", process.env.SMTP_PASS?.length);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465, // 465 -> true, 587 -> false
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"TacT Lifestyle" <${process.env.SMTP_USER}>`,
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
