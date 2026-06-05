import { getBrandBySlug, getModelBySlug, slugify } from '../src/lib/brands';
import { getCityBySlug } from '../src/lib/cities';

function runDiagnostics() {
  console.log("=== STARTING DIAGNOSTICS ===");
  
  const city = getCityBySlug("warszawa");
  console.log("City 'warszawa' found:", city ? city.name : null);
  
  const brand = getBrandBySlug("audi");
  console.log("Brand 'audi' found:", brand ? brand.name : null);
  
  if (brand) {
    const model = getModelBySlug(brand, "a4");
    console.log("Model 'a4' found:", model ? model.name : null);
    
    if (model) {
      console.log("Available series list:");
      model.series.forEach((s: any) => {
        console.log(` - Name: "${s.name}" (Slug: "${slugify(s.name)}")`);
      });
      
      const targetSlug = "b8";
      const series = model.series.find((s: any) => {
        const sSlug = slugify(s.name);
        const tSlug = slugify(targetSlug);
        const modelSlug = slugify(model.name);
        return (
          sSlug === tSlug ||
          s.name.toLowerCase() === targetSlug.toLowerCase() ||
          sSlug.replace(modelSlug + '-', '') === tSlug
        );
      });
      console.log(`Matching target slug "${targetSlug}":`, series ? series.name : "NOT FOUND");
    }
  }
  
  console.log("=== DIAGNOSTICS COMPLETED ===");
}

runDiagnostics();
