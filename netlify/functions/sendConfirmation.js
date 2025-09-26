const nodemailer = require("nodemailer");

exports.handler = async function(event, context) {
  try {
    const data = JSON.parse(event.body);

    const { email, name, products, total, delivery } = data;

    // 🔹 Konfigurácia emailu (tu použijeme Gmail ako príklad)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER, // tvoj Gmail
        pass: process.env.SMTP_PASS  // heslo alebo App password
      }
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Potvrdenie objednávky",
      text: `
Ahoj ${name}!

Tvoje objednávka bola prijatá. Tu sú detaily:

Produkty:
${products}

Spôsob doručenia: ${delivery}
Celkom: ${total} €

Ďakujeme za nákup!
      `
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email odoslaný zákazníkovi." })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Nepodarilo sa odoslať email." })
    };
  }
};
