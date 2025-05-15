"use client";

import type { SeoAnalysisResult } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, FileText, Wrench, FileCode, AlertCircle, Gauge } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SeoResultsDisplayProps {
  analysisResult: SeoAnalysisResult | null;
  isLoading: boolean;
}

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-40 w-full" />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-40 w-full" />
      </CardContent>
    </Card>
     <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-60 w-full" />
      </CardContent>
    </Card>
  </div>
);


export default function SeoResultsDisplay({ analysisResult, isLoading }: SeoResultsDisplayProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!analysisResult) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="mt-8 space-y-6 animate-in fade-in-50 duration-500">
      <Alert variant="default" className="bg-primary/10 border-primary/30">
        <AlertCircle className="h-5 w-5 text-primary" />
        <AlertTitle className="font-semibold text-primary">Nota Importante</AlertTitle>
        <AlertDescription className="text-foreground/80">
          El análisis de contenido y las sugerencias se basan en datos simulados de web scraping. Para un análisis completo y preciso, se requeriría una herramienta de scraping real. Los resultados actuales son ilustrativos.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center space-x-3">
            <Gauge className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-bold text-primary">Puntuación SEO General</CardTitle>
              <CardDescription>Estimación de la optimización SEO de <Badge variant="secondary" className="font-mono">{analysisResult.url}</Badge></CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="text-center">
            <p className="text-6xl font-bold text-primary">{analysisResult.seoScore} <span className="text-2xl text-muted-foreground">/ 100</span></p>
          </div>
          <Progress value={analysisResult.seoScore} className={`h-3 [&>div]:${getScoreColor(analysisResult.seoScore)}`} />
           <p className="text-sm text-muted-foreground text-center">
            Esta puntuación refleja la calidad general del SEO on-page basada en el contenido analizado.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FileText className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl font-semibold">Análisis Detallado y Justificación</CardTitle>
          </div>
          <CardDescription>Explicación de la puntuación SEO, destacando fortalezas y debilidades identificadas.</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert text-foreground/90">
          <div dangerouslySetInnerHTML={{ __html: analysisResult.seoJustification.replace(/\n/g, '<br />') }} />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Wrench className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl font-semibold">Sugerencias de Solución</CardTitle>
          </div>
          <CardDescription>Recomendaciones para corregir los errores SEO, adaptadas a la tecnología: <Badge variant="outline">{analysisResult.technology}</Badge>.</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert text-foreground/90">
           <div dangerouslySetInnerHTML={{ __html: analysisResult.suggestedFixes.replace(/\n/g, '<br />') }} />
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FileCode className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl font-semibold">Contenido Simulado Analizado</CardTitle>
          </div>
          <CardDescription>Este es el contenido HTML simulado que se utilizó para el análisis.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted/50 p-4 rounded-md text-xs overflow-x-auto max-h-96 text-foreground/80">
            <code>{analysisResult.simulatedScrapedContent}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
