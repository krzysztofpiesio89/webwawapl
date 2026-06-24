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

interface ClientConfirmationEmailProps {
  dict: any;
  brandModel: string;
  year: string;
  engine: string;
  price: string;
  city: string;
  phone: string;
}

export const ClientConfirmationEmail = ({
  dict,
  brandModel,
  year,
  engine,
  price,
  city,
  phone,
}: ClientConfirmationEmailProps) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="bg-[#0f172a] font-sans m-0 p-0 text-slate-300">
          <Preview>{dict.subject}</Preview>
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
                <Text className="m-0 text-2xl font-bold tracking-tight text-white mb-6">
                  {dict.subject}
                </Text>
                
                <Text className="text-base text-slate-200 mb-4 font-semibold">
                  {dict.greeting}
                </Text>
                
                <Text className="text-[15px] text-slate-400 leading-relaxed m-0 mb-8">
                  {dict.intro}
                </Text>
              </Section>

              {/* Styled Summary Box */}
              <Section className="border border-solid border-slate-800 bg-[#0f172a]/50 p-6 rounded-2xl mb-8">
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5 mt-0">
                  Szczegóły zapytania
                </Text>
                
                <Row className="mb-4">
                  <Column>
                    <Text className="m-0 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {dict.detailsBrand || 'Klient / Firma'}
                    </Text>
                    <Text className="m-0 text-[15px] font-bold text-slate-200 mt-1">
                      {brandModel || '—'}
                    </Text>
                  </Column>
                </Row>

                {engine && (
                  <Row className="mb-4">
                    <Column>
                      <Text className="m-0 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {dict.detailsEngine || 'Rodzaj usługi'}
                      </Text>
                      <Text className="m-0 text-[15px] font-bold text-slate-200 mt-1">
                        {engine}
                      </Text>
                    </Column>
                  </Row>
                )}

                {year && (
                  <Row className="mb-4">
                    <Column>
                      <Text className="m-0 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {dict.detailsYear || 'Czas realizacji'}
                      </Text>
                      <Text className="m-0 text-[15px] font-bold text-slate-200 mt-1">
                        {year}
                      </Text>
                    </Column>
                  </Row>
                )}

                {price && (
                  <Row className="mb-4">
                    <Column>
                      <Text className="m-0 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {dict.detailsPrice || 'Budżet'}
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
                        {dict.detailsCity || 'Lokalizacja'}
                      </Text>
                      <Text className="m-0 text-[15px] font-bold text-slate-200 mt-1">
                        {city}
                      </Text>
                    </Column>
                  </Row>
                )}

                {phone && (
                  <Row>
                    <Column>
                      <Text className="m-0 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {dict.detailsPhone || 'Telefon'}
                      </Text>
                      <Text className="m-0 text-[15px] font-bold text-slate-200 mt-1">
                        {phone}
                      </Text>
                    </Column>
                  </Row>
                )}
              </Section>

              {/* Next Steps Section */}
              <Section className="pt-2">
                <Text className="text-[17px] font-bold text-white m-0 mb-3">
                  {dict.nextStepsTitle || 'Co dalej?'}
                </Text>
                <Text className="text-[15px] text-slate-400 leading-relaxed m-0">
                  {dict.nextStepsText || 'Skontaktujemy się z Tobą w najszybszym możliwym czasie w celu omówienia szczegółów.'}
                </Text>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="px-8 py-8 border-t border-solid border-slate-800 bg-[#0a0f1d]">
              <Text className="text-[13px] leading-relaxed text-slate-500 m-0 mb-4 max-w-[400px]">
                {dict.footer || 'Tworzymy z pasją nowoczesne rozwiązania internetowe.'}
              </Text>
              <Row align="left">
                <Column className="w-full pt-4 align-top">
                  <Text className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider m-0">
                    © {new Date().getFullYear()} | webwawa.pl
                  </Text>
                  <Text className="text-[12px] text-slate-600 m-0 mt-1">
                    {dict.footerAddress || 'ul. Księżycowa 76/8, 01-934 Warszawa'}
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

export default ClientConfirmationEmail;
