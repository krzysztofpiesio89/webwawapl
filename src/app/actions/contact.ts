'use server';

import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import ContactFormEmail from '@/emails/ContactFormEmail';
import ClientConfirmationEmail from '@/emails/ClientConfirmationEmail';
import { getDictionary, Locale } from '@/app/[lang]/dictionaries';

const resend = new Resend(process.env.RESEND_API_KEY);

const successMessages: Record<string, string> = {
  pl: 'Twoje zgłoszenie zostało przyjęte! Nasz doradca skontaktuje się z Tobą w ciągu 24 godzin.',
  en: 'Your inquiry has been received! Our advisor will contact you within 24 hours.',
  de: 'Ihre Anfrage ist eingegangen! Unser Berater wird sich innerhalb von 24 Stunden mit Ihnen in Verbindung setzen.',
  uk: 'Ваш запит отримано! Наш консультант зв\'яжеться з вами протягом 24 годин.',
  ru: 'Ваш запрос получен! Наш консультант свяжется с вами в течение 24 часов.',
  zh: '您的咨询已收到！我们的顾问将在 24 小时内与您联系。',
};

const invalidDataMessages: Record<string, string> = {
  pl: 'Wykryto nieprawidłowe dane w formularzu. Spróbuj ponownie.',
  en: 'Invalid form data detected. Please try again.',
  de: 'Ungültige Formulardaten erkannt. Bitte versuchen Sie es erneut.',
  uk: 'Виявлено недійсні дані форми. Будь ласка, спробуйте ще раз.',
  ru: 'Обнаружены недействительные данные формы. Пожалуйста, попробуйте еще раз.',
  zh: '检测到无效的表单数据。请重试。',
};

export async function submitQuoteRequest(state: any, formData: FormData) {
  const lang = (formData.get('lang') as string || 'pl').toLowerCase();
  const brandModel = formData.get('brandModel') as string || ''; // Client/Company Name
  const year = formData.get('year') as string || ''; // Timeframe
  const engine = formData.get('engine') as string || ''; // Service Type
  const price = formData.get('price') as string || ''; // Budget
  const city = formData.get('city') as string || ''; // Location
  const phone = formData.get('phone') as string || '';
  const email = formData.get('email') as string || '';
  const description = formData.get('description') as string || ''; // Project Description
  const honeypot = formData.get('website') as string || '';
  
  const successMessage = successMessages[lang] || successMessages.en;
  const invalidMessage = invalidDataMessages[lang] || invalidDataMessages.en;

  // 1. Zabezpieczenie HONEYPOT:
  if (honeypot) {
    return {
      success: true,
      message: successMessage,
    };
  }

  // 2. Podstawowa walidacja antyspamowa
  if (phone.length > 50 || email.length > 150 || brandModel.length > 200) {
    return {
      success: false,
      message: invalidMessage,
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
      from: 'Kontakt webwawa.pl <biuro@webwawa.pl>', // Domena agencji IT
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
        imagesCount: validImages.length,
      }),
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error('Resend API Error (Admin):', error);
    } else {
      // Wyślij potwierdzenie do klienta (bez załączników) w jego języku
      try {
        const dict = await getDictionary(lang as Locale);
        const emailDict = dict.email || {};
        const clientSubject = emailDict.subject || (lang === 'pl'
          ? 'Potwierdzenie: Otrzymaliśmy Twoje zapytanie - webwawa.pl'
          : 'Confirmation: We have received your project inquiry - webwawa.pl');

        if (email) {
          const { error: clientError } = await resend.emails.send({
            from: 'Zespół webwawa.pl <biuro@webwawa.pl>',
            to: [email],
            subject: clientSubject,
            react: ClientConfirmationEmail({
              dict: emailDict,
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
    message: successMessage,
  };
}
