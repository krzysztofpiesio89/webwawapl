import {
  Body,
  Container,
  Head,
  Heading,
  Html,
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
          <Preview>Nowe zapytanie (webwawa.pl): {brandModel}</Preview>
          <Container className="mx-auto my-10 max-w-[600px]">
            {/* Header / Logo */}
            <Section className="px-8 py-6 text-center">
              <Heading className="m-0 text-2xl font-black tracking-tight text-slate-900 uppercase">
                webwawa<span className="text-indigo-600">.pl</span>
              </Heading>
            </Section>

            {/* Main Content Box */}
            <Section className="border border-solid border-slate-200 bg-white rounded-3xl overflow-hidden shadow-sm">
              {/* Subtle top indicator bar */}
              <div className="h-1.5 bg-gradient-to-r from-violet-500 to-indigo-600"></div>
              
              <Row className="p-8">
                <Column>
                  <Heading className="text-[20px] font-black text-slate-900 m-0 mb-6 uppercase tracking-tight">
                    Nowe zapytanie ofertowe (B2B Lead)
                  </Heading>
                  
                  <Text className="text-sm text-slate-600 leading-relaxed mb-6">
                    Otrzymano nowe zapytanie o projekt IT ze strony <strong className="text-slate-900">webwawa.pl</strong>. Poniżej znajdują się szczegóły zgłoszenia:
                  </Text>
                  
                  {/* Details block */}
                  <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-100">
                    <Row className="mb-4">
                      <Column>
                        <Text className="m-0 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Klient / Firma
                        </Text>
                        <Text className="m-0 text-base font-bold text-slate-900 mt-0.5">
                          {brandModel}
                        </Text>
                      </Column>
                    </Row>

                    {engine && (
                      <Row className="mb-4">
                        <Column>
                          <Text className="m-0 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Rodzaj usługi
                          </Text>
                          <Text className="m-0 text-sm font-semibold text-slate-800 mt-0.5">
                            {engine}
                          </Text>
                        </Column>
                      </Row>
                    )}

                    {year && (
                      <Row className="mb-4">
                        <Column>
                          <Text className="m-0 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Czas realizacji
                          </Text>
                          <Text className="m-0 text-sm font-semibold text-slate-800 mt-0.5">
                            {year}
                          </Text>
                        </Column>
                      </Row>
                    )}

                    {price && (
                      <Row className="mb-4">
                        <Column>
                          <Text className="m-0 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Budżet
                          </Text>
                          <Text className="m-0 text-sm font-bold text-indigo-600 mt-0.5">
                            {price}
                          </Text>
                        </Column>
                      </Row>
                    )}

                    {city && (
                      <Row className="mb-4">
                        <Column>
                          <Text className="m-0 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Lokalizacja
                          </Text>
                          <Text className="m-0 text-sm font-semibold text-slate-800 mt-0.5">
                            {city}
                          </Text>
                        </Column>
                      </Row>
                    )}

                    <Row className="mb-4">
                      <Column>
                        <Text className="m-0 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Telefon
                        </Text>
                        <Text className="m-0 text-sm mt-0.5">
                          <a href={`tel:${phone}`} className="font-bold text-indigo-600 no-underline">
                            {phone}
                          </a>
                        </Text>
                      </Column>
                    </Row>

                    <Row>
                      <Column>
                        <Text className="m-0 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Adres E-mail
                        </Text>
                        <Text className="m-0 text-sm mt-0.5">
                          <a href={`mailto:${email}`} className="font-semibold text-indigo-600 no-underline">
                            {email}
                          </a>
                        </Text>
                      </Column>
                    </Row>
                  </div>

                  {/* Description Box */}
                  {description && (
                    <div className="mt-6 border-t border-solid border-slate-100 pt-6">
                      <Heading as="h3" className="text-sm font-bold text-slate-900 m-0 mb-2 uppercase tracking-wide">
                        Opis projektu / Wymagania
                      </Heading>
                      <Text className="text-sm text-slate-700 leading-relaxed m-0 italic bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
                        {description}
                      </Text>
                    </div>
                  )}

                  {/* Attachment indicator badge */}
                  <div className="mt-6 bg-indigo-50/50 p-4 rounded-2xl border border-solid border-indigo-100/50 text-center">
                    <Text className="text-xs font-bold text-indigo-700 m-0 uppercase tracking-wider">
                      Liczba przesłanych plików / brief: {imagesCount}
                    </Text>
                  </div>
                </Column>
              </Row>
            </Section>

            {/* Footer */}
            <Section className="text-center mt-8 px-6">
              <Text className="text-[10px] leading-relaxed text-slate-400 m-0 uppercase tracking-wider">
                © {new Date().getFullYear()} | webwawa.pl | Panel Administratora
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ContactFormEmail;
