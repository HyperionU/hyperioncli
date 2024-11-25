import { execa } from "execa";
import { PackageManager } from "~/utils/getPackageManager.js";
import * as prompt from "@clack/prompts"
import gradient from "gradient-string";
import { setTimeout } from "timers/promises";

export const nitroxCLI = async (packageManager:PackageManager) => {

    prompt.note(`Welcome to ${gradient.atlas("Nitrox")}. \nLet's get you up and running.`, "Step 2a.");
    await setTimeout(1000);

    const config = await prompt.group({
        route: () => prompt.text({
            message: "What is the path to your new site?",
            placeholder: "./www",
            validate: (value) => {
                if (!value) return 'Please enter a path.';
				if (value[0] !== '.') return 'Please enter a relative path.';
                return
            }
        }),
        typescript: () => prompt.select({
            message: "How strict should TypeScript be?",
            initialValue: "strict",
            options: [
                {value: "strict", label: "Strict"},
                {value: "strictest", label: "Strictest"},
                {value: "relaxed", label: "Relaxed", hint: "oh no"}
            ],
        }),
        runInstall: () => prompt.confirm({
            message: "Install dependencies?",
            initialValue: true
        }),
        initGit: () => prompt.confirm({
            message: "Initialize a Git Repository?",
            initialValue: false
        }),
        _: async () => {
            await setTimeout(1000)
            prompt.note("Now, let's add some integrations.", "Step 2b.")
            await setTimeout(1000)
        },
        uiInt: () => prompt.multiselect({
            message: "Any UI Integrations?",
            initialValues: ["react"],
            options: [
                {value: "alpinejs", label: "Alpine"},
                {value: "preact", label: "Preact"},
                {value: "react", label: "React"},
                {value: "solid", label: "Solid"},
                {value: "svelte", label: "Svelte"},
                {value: "vue", label: "Vue"},
                {value: "none"}
            ]
        }),
        ssrInt: () => prompt.select({
            message: "Add SSR Adapter?",
            initialValue: "none",
            options: [
                {value: "cloudflare", label: "Cloudflare"},
                {value: "netlify", label: "Netlify"},
                {value: "node", label: "Node"},
                {value: "vercel", label: "Vercel"},
                {value: "none", label: "No SSR"}
            ],
        }),
        otherInt: () => prompt.multiselect({
            message: "Any UI Integrations?",
            initialValues: ["tailwind"],
            options: [
                {value: "tailwind", label: "Tailwind"},
                {value: "db", label: "AstroDB"},
                {value: "markdoc", label: "MarkDoc"},
                {value: "mdx", label: "MDX"},
                {value: "partytown", label: "Partytown"},
                {value: "sitemap", label: "Sitemap"},
                {value: "none"}
            ]
        }),
    },
    {
        onCancel: () => {
            prompt.cancel("Cancelled");
            process.exit(1)
        }
    });


    switch (packageManager) {
        case "yarn":
            await execa({stdout: 'inherit', stderr: 'inherit'})`yarn create astro ${config.route} --template minimal --typescript ${config.typescript} ${config.runInstall ? "--install" : "--no-install"} ${config.runInstall ? "--git" : "--no-git"} --dry-run`
            break;
        default:
            await execa({stdout: 'inherit', stderr: 'inherit'})`${packageManager} create astro@latest ${config.route} --template minimal --typescript ${config.typescript} ${config.runInstall ? "--install" : "--no-install"} ${config.runInstall ? "--git" : "--no-git"} --dry-run`
            break;
    }

    /*await execa`cd ${config.route}`*/

}