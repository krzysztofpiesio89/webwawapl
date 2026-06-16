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
        <Body className="bg-slate-50 font-sans">
          <Preview>{dict.subject}</Preview>
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
              <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
              
              <Row className="p-8">
                <Column>
                  <Heading className="text-[20px] font-black text-slate-900 m-0 mb-6 uppercase tracking-tight">
                    {dict.subject}
                  </Heading>
                  
                  <Text className="text-base text-slate-800 mb-4 font-bold">
                    {dict.greeting}
                  </Text>
                  
                  <Text className="text-sm text-slate-600 leading-relaxed mb-6">
                    {dict.intro}
                  </Text>
                  
                  {/* Styled Summary Box */}
                  <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-100">
                    <Row className="mb-4">
                      <Column>
                        <Text className="m-0 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {dict.detailsBrand || 'Klient / Firma'}
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
                            {dict.detailsEngine || 'Rodzaj usługi'}
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
                            {dict.detailsYear || 'Czas realizacji'}
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
                            {dict.detailsPrice || 'Budżet'}
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
                            {dict.detailsCity || 'Lokalizacja'}
                          </Text>
                          <Text className="m-0 text-sm font-semibold text-slate-800 mt-0.5">
                            {city}
                          </Text>
                        </Column>
                      </Row>
                    )}

                    {phone && (
                      <Row>
                        <Column>
                          <Text className="m-0 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {dict.detailsPhone || 'Telefon'}
                          </Text>
                          <Text className="m-0 text-sm font-semibold text-slate-800 mt-0.5">
                            {phone}
                          </Text>
                        </Column>
                      </Row>
                    )}
                  </div>

                  {/* Next Steps Section */}
                  <div className="mt-8 border-t border-solid border-slate-100 pt-6">
                    <Heading as="h3" className="text-sm font-bold text-slate-900 m-0 mb-2 uppercase tracking-wide">
                      {dict.nextStepsTitle}
                    </Heading>
                    <Text className="text-sm text-slate-600 leading-relaxed m-0">
                      {dict.nextStepsText}
                    </Text>
                  </div>
                </Column>
              </Row>
            </Section>

            {/* Footer */}
            <Section className="text-center mt-8 px-6">
              <Text className="text-xs leading-relaxed text-slate-400 m-0 font-medium">
                {dict.footer}
              </Text>
              <Text className="text-[10px] leading-relaxed text-slate-400 m-0 mt-1 uppercase tracking-wider">
                © {new Date().getFullYear()} | {dict.footerAddress}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ClientConfirmationEmail;
