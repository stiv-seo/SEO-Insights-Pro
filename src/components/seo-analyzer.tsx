"use client";

import * as _React from "react";
import { useState, useTransition, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { analyzeSeoAction } from "@/app/actions";
import type { SeoAnalysisResult, SeoAnalysisError } from "@/lib/types";
import SeoResultsDisplay from "./seo-results-display";
import { Link as LinkIcon, Cpu, PlayCircle, Loader2 } from "lucide-react";

const formSchema = z.object({
  url: z.string().url({ message: "Por favor, ingresa una URL válida." }),
  technology: z.string().min(1, { message: "Por favor, selecciona una tecnología." }),
});

type FormValues = z.infer<typeof formSchema>;

const initialState: SeoAnalysisResult | SeoAnalysisError | null = null;

const technologyOptions = [
  { value: "WordPress", label: "WordPress" },
  { value: "Shopify", label: "Shopify" },
  { value: "React (Next.js, etc.)", label: "React (Next.js, etc.)" },
  { value: "Angular", label: "Angular" },
  { value: "Vue.js", label: "Vue.js" },
  { value: "HTML Estático", label: "HTML Estático" },
  { value: "PHP (Laravel, Symfony, etc.)", label: "PHP (Laravel, Symfony, etc.)" },
  { value: "Python (Django, Flask)", label: "Python (Django, Flask)" },
  { value: "Ruby on Rails", label: "Ruby on Rails" },
  { value: "Java (Spring)", label: "Java (Spring)" },
  { value: "Node.js (Express, etc.)", label: "Node.js (Express, etc.)" },
  { value: "Otro", label: "Otro" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analizando...
        </>
      ) : (
        <>
          <PlayCircle className="mr-2 h-5 w-5" />
          Analizar SEO
        </>
      )}
    </Button>
  );
}

export default function SeoAnalyzer() {
  const [state, formAction] = useActionState(analyzeSeoAction, initialState);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      technology: "",
    },
  });
  
  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("url", data.url);
      formData.append("technology", data.technology);
      formAction(formData);
    });
  };

  // Effect to handle toast messages based on server action state
   _React.useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({
        variant: "destructive",
        title: "Error en el Análisis",
        description: state.message,
      });
    } else if (state && !('error' in state)) {
       toast({
        title: "Análisis Completado",
        description: "Los resultados del análisis SEO están listos.",
      });
    }
  }, [state, toast]);


  const analysisResult = state && !('error' in state) ? state : null;

  return (
    <div className="space-y-8">
      <Card className="shadow-xl border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-primary">
            Potencia tu SEO con Inteligencia Artificial
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Ingresa la URL de tu sitio web y la tecnología que utiliza para obtener un análisis SEO detallado,
            una puntuación y sugerencias personalizadas para mejorar tu posicionamiento.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            <CardContent className="space-y-6 pt-6">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">URL del Sitio Web</FormLabel>
                    <div className="flex items-center space-x-2">
                      <LinkIcon className="h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="https://www.ejemplo.com" {...field} className="text-base"/>
                      </FormControl>
                    </div>
                    <FormDescription>
                      Ingresa la URL completa de la página que deseas analizar.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="technology"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Tecnología del Sitio Web</FormLabel>
                    <div className="flex items-center space-x-2">
                       <Cpu className="h-5 w-5 text-muted-foreground" />
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-base">
                            <SelectValue placeholder="Selecciona la tecnología o CMS" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {technologyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormDescription>
                      Indica la tecnología principal (CMS, framework, etc.) de tu sitio.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/20">
              <SubmitButton />
            </CardFooter>
          </form>
        </Form>
      </Card>

      <SeoResultsDisplay analysisResult={analysisResult} isLoading={isPending} />
      
    </div>
  );
}
