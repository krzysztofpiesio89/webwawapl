import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  Img,
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
        <Body className="bg-[#0f172a] font-sans m-0 p-0 text-slate-300">
          <Preview>Nowe zapytanie (webwawa.pl): {brandModel}</Preview>
          <Container className="bg-[#020617] mx-auto my-8 max-w-[640px] border border-solid border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            {/* Header */}
            <Section className="px-8 pt-8 pb-6 border-b border-solid border-slate-800/60">
              <Row>
                <Column align="left" style={{ width: '40px' }}>
                  <Img src="https://webwawa.pl/favicon.svg" width="32" height="32" alt="Logo" />
                </Column>
                <Column align="left">
                  <Heading className="m-0 text-2xl font-black tracking-tight text-white lowercase">
                    webwawa<span className="text-amber-500">.pl</span>
                  </Heading>
                </Column>
              </Row>
            </Section>

            {/* Main Content */}
            <Section className="px-8 pt-8 pb-10">
              <Section align="left">
                <Text className="m-0 text-2xl font-bold tracking-tight text-white mb-6 uppercase">
                  Nowy B2B Lead
                </Text>
                
                <Text className="text-[15px] text-slate-400 leading-relaxed m-0 mb-8">
                  Otrzymano nowe zapytanie ze strony <strong className="text-white">webwawa.pl</strong>. Poniżej znajdują się szczegóły formularza.
                </Text>
              </Section>

              {/* Details block */}
              <Section className="border border-solid border-slate-800 bg-[#0f172a]/50 p-6 rounded-2xl mb-8">
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5 mt-0">
                  Szczegóły zgłoszenia
                </Text>
                
                <Row className="mb-4">
                  <Column>
                    <Text className="m-0 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Klient / Firma
                    </Text>
                    <Text className="m-0 text-[15px] font-bold text-white mt-1">
                      {brandModel || '—'}
                    </Text>
                  </Column>
                </Row>

                {engine && (
                  <Row className="mb-4">
                    <Column>
                      <Text className="m-0 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Rodzaj usługi
                      </Text>
                      <Text className="m-0 text-[15px] font-bold text-white mt-1">
                        {engine}
                      </Text>
                    </Column>
                  </Row>
                )}

                {year && (
                  <Row className="mb-4">
                    <Column>
                      <Text className="m-0 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Czas realizacji
                      </Text>
                      <Text className="m-0 text-[15px] font-bold text-white mt-1">
                        {year}
                      </Text>
                    </Column>
                  </Row>
                )}

                {price && (
                  <Row className="mb-4">
                    <Column>
                      <Text className="m-0 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Budżet
                      </Text>
                      <Text className="m-0 text-[15px] font-bold text-amber-500 mt-1">
                        {price}
                      </Text>
                    </Column>
                  </Row>
                )}

                {city && (
                  <Row className="mb-4">
                    <Column>
                      <Text className="m-0 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Lokalizacja
                      </Text>
                      <Text className="m-0 text-[15px] font-bold text-white mt-1">
                        {city}
                      </Text>
                    </Column>
                  </Row>
                )}

                <Row className="mb-4">
                  <Column>
                    <Text className="m-0 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Telefon
                    </Text>
                    <Text className="m-0 text-[15px] mt-1">
                      <Link href={`tel:${phone}`} className="font-bold text-amber-400 no-underline">
                        {phone}
                      </Link>
                    </Text>
                  </Column>
                </Row>

                <Row>
                  <Column>
                    <Text className="m-0 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Adres E-mail
                    </Text>
                    <Text className="m-0 text-[15px] mt-1">
                      <Link href={`mailto:${email}`} className="font-semibold text-amber-400 no-underline">
                        {email}
                      </Link>
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Description Box */}
              {description && (
                <Section className="border border-solid border-slate-800 bg-[#0f172a] p-6 rounded-2xl mb-8">
                  <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 mt-0">
                    Opis projektu / Wymagania
                  </Text>
                  <Text className="text-[14px] text-slate-300 leading-relaxed m-0 italic">
                    {description}
                  </Text>
                </Section>
              )}

              {/* Attachment indicator badge */}
              <Section className="bg-[#0f172a] p-4 rounded-xl border border-solid border-slate-800/80 text-center">
                <Text className="text-[12px] font-bold text-slate-400 m-0 uppercase tracking-wider">
                  Liczba przesłanych plików / brief: {imagesCount}
                </Text>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="px-8 py-8 border-t border-solid border-slate-800 bg-[#0a0f1d]">
              <Row align="left">
                <Column className="w-full align-top">
                  <Text className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider m-0 text-center">
                    © {new Date().getFullYear()} | webwawa.pl
                  </Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ContactFormEmail;
