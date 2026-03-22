import { getDictionary } from "@/dictionaries";
import { LoginClient } from "./client";

export default async function LoginPage({
    params,
}: {
    params: Promise<{ lang: "en" | "ja" }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <LoginClient lang={lang} dict={dict} />;
}
