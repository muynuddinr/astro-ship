import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

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
                        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; }
                        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                        .header { background: linear-gradient(135deg, #003366 0%, #0056b3 100%); color: white; padding: 30px; text-align: center; }
                        .content { padding: 30px; background-color: #f9f9f9; }
                        .field { margin-bottom: 20px; background: white; padding: 15px; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                        .label { font-weight: bold; color: #003366; display: block; margin-bottom: 5px; }
                        .value { color: #444; }
                        .message-box { background: white; padding: 20px; border-left: 4px solid #003366; margin-top: 20px; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2 style="margin: 0;">New Contact Form Submission</h2>
                        </div>
                        <div class="content">
                            <div class="field">
                                <span class="label">Name</span>
                                <span class="value">${userName}</span>
                            </div>
                            <div class="field">
                                <span class="label">Email</span>
                                <span class="value">${userEmail}</span>
                            </div>
                            <div class="field">
                                <span class="label">Phone</span>
                                <span class="value">${userPhone}</span>
                            </div>
                            <div class="field">
                                <span class="label">Subject</span>
                                <span class="value">${userSubject}</span>
                            </div>
                            <div class="message-box">
                                <span class="label">Message</span>
                                <div class="value" style="white-space: pre-wrap;">${userMessage}</div>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        // User auto-reply email content
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
                    <style>
                        body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; line-height: 1.6; }
                    </style>
                </head>
                <body style="background-color: #f6f9fc;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <!-- Header -->
                            <div style="background: linear-gradient(135deg, #003366 0%, #0056b3 100%); padding: 40px 20px; text-align: center;">
                                <img src="https://alcanzaship.com/home/logo.jpg" alt="Alcanza Ship Services" style="max-width: 200px; height: auto;">
                            </div>
                            
                            <!-- Content -->
                            <div style="padding: 40px 30px;">
                                <h2 style="color: #003366; margin: 0 0 20px;">Dear ${userName},</h2>
                                
                                <p style="color: #444; margin-bottom: 20px;">Thank you for reaching out to Alcanza Ship Services. We have received your inquiry and appreciate your interest in our services.</p>
                                
                                <p style="color: #444; margin-bottom: 30px;">Our team will carefully review your message and respond within 24-48 business hours.</p>
                                
                                <!-- Contact Info Box -->
                                <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin: 30px 0;">
                                    <h3 style="color: #003366; margin: 0 0 15px;">Need Immediate Assistance?</h3>
                                    <div style="margin-bottom: 15px;">
                                        <strong style="color: #003366;">📞 Phone:</strong><br>
                                        <a href="tel:+971561635323" style="color: #0056b3; text-decoration: none;">+971 (56) 163 5323</a>
                                    </div>
                                    <div style="margin-bottom: 15px;">
                                        <strong style="color: #003366;">📧 Email:</strong><br>
                                        <a href="mailto:operation@alcanzaship.com" style="color: #0056b3; text-decoration: none;">operation@alcanzaship.com</a>
                                    </div>
                                    <div>
                                        <strong style="color: #003366;">📍 Address:</strong><br>
                                        <span style="color: #444;">Mai Tower, Office 401-405, Al Nahda 1, Dubai, UAE</span>
                                    </div>
                                </div>
                                
                                <p style="color: #444; margin: 30px 0;">We look forward to serving your shipping needs.</p>
                                
                                <div style="margin-top: 30px; color: #444;">
                                    Best Regards,<br>
                                    <strong style="color: #003366;">Alcanza Ship Services Team</strong>
                                </div>
                            </div>
                            
                            <!-- Footer -->
                            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                                <p style="color: #666; font-size: 14px; margin-bottom: 15px;">Connect with us</p>
                                <div style="margin-bottom: 20px;">
                                    <a href="#" style="color: #0056b3; text-decoration: none; margin: 0 10px;">LinkedIn</a>
                                    <a href="#" style="color: #0056b3; text-decoration: none; margin: 0 10px;">Twitter</a>
                                    <a href="#" style="color: #0056b3; text-decoration: none; margin: 0 10px;">Facebook</a>
                                    <a href="#" style="color: #0056b3; text-decoration: none; margin: 0 10px;">Instagram</a>
                                </div>
                                <p style="color: #999; font-size: 12px; margin: 0;">
                                    This is an automated response. Please do not reply to this email.
                                </p>
                            </div>
                        </div>
                        
                        <!-- Copyright -->
                        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                            <p style="margin: 0;">© ${new Date().getFullYear()} Alcanza Ship Services. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        // Send emails
        await transporter.sendMail(adminEmailContent);
        await transporter.sendMail(userEmailContent);

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