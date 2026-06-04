import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface ContactFormEmailProps {
  brandModel: string;
  year: string;
  engine: string;
  price: string;
  city: string;
  phone: string;
  email: string;
  description: string;
  imagesCount: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://skupautwawa.pl';

export const ContactFormEmail = ({
  brandModel,
  year,
  engine,
  price,
  city,
  phone,
  email,
  description,
  imagesCount,
}: ContactFormEmailProps) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="bg-slate-50 font-sans">
          <Preview>Nowe zapytanie o wycenę: {brandModel}</Preview>
          <Container>
            <Section className="px-5 py-[30px] text-center bg-white">
              <Heading className="m-0 text-3xl font-black tracking-tighter uppercase italic text-slate-900">
                skupaut<span className="text-amber-500">wawa.pl</span>
              </Heading>
            </Section>

            <Section className="border border-solid border-slate-200 bg-white rounded-3xl overflow-hidden shadow-lg">
              <Row className="bg-amber-400 p-5">
                <Column>
                  <Heading className="text-[24px] font-black text-slate-900 text-center uppercase italic m-0">
                    Nowe zapytanie o wycenę
                  </Heading>
                </Column>
              </Row>

              <Row className="p-8">
                <Column>
                  <Text className="text-base text-slate-800 mb-6">
                    Otrzymano nowe zgłoszenie wyceny pojazdu ze strony SkupAutWawa.pl. Poniżej znajdują się szczegóły:
                  </Text>
                  
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <Text className="text-base m-0 mb-2">
                      <b className="text-slate-500 uppercase text-xs tracking-wider">Pojazd: </b><br/>
                      <span className="text-xl font-bold text-slate-900">{brandModel}</span>
                    </Text>
                    
                    <Text className="text-base m-0 mb-2">
                      <b className="text-slate-500 uppercase text-xs tracking-wider">Rocznik: </b><br/>
                      <span className="font-semibold text-slate-700">{year || '-'}</span>
                    </Text>
                    
                    <Text className="text-base m-0 mb-2">
                      <b className="text-slate-500 uppercase text-xs tracking-wider">Silnik: </b><br/>
                      <span className="font-semibold text-slate-700">{engine || '-'}</span>
                    </Text>

                    <Text className="text-base m-0 mb-2">
                      <b className="text-slate-500 uppercase text-xs tracking-wider">Proponowana cena: </b><br/>
                      <span className="text-lg font-bold text-amber-600">{price || '-'}</span>
                    </Text>
                    
                    <Text className="text-base m-0 mb-2">
                      <b className="text-slate-500 uppercase text-xs tracking-wider">Lokalizacja: </b><br/>
                      <span className="font-semibold text-slate-700">{city || '-'}</span>
                    </Text>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <Heading as="h3" className="text-lg font-bold text-slate-900 m-0 mb-4 uppercase">Dane Kontaktowe</Heading>
                    <Text className="text-base m-0 mb-2">
                      <b className="text-slate-500 uppercase text-xs tracking-wider">Telefon: </b><br/>
                      <a href={`tel:${phone}`} className="text-xl font-black text-blue-600 no-underline">{phone}</a>
                    </Text>
                    <Text className="text-base m-0 mb-4">
                      <b className="text-slate-500 uppercase text-xs tracking-wider">E-mail: </b><br/>
                      <a href={`mailto:${email}`} className="font-semibold text-blue-600 no-underline">{email}</a>
                    </Text>
                  </div>

                  {description && (
                     <div className="mt-4 border-t border-slate-100 pt-6">
                        <Text className="text-base m-0 mb-2">
                          <b className="text-slate-500 uppercase text-xs tracking-wider">Dodatkowy opis: </b><br/>
                          <span className="italic text-slate-700">{description}</span>
                        </Text>
                     </div>
                  )}

                  <div className="mt-6 bg-amber-50 p-4 rounded-xl border border-amber-100 text-center">
                    <Text className="text-base font-bold text-amber-800 m-0">
                      Załączone zdjęcia: {imagesCount} (zobacz załączniki do tego e-maila)
                    </Text>
                  </div>
                  
                </Column>
              </Row>
            </Section>

            <Text className="text-center text-xs leading-[24px] text-slate-400 mt-8 font-semibold">
              © {new Date().getFullYear()} | SkupAutWawa.pl | Formularz wyceny online
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ContactFormEmail;
