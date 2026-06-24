import { Resend } from 'resend';
import * as dotenv from 'dotenv';
dotenv.config();

// Fix DOM/React hydration environments for emails in CLI
import { ContactFormEmail } from '../src/emails/ContactFormEmail';
import { ClientConfirmationEmail } from '../src/emails/ClientConfirmationEmail';
import { getDictionary } from '../src/app/[lang]/dictionaries';

const resend = new Resend(process.env.RESEND_API_KEY);

async function runTest() {
  console.log('Rozpoczynam test wysyłania formularza (z wygenerowaniem nowych szablonów e-mail)...');

  const brandModel = 'Firma Testowa Sp. z o.o.';
  const year = 'ASAP (Do 2 tygodni)';
  const engine = 'Aplikacja Webowa B2B';
  const price = '20 000 - 40 000 PLN';
  const city = 'Warszawa';
  const phone = '+48 111 222 333';
  const email = 'krzysztofpiesio89@gmail.com';
  const description = 'Testowa wiadomość z nowego, pięknego formularza po zmianie kolorów na Premium Dark Mode. Sprawdzamy czy maile docierają do biuro@webwawa.pl.';

  try {
    const dict = await getDictionary('pl');

    console.log('Wysyłam powiadomienie Admina do biuro@webwawa.pl...');
    const adminSubject = `🔥 Nowy kontakt (webwawa.pl): ${brandModel} - ${engine}`;
    const adminRes = await resend.emails.send({
      from: 'Kontakt webwawa.pl <biuro@webwawa.pl>',
      to: ['biuro@webwawa.pl', 'krzysztofpiesio89@gmail.com'],
      subject: adminSubject,
      react: ContactFormEmail({
        brandModel,
        year,
        engine,
        price,
        city,
        phone,
        email,
        description,
        imagesCount: 0,
      }),
    });

    console.log('Powiadomienie Admina wysłane:', adminRes);

    console.log('Wysyłam potwierdzenie do Klienta...');
    const clientSubject = dict.email?.subject || 'Potwierdzenie: Otrzymaliśmy Twoje zapytanie - webwawa.pl';
    const clientRes = await resend.emails.send({
      from: 'Zespół webwawa.pl <biuro@webwawa.pl>',
      to: [email],
      subject: clientSubject,
      react: ClientConfirmationEmail({
        dict: dict.email || {},
        brandModel,
        year,
        engine,
        price,
        city,
        phone,
      }),
    });

    console.log('Potwierdzenie Klienta wysłane:', clientRes);

    console.log('✅ Sukces! Wiadomości testowe zostały wygenerowane z nowych szablonów i przesłane przez Resend.');
  } catch (err) {
    console.error('Krytyczny błąd skryptu testowego:', err);
  }
}

runTest();
