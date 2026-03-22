import { getDictionary } from "@/dictionaries";
import AnalysisClientPage from "../analysis/[id]/client-page";
import { DEMO_DATA_EN, DEMO_DATA_JA } from "@/lib/demo-data";

export const dynamic = "force-static";
export const revalidate = false;

export default async function DemoPage({
    params,
}: {
    params: Promise<{ lang: "en" | "ja" }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const demoData = lang === "ja" ? DEMO_DATA_JA : DEMO_DATA_EN;

    return (
        <AnalysisClientPage
            id="demo"
            currentLang={lang}
            dict={dict}
            initialData={demoData}
        />
    );
}
