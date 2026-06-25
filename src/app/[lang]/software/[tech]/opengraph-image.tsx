import { ImageResponse } from 'next/og';
import { getTechnologyById } from '@/lib/technology';
import { Locale } from '@/app/[lang]/dictionaries';

// Image metadata
export const alt = 'webwawa.pl - Software Development';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image(props: { params: Promise<{ lang: string; tech: string }> }) {
  const params = await props.params;
  const { lang, tech } = params;

  // Get tech data
  const techDataObj = getTechnologyById(tech);
  const techName = techDataObj?.name || tech;
  
  const techTranslation = techDataObj?.translations[lang as Locale] 
    || techDataObj?.translations['en'] 
    || techDataObj?.translations['pl'];
  
  const title = techTranslation?.title || `${techName} Development`;
  const subtitle = lang === 'pl' ? 'Dedykowane Oprogramowanie' : 'Custom Software';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#020510',
          backgroundImage: 'linear-gradient(to bottom right, #020510, #0a1033)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(79, 70, 229, 0.15) 0%, transparent 50%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: '#818cf8',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 40,
              padding: '10px 24px',
              border: '2px solid rgba(129, 140, 248, 0.3)',
              borderRadius: '9999px',
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
            }}
          >
            {subtitle}
          </div>
          
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.2,
              marginBottom: 24,
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: '#94a3b8',
              marginTop: 40,
            }}
          >
            webwawa.pl
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
