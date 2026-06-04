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

interface ClientConfirmationEmailProps {
  dict: any;
  brandModel: string;
  year: string;
  engine: string;
  price: string;
  city: string;
  phone: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://skupautwawa.pl';

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
          <Container>
            <Section className="px-5 py-[30px] text-center bg-white">
              <Heading className="m-0 text-3xl font-black tracking-tighter uppercase italic text-slate-900">
                skupaut<span className="text-amber-500">wawa.pl</span>
              </Heading>
            </Section>

            <Section className="border border-solid border-slate-200 bg-white rounded-3xl overflow-hidden shadow-lg">
              <Row className="bg-amber-400 p-5">
                <Column>
                  <Heading className="text-[22px] font-black text-slate-900 text-center uppercase italic m-0">
                    {dict.subject}
                  </Heading>
                </Column>
              </Row>

              <Row className="p-8">
                <Column>
                  <Text className="text-base text-slate-800 mb-6 font-bold">
                    {dict.greeting}
                  </Text>
                  <Text className="text-base text-slate-700 mb-6">
                    {dict.intro}
                  </Text>
                  
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <Text className="text-base m-0 mb-2">
                      <b className="text-slate-500 uppercase text-xs tracking-wider">{dict.detailsBrand}: </b><br/>
                      <span className="text-lg font-bold text-slate-900">{brandModel}</span>
                    </Text>
                    
                    <Text className="text-base m-0 mb-2">
                      <b className="text-slate-500 uppercase text-xs tracking-wider">{dict.detailsYear}: </b><br/>
                      <span className="font-semibold text-slate-700">{year || '-'}</span>
                    </Text>

                    <Text className="text-base m-0 mb-2">
                      <b className="text-slate-500 uppercase text-xs tracking-wider">{dict.detailsPrice}: </b><br/>
                      <span className="text-lg font-bold text-amber-600">{price || '-'}</span>
                    </Text>
                    
                    <Text className="text-base m-0 mb-2">
                      <b className="text-slate-500 uppercase text-xs tracking-wider">{dict.detailsCity}: </b><br/>
                      <span className="font-semibold text-slate-700">{city || '-'}</span>
                    </Text>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <Heading as="h3" className="text-lg font-bold text-slate-900 m-0 mb-2 uppercase">{dict.nextStepsTitle}</Heading>
                    <Text className="text-base m-0 mb-4 text-slate-700 leading-relaxed">
                      {dict.nextStepsText}
                    </Text>
                  </div>
                  
                </Column>
              </Row>
            </Section>

            <Text className="text-center text-xs leading-[24px] text-slate-400 mt-8 font-semibold">
              {dict.footer} <br/>
              © {new Date().getFullYear()} | {dict.footerAddress}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ClientConfirmationEmail;
