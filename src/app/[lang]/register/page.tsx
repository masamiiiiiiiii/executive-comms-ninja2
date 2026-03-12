import { RegisterClient } from "./client-page";
import { getDictionary } from "@/dictionaries";

export default async function RegisterPage({ params }: { params: Promise<{ lang: 'en' | 'ja' }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <RegisterClient lang={lang} dict={dict} />;
}
