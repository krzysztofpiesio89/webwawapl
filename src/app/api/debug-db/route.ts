import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const shouldSeed = searchParams.get('seed') === 'true';

  try {
    if (shouldSeed) {
      console.log('API Seeding: Starting...');

      // Disable foreign keys temporarily in SQLite/LibSQL to clear everything cleanly
      console.log('API Seeding: Disabling foreign keys...');
      try {
        await prisma.$executeRawUnsafe('PRAGMA foreign_keys = OFF;');
      } catch (err: any) {
        console.warn('Could not disable foreign keys:', err.message);
      }

      console.log('API Seeding: Deleting Series...');
      try {
        await prisma.series.deleteMany();
      } catch (err: any) {
        console.error('Failed to delete Series:', err.message);
        throw new Error(`Delete Series failed: ${err.message}`);
      }

      console.log('API Seeding: Deleting Models...');
      try {
        await prisma.model.deleteMany();
      } catch (err: any) {
        console.error('Failed to delete Models:', err.message);
        throw new Error(`Delete Models failed: ${err.message}`);
      }

      console.log('API Seeding: Deleting Brands...');
      try {
        await prisma.brand.deleteMany();
      } catch (err: any) {
        console.error('Failed to delete Brands:', err.message);
        throw new Error(`Delete Brands failed: ${err.message}`);
      }

      console.log('API Seeding: Re-enabling foreign keys...');
      try {
        await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON;');
      } catch (err: any) {
        console.warn('Could not re-enable foreign keys:', err.message);
      }

      console.log('API Seeding: Reading brands directory...');
      const brandsDir = path.join(process.cwd(), 'data', 'brands');
      if (!fs.existsSync(brandsDir)) {
        throw new Error(`Brands directory not found at: ${brandsDir}`);
      }

      const brandFiles = fs.readdirSync(brandsDir).filter(f => f.endsWith('.json'));
      console.log(`API Seeding: Found ${brandFiles.length} brand files.`);

      let brandCount = 0;
      let modelCount = 0;
      let seriesCount = 0;

      for (const file of brandFiles) {
        const filePath = path.join(brandsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const brandData = JSON.parse(fileContent);
        
        const brandName = brandData.brand;
        if (!brandName || brandName === '-') continue;

        let brand;
        try {
          brand = await prisma.brand.create({
            data: { name: String(brandName) }
          });
          brandCount++;
        } catch (err: any) {
          console.error(`Failed to create Brand [${brandName}]:`, err.message);
          throw new Error(`Create Brand [${brandName}] failed: ${err.message}`);
        }

        if (brandData.models && typeof brandData.models === 'object') {
          for (const [modelName, seriesList] of Object.entries(brandData.models)) {
            if (!modelName) continue;

            let model;
            try {
              model = await prisma.model.create({
                data: {
                  name: String(modelName),
                  brandId: brand.id
                }
              });
              modelCount++;
            } catch (err: any) {
              console.error(`Failed to create Model [${modelName}] for Brand [${brandName}]:`, err.message);
              throw new Error(`Create Model [${modelName}] failed: ${err.message}`);
            }

            if (Array.isArray(seriesList)) {
              for (const seriesData of seriesList) {
                const rawName = seriesData["Serie Name"] || seriesData.name || modelName;
                const rawYears = seriesData["Years"] || seriesData.years || "2000-2026";
                
                const seriesName = String(rawName);
                const seriesYears = String(rawYears);

                try {
                  await prisma.series.create({
                    data: {
                      name: seriesName,
                      years: seriesYears,
                      modelId: model.id
                    }
                  });
                  seriesCount++;
                } catch (err: any) {
                  console.error(`Failed to create Series [${seriesName}] for Model [${modelName}]:`, err.message);
                  throw new Error(`Create Series [${seriesName}] failed: ${err.message}`);
                }
              }
            }
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Successfully seeded database via API!',
        seeded: {
          brands: brandCount,
          models: modelCount,
          series: seriesCount
        }
      });
    }

    // Default: return current database counts
    const brandsCount = await prisma.brand.count();
    const modelsCount = await prisma.model.count();
    const seriesCount = await prisma.series.count();
    const citiesCount = await prisma.city.count();
    const settings = await prisma.globalSettings.findFirst();

    return NextResponse.json({
      success: true,
      counts: {
        brands: brandsCount,
        models: modelsCount,
        series: seriesCount,
        cities: citiesCount,
      },
      settings,
    });
  } catch (error: any) {
    console.error('API Seeding Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
