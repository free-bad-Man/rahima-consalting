import nodemailer from "nodemailer";

// Конфигурация SMTP
const smtpConfig = {
  host: process.env.SMTP_HOST || "smtp.beget.com",
  port: parseInt(process.env.SMTP_PORT || "2525"),
  secure: process.env.SMTP_SECURE === "true", // true для 465, false для других
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASSWORD || "",
  },
};

// Создаём транспорт для отправки писем
const transporter = nodemailer.createTransport(smtpConfig);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Отправка email
 */
export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@rahima-consulting.ru";

  try {
    const info = await transporter.sendMail({
      from: `"Rahima Consulting" <${from}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Fallback текст без HTML
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

/**
 * Отправка письма для сброса пароля
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; text-align: center;">Rahima Consulting</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Восстановление пароля</h2>
        
        <p>Вы получили это письмо, потому что был запрошен сброс пароля для вашего аккаунта.</p>
        
        <p>Нажмите на кнопку ниже, чтобы создать новый пароль:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold;
                    display: inline-block;">
            Сбросить пароль
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:
          <br>
          <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="color: #999; font-size: 12px;">
          Ссылка действительна в течение 1 часа.
          <br><br>
          Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        © ${new Date().getFullYear()} Rahima Consulting. Все права защищены.
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Восстановление пароля — Rahima Consulting",
    html,
  });
}
