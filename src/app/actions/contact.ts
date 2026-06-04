'use server';

import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import ContactFormEmail from '@/emails/ContactFormEmail';
import ClientConfirmationEmail from '@/emails/ClientConfirmationEmail';
import { getDictionary } from '@/app/[lang]/dictionaries';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitQuoteRequest(state: any, formData: FormData) {
  const lang = formData.get('lang') as string || 'pl';
  const brandModel = formData.get('brandModel') as string || '';
  const year = formData.get('year') as string || '';
  const engine = formData.get('engine') as string || '';
  const price = formData.get('price') as string || '';
  const city = formData.get('city') as string || '';
  const phone = formData.get('phone') as string || '';
  const email = formData.get('email') as string || '';
  const description = formData.get('description') as string || '';
  const honeypot = formData.get('website') as string || '';
  
  // 1. Zabezpieczenie HONEYPOT:
  // Jeśli pole 'website' zostało wypełnione, to znaczy że to bot. Udajemy sukces.
  if (honeypot) {
    return {
      success: true,
      message: 'Twoje zgłoszenie zostało przyjęte! Nasz rzeczoznawca skontaktuje się z Tobą w ciągu 15 minut.',
    };
  }

  // 2. Podstawowa walidacja antyspamowa
  // Boty często wpisują ogromne ciągi znaków. Rok nie powinien mieć więcej niż 4 znaki.
  if (year.length > 4 || phone.length > 50) {
    return {
      success: false,
      message: 'Wykryto nieprawidłowe dane w formularzu. Spróbuj ponownie.',
    };
  }
  
  // Extract images
  const images = formData.getAll('images') as File[];
  const validImages = images.filter(img => img.size > 0 && img.name !== 'undefined');

  // Zapisz lead do bazy danych
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

  // Wyślij e-mail przez Resend
  try {
    const { error } = await resend.emails.send({
      from: 'Wycena Online <wycena@skupautwawa.pl>', // Nadawca zgodny ze zweryfikowaną domeną
      to: ['kontakt@skupautwawa.pl', 'krzysztofpiesio89@gmail.com', 'turbo664946209@yahoo.com'],
      subject: `🔥 Nowe zapytanie o wycenę: ${brandModel}`,
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
      // 2. Wyślij potwierdzenie do klienta (bez załączników) w jego języku
      try {
        const dict = await getDictionary(lang);
        if (email && dict?.email) {
          const { error: clientError } = await resend.emails.send({
            from: 'SkupAutWawa.pl <kontakt@skupautwawa.pl>',
            to: [email],
            subject: dict.email.subject,
            react: ClientConfirmationEmail({
              dict: dict.email,
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
    message: 'Twoje zgłoszenie zostało przyjęte! Nasz rzeczoznawca skontaktuje się z Tobą w ciągu 15 minut.',
  };
}
