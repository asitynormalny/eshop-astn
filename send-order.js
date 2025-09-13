import nodemailer from "nodemailer";

export async function handler(event) {
  try {
    const data = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsList = data.cart
      .map((i) => `${i.product} (${i.size}) x${i.qty} - ${i.price * i.qty} €`)
      .join("\n");

    const mailOptions = {
      from: `"Mini E-shop" <${process.env.EMAIL_USER}>`,
      to: process.env.ORDER_RECEIVER,
      subject: `Nová objednávka od ${data.name}`,
      text: `
Nová objednávka:

Meno: ${data.name}
Email: ${data.email}
Telefón: ${data.phone}
Adresa: ${data.street}, ${data.zip}, ${data.country}
Doručenie: ${data.delivery}
Poznámka: ${data.note || "-"}

Objednané produkty:
${itemsList}

Dobierka: ${data.cod ? "Áno" : "Nie"}
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Objednávka odoslaná" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Chyba pri odosielaní objednávky" }),
    };
  }
}
