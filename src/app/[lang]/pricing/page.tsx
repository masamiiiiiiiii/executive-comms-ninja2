import { PricingClient } from "./client-page";
import { getDictionary } from "@/dictionaries";

export default async function PricingPage({ params }: { params: Promise<{ lang: 'en' | 'ja' }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <PricingClient lang={lang} dict={dict} />;
}
