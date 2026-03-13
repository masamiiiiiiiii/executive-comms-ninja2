import { getDictionary } from "@/dictionaries";
import AnalysisClientPage from "./client-page";

export default async function AnalysisPage({
    params,
}: {
    params: Promise<{ id: string; lang: "en" | "ja" }>;
}) {
    const { id, lang } = await params;
    const dict = await getDictionary(lang);
    
    // Force Next.js server component to recompile and bust dictionary cache
    console.log(`Loading AnalysisPage for id: ${id}, lang: ${lang}`);

    return <AnalysisClientPage id={id} currentLang={lang} dict={dict} />;
}
