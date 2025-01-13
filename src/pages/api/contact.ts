import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const userEmail = formData.get('email') as string;
        const userName = formData.get('name') as string;

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
                // This is important for some hosting providers
                rejectUnauthorized: false
            }
        });

        // Verify SMTP connection
        await transporter.verify().catch(console.error);

        // Original email to you
        await transporter.sendMail({
            from: import.meta.env.EMAIL_USER,
            to: import.meta.env.EMAIL_TO,
            subject: `New Contact Form: ${formData.get('subject')}`,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.get('name')}</p>
        <p><strong>Email:</strong> ${formData.get('email')}</p>
        <p><strong>Phone:</strong> ${formData.get('phone')}</p>
        <p><strong>Subject:</strong> ${formData.get('subject')}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.get('message')}</p>
      `
        });

        // Enhanced automated reply to the user
        await transporter.sendMail({
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
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
              <!-- Header with Logo -->
              <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px 20px; text-align: center;">
                <img src="https://alcanzaship.com/home/logo.jpg" alt="Alcanza Ship Services" style="max-width: 200px; height: auto;">
              </div>
              
              <!-- Main Content -->
              <div style="padding: 40px 30px;">
                <h2 style="color: #1e3a8a; margin: 0 0 20px; font-size: 24px;">Dear ${userName},</h2>
                
                <p style="margin: 0 0 15px; color: #374151;">Thank you for reaching out to Alcanza Ship Services. We have received your message and appreciate your interest in our services.</p>
                
                <p style="margin: 0 0 25px; color: #374151;">Our dedicated team will carefully review your inquiry and respond within 24-48 business hours with the information you need.</p>
                
                <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 25px 0;">
                  <h3 style="color: #1e3a8a; margin: 0 0 15px; font-size: 18px;">For Immediate Assistance:</h3>
                  <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="margin-bottom: 10px;">
                      <strong style="color: #1e3a8a;">📞 Phone:</strong>
                      <a href="tel:+971561635323" style="color: #3b82f6; text-decoration: none;">+971 (56) 163 5323</a>
                    </li>
                    <li style="margin-bottom: 10px;">
                      <strong style="color: #1e3a8a;">📧 Email:</strong>
                      <a href="mailto:operation@alcanzaship.com" style="color: #3b82f6; text-decoration: none;">operation@alcanzaship.com</a>
                    </li>
                    <li>
                      <strong style="color: #1e3a8a;">📍 Address:</strong>
                      <span style="color: #374151;">Mai Tower, Office 401-405, Al Nahda 1, Dubai, UAE</span>
                    </li>
                  </ul>
                </div>
                
                <p style="margin: 25px 0; color: #374151;">We look forward to assisting you with your shipping needs.</p>
                
                <p style="margin: 0; color: #374151;">
                  Best Regards,<br>
                  <strong style="color: #1e3a8a;">Alcanza Ship Services Team</strong>
                </p>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">Connect with us</p>
                <div style="margin-bottom: 20px;">
                  <!-- Add your social media links here -->
                  <a href="#" style="margin: 0 10px; text-decoration: none;">LinkedIn</a>
                  <a href="#" style="margin: 0 10px; text-decoration: none;">Twitter</a>
                  <a href="#" style="margin: 0 10px; text-decoration: none;">Facebook</a>
                  <a href="#" style="margin: 0 10px; text-decoration: none;">Instagram</a>
                </div>
                <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                  This is an automated response. Please do not reply to this email.
                </p>
              </div>
            </div>
            
            <!-- Company Info -->
            <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px;">
              <p style="margin: 0;">© ${new Date().getFullYear()} Alcanza Ship Services. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
        });

        return new Response(
            JSON.stringify({
                message: 'Email sent successfully'
            }),
            { 
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(
            JSON.stringify({
                message: 'Failed to send email',
                error: error instanceof Error ? error.message : 'Unknown error'
            }),
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
} 