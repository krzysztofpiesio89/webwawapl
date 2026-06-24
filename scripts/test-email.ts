import { Resend } from 'resend';
import * as dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    console.log('Sending test email...');
    const { data, error } = await resend.emails.send({
      from: 'Kontakt webwawa.pl <kontakt@webwawa.pl>',
      to: ['kontakt@webwawa.pl', 'krzysztofpiesio89@gmail.com'],
      subject: 'Test integracji poczty Resend webwawa.pl',
      html: '<p>Wiadomość testowa weryfikująca prawidłowe podłączenie domeny webwawa.pl do usługi Resend.</p>',
    });

    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent successfully!', data);
    }
  } catch (err) {
    console.error('Critical error:', err);
  }
}

testEmail();
