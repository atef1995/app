// Quick test script for SMTP configuration
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSMTP() {
  console.log('🧪 Testing SMTP Configuration...');
  console.log('Host:', process.env.SMTP_HOST);
  console.log('Port:', process.env.SMTP_PORT);
  console.log('User:', process.env.SMTP_USER);
  console.log('From:', process.env.SMTP_FROM);
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Verify connection
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');

    // Send test email
    console.log('📧 Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER, // Send to yourself
      subject: 'Test Email from Vibed to Cracked',
      html: `
        <h2>🎉 SMTP Configuration Test</h2>
        <p>If you're reading this, your email configuration is working correctly!</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ SMTP Configuration Error:');
    console.error(error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication Failed - Try these solutions:');
      console.log('1. Make sure 2FA is enabled on your Gmail account');
      console.log('2. Generate a new App Password');
      console.log('3. Use the 16-character app password (not your regular password)');
      console.log('4. Make sure "Less secure app access" is disabled (use App Password instead)');
    }
  }
}

testSMTP();