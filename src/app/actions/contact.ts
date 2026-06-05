'use server';

import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import ContactFormEmail from '@/emails/ContactFormEmail';
import ClientConfirmationEmail from '@/emails/ClientConfirmationEmail';
import { getDictionary } from '@/app/[lang]/dictionaries';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitQuoteRequest(state: any, formData: FormData) {
  const lang = formData.get('lang') as string || 'pl';
  const brandModel = formData.get('brandModel') as string || ''; // Client/Company Name
  const year = formData.get('year') as string || ''; // Timeframe
  const engine = formData.get('engine') as string || ''; // Service Type
  const price = formData.get('price') as string || ''; // Budget
  const city = formData.get('city') as string || ''; // Location
  const phone = formData.get('phone') as string || '';
  const email = formData.get('email') as string || '';
  const description = formData.get('description') as string || ''; // Project Description
  const honeypot = formData.get('website') as string || '';
  
  const isPl = lang === 'pl';

  // 1. Zabezpieczenie HONEYPOT:
  if (honeypot) {
    return {
      success: true,
      message: isPl 
        ? 'Twoje zgłoszenie zostało przyjęte! Nasz doradca skontaktuje się z Tobą w ciągu 24 godzin.'
        : 'Your inquiry has been received! Our advisor will contact you within 24 hours.',
    };
  }

  // 2. Podstawowa walidacja antyspamowa
  if (phone.length > 50 || email.length > 150 || brandModel.length > 200) {
    return {
      success: false,
      message: isPl
        ? 'Wykryto nieprawidłowe dane w formularzu. Spróbuj ponownie.'
        : 'Invalid form data detected. Please try again.',
    };
  }
  
  // Extract files
  const images = formData.getAll('images') as File[];
  const validImages = images.filter(img => img.size > 0 && img.name !== 'undefined');

  // Zapisz lead do bazy danych (zgodnie z istniejącym schematem Prisma)
  try {
    await prisma.quoteRequest.create({
      data: {
        brandModel,
        year,
        engine,
        price,
        city,
        phone,
        email,
        description,
        imagesCount: validImages.length,
      }
    });
  } catch (error) {
    console.error('Błąd zapisu do bazy Prisma:', error);
  }

  // Przygotuj załączniki (konwersja plików na Buffer)
  const attachments = await Promise.all(
    validImages.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return {
        filename: file.name,
        content: buffer,
      };
    })
  );

  // Wyślij e-mail do administratora przez Resend
  try {
    const adminSubject = `🔥 Nowy kontakt (webwawa.pl): ${brandModel} - ${engine}`;
    const { error } = await resend.emails.send({
      from: 'Kontakt webwawa.pl <kontakt@webwawa.pl>', // Domena agencji IT
      to: ['kontakt@webwawa.pl', 'krzysztofpiesio89@gmail.com'],
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
        imagesCount: validImages.length,
      }),
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error('Resend API Error (Admin):', error);
    } else {
      // Wyślij potwierdzenie do klienta (bez załączników) w jego języku
      try {
        const clientSubject = isPl 
          ? 'Potwierdzenie: Otrzymaliśmy Twoje zapytanie - webwawa.pl'
          : 'Confirmation: We have received your project inquiry - webwawa.pl';

        const clientDict = {
          subject: clientSubject,
          greeting: isPl ? 'Witaj,' : 'Hello,',
          intro: isPl 
            ? 'Dziękujemy za przesłanie zapytania ofertowego na stronie webwawa.pl. Poniżej znajduje się podsumowanie Twojego zgłoszenia:'
            : 'Thank you for submitting your project inquiry on webwawa.pl. Below is a summary of your inquiry:',
          detailsBrand: isPl ? 'Klient / Firma' : 'Client / Company',
          detailsYear: isPl ? 'Czas realizacji' : 'Timeframe',
          detailsPrice: isPl ? 'Szacowany budżet' : 'Estimated Budget',
          detailsCity: isPl ? 'Lokalizacja' : 'Location',
          nextStepsTitle: isPl ? 'Co dalej?' : 'What are the next steps?',
          nextStepsText: isPl
            ? 'Nasz konsultant analizuje przesłane informacje i przygotowuje wstępną wycenę. Skontaktujemy się z Tobą telefonicznie lub mailowo w ciągu 24 godzin.'
            : 'Our consultant is analyzing the provided details and preparing an initial estimate. We will contact you via phone or email within 24 hours.',
          footer: isPl ? 'Z poważaniem, Zespół webwawa.pl' : 'Best regards, webwawa.pl Team',
          footerAddress: 'webwawa.pl'
        };

        if (email) {
          const { error: clientError } = await resend.emails.send({
            from: 'Zespół webwawa.pl <kontakt@webwawa.pl>',
            to: [email],
            subject: clientSubject,
            react: ClientConfirmationEmail({
              dict: clientDict,
              brandModel,
              year,
              engine,
              price,
              city,
              phone,
            }),
          });
          
          if (clientError) {
            console.error('Resend API Error (Client):', clientError);
          }
        }
      } catch (e) {
        console.error('Błąd podczas wysyłki potwierdzenia do klienta:', e);
      }
    }
  } catch (e) {
    console.error('Krytyczny błąd podczas wysyłki Resend:', e);
  }

  return {
    success: true,
    message: isPl
      ? 'Twoje zgłoszenie zostało przyjęte! Nasz doradca skontaktuje się z Tobą w ciągu 24 godzin.'
      : 'Your inquiry has been received! Our advisor will contact you within 24 hours.',
  };
}
