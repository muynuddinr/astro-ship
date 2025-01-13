import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import imapSimple from 'imap-simple';

// IMAP configuration
const imapConfig = {
    imap: {
        user: import.meta.env.EMAIL_USER,
        password: import.meta.env.EMAIL_PASSWORD,
        host: import.meta.env.EMAIL_HOST,
        port: 993,
        tls: true,
        authTimeout: 3000,
        tlsOptions: { rejectUnauthorized: false }
    }
};

// Function to save email to sent folder
async function saveEmailToSentFolder(emailContent: any) {
    try {
        const connection = await imapSimple.connect(imapConfig);
        await connection.openBox('Sent');
        
        const message = {
            ...emailContent,
            flags: ['\\Seen']
        };

        await connection.append(message.html, {
            mailbox: 'Sent',
            flags: ['\\Seen']
        });

        await connection.end();
    } catch (error) {
        console.error('Error saving to sent folder:', error);
    }
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const userEmail = formData.get('email') as string;
        const userName = formData.get('name') as string;
        const userPhone = formData.get('phone') as string;
        const userSubject = formData.get('subject') as string;
        const userMessage = formData.get('message') as string;

        // Create transporter based on environment
        const transporter = nodemailer.createTransport({
            host: import.meta.env.EMAIL_HOST || 'smtp.hostinger.com',
            port: parseInt(import.meta.env.EMAIL_PORT || '465'),
            secure: true,
            auth: {
                user: import.meta.env.EMAIL_USER,
                pass: import.meta.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify SMTP connection
        await transporter.verify().catch(console.error);

        // Admin notification email content
        const adminEmailContent = {
            from: import.meta.env.EMAIL_USER,
            to: import.meta.env.EMAIL_TO,
            subject: `New Contact Form: ${userSubject}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #003366; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background-color: #f9f9f9; }
                        .field { margin-bottom: 15px; }
                        .label { font-weight: bold; color: #003366; }
                        .message { white-space: pre-wrap; background-color: white; padding: 15px; border-left: 4px solid #003366; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>New Contact Form Submission</h2>
                        </div>
                        <div class="content">
                            <div class="field">
                                <span class="label">Name:</span> ${userName}
                            </div>
                            <div class="field">
                                <span class="label">Email:</span> ${userEmail}
                            </div>
                            <div class="field">
                                <span class="label">Phone:</span> ${userPhone}
                            </div>
                            <div class="field">
                                <span class="label">Subject:</span> ${userSubject}
                            </div>
                            <div class="field">
                                <span class="label">Message:</span>
                                <div class="message">${userMessage}</div>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        // Update user auto-reply template with the enhanced version
        const userEmailContent = {
            from: import.meta.env.EMAIL_USER,
            to: userEmail,
            subject: 'Thank you for contacting Alcanza Ship Services',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Thank you for your message</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; background-color: #f6f9fc;">
                    <div class="container">
                        <div class="header">
                            <h2>Thank You for Contacting Us</h2>
                        </div>
                        <div class="content">
                            <p>Dear ${userName},</p>
                            <div class="message">
                                <p>Thank you for reaching out to Alcanza Ship Services. We have received your inquiry and our team will review it promptly.</p>
                                <p>You can expect to hear back from us within 24-48 hours.</p>
                            </div>
                            <div class="signature">
                                <p>Best regards,<br>
                                <strong>Alcanza Ship Services Team</strong></p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        // Send emails and save to sent folder
        await transporter.sendMail(adminEmailContent);
        await transporter.sendMail(userEmailContent);
        await saveEmailToSentFolder(adminEmailContent);
        await saveEmailToSentFolder(userEmailContent);

        return new Response(
            JSON.stringify({ message: 'Email sent successfully' }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(
            JSON.stringify({ message: 'Failed to send email' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};

// Add this line to ensure the endpoint is recognized
export const prerender = false;

export const GET: APIRoute = async () => {
    return new Response(
        JSON.stringify({
            message: 'Contact API endpoint is working'
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
}; 