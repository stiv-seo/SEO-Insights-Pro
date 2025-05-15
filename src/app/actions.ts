"use server";

import { seoScore, type SeoScoreInput } from "@/ai/flows/seo-score";
import { suggestFixes, type SuggestFixesInput } from "@/ai/flows/suggest-fixes";
import type { SeoAnalysisResult, SeoAnalysisError } from "@/lib/types";

// Mock function to simulate web scraping.
// In a real application, this would fetch and parse the content of the URL.
function getMockScrapingData(url: string): string {
  // Basic HTML structure with common SEO elements and some deliberate errors.
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Página de Ejemplo Pobremente Optimizada</title>
  <meta name="description" content="Esta es una descripción muy corta y no optimizada.">
  <!-- Faltan palabras clave relevantes y una descripción más atractiva -->
</head>
<body>
  <header>
    <h1>Encabezado Principal Importante</h1>
    <!-- Podría haber un H1 más específico o mejor estructurado -->
  </header>
  
  <nav>
    <a href="/pagina1">Página 1</a>
    <a href="/pagina2">Página 2</a>
    <!-- Enlaces de navegación genéricos -->
  </nav>

  <main>
    <article>
      <h2>Un Subencabezado Interesante</h2>
      <p>Contenido de párrafo inicial. Este contenido debería ser más extenso y rico en palabras clave relevantes para el tema de '${url}'. El contenido actual es demasiado genérico.</p>
      
      <img src="https://placehold.co/600x400.png" data-ai-hint="technology abstract" />
      <!-- Error: Falta el atributo 'alt' en la imagen de arriba -->
      
      <img src="https://placehold.co/300x200.png" data-ai-hint="office business" alt="Una imagen descriptiva pero genérica" />
      <!-- Atributo 'alt' presente, pero podría ser más específico -->

      <p>Más contenido aquí. La densidad de palabras clave es baja y no hay suficiente información de valor para el usuario. Sería bueno incluir listas, más encabezados (H3, H4) y enlaces internos relevantes.</p>
      
      <h3>Otro Encabezado H3</h3>
      <p>Este es un párrafo bajo un H3. La estructura de encabezados parece algo plana.</p>
    </article>
  </main>

  <footer>
    <p>&copy; 2024 Tu Sitio Web. Contacto: info@example.com</p>
    <!-- El pie de página es básico, podría incluir enlaces a políticas o redes sociales -->
  </footer>

  <!-- Error: Falta el marcado Schema.org. Esto es crucial para que los motores de búsqueda entiendan el contenido. -->
  <!-- Ejemplo de lo que podría faltar:
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Página de Ejemplo Pobremente Optimizada",
    "description": "Esta es una descripción muy corta y no optimizada.",
    "url": "${url}"
  }
  </script>
  -->
</body>
</html>
  `.trim();
}

export async function analyzeSeoAction(
  prevState: any,
  formData: FormData
): Promise<SeoAnalysisResult | SeoAnalysisError> {
  const url = formData.get("url") as string;
  const technology = formData.get("technology") as string;

  if (!url || !technology) {
    return { error: "InputError", message: "URL y tecnología son requeridos." };
  }

  try {
    const scrapingData = getMockScrapingData(url);

    const seoScoreInput: SeoScoreInput = {
      url,
      scrapingData,
    };
    const seoScoreOutput = await seoScore(seoScoreInput);

    // The justification from seoScoreOutput often contains the list of errors.
    // We pass this as context to suggestFixes.
    const suggestFixesInput: SuggestFixesInput = {
      seoErrors: seoScoreOutput.justification,
      websiteTechnology: technology,
    };
    const suggestFixesOutput = await suggestFixes(suggestFixesInput);

    return {
      url,
      technology,
      seoScore: seoScoreOutput.seoScore,
      seoJustification: seoScoreOutput.justification,
      suggestedFixes: suggestFixesOutput.suggestedFixes,
      simulatedScrapedContent: scrapingData,
    };
  } catch (e: any) {
    console.error("Error en analyzeSeoAction:", e);
    return { error: "AIError", message: e.message || "Ocurrió un error al procesar la solicitud con la IA." };
  }
}
