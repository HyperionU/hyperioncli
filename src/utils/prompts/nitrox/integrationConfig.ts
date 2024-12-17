import { cancel, group, multiselect, select } from "@clack/prompts";

export const nitroxIntegrationConfig = async () => {
    const integrationConfig = await group({
        uiInt: () => multiselect({
            message: "Which UI integrations do you want to add?",
            options: [
                {value: "alpinejs", label: "Alpine"},
                {value: "preact", label: "Preact"},
                {value: "react", label: "React"},
                {value: "solid", label: "Solid"},
                {value: "svelte", label: "Svelte"},
                {value: "vue", label: "Vue"},
            ],
            required: false,
            initialValues: ["react"],
        }),
        ssrAdapter: () => select({
            message: "Would you like to add a SSR Adapter?",
            initialValue: "none",
            options: [
                {value: "cloudflare", label: "Cloudflare"},
                {value: "netlify", label: "Netlify"},
                {value: "node", label: "Node"},
                {value: "vercel", label: "Vercel"},
                {value: "none", label: "None"},
            ],
        }), 
        otherInt: () => multiselect({
            message: "Would you like to add any other integrations?",
            options: [
                {value: "db", label: "AstroDB"},
                {value: "markdoc", label: "MarkDoc"},
                {value: "mdx", label: "MDX"},
                {value: "partytown", label: "Partytown"},
                {value: "sitemap", label: "Sitemap"},
                {value: "tailwind", label: "Tailwind"},
            ],
            required: false,
            initialValues: ["tailwind"],
        }),
    },
    {
        onCancel: () => {
            cancel("Cancelled");
            process.exit(1)
        }
    });
    
    const integrations = [];
    integrations.push(integrationConfig.uiInt, integrationConfig.otherInt);
    integrationConfig.ssrAdapter !== "none" && integrations.push(integrationConfig.ssrAdapter);

    return integrations;
}