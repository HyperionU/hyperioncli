import { execa } from "execa";
import { PackageManager } from "~/utils/getPackageManager.js";
import * as prompt from "@clack/prompts"
import gradient from "gradient-string";
import { setTimeout } from "timers/promises";
import { isEmpty } from "~/utils/checkDir.js";
import { cliFlags } from "~/installers/index.js";

export const nitroxCLI = async (packageManager: PackageManager, flags: cliFlags) => {

    prompt.note(`Welcome to ${gradient.atlas("Nitrox")}. \nLet's get you up and running.`, `${flags.turbo ? "Step 3a." : "Step 2a."}`);
    await setTimeout(1000);

    const config = await nitroxStandardConfig()

    prompt.note("Now, let's add some integrations.", `${flags.turbo ? "Step 3b." : "Step 2b."}`)
    await setTimeout(1000)

    const integrations = await nitroxIntegrationConfig()

    switch (packageManager) {
        case "npm":
            await execa({stdout: 'inherit', stderr: 'inherit'})`${packageManager} create astro ${config.route} -- --template minimal --typescript ${config.typescript} ${config.runInstall ? "--install" : "--no-install"} ${config.initGit ? "--git" : "--no-git"} --add ${integrations.join(' ')}`
            break;
    
        default:
            await execa({stdout: 'inherit', stderr: 'inherit'})`${packageManager} create astro ${config.route} --template minimal --typescript ${config.typescript} ${config.runInstall ? "--install" : "--no-install"} ${config.initGit ? "--git" : "--no-git"} --add ${integrations.join(' ')}`
            break;
    }

}

const nitroxStandardConfig = async () => {
    const config = await prompt.group({
        route: () => prompt.text({
            message: "What is the path to your new site?",
            placeholder: "./www",
            validate: (value) => {
                if (!value) return 'Please enter a path.';
				if (value[0] !== '.') return 'Please enter a relative path.';
                if (!isEmpty(value)) return 'Please enter an empty path.';
                return;
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
    },
    {
        onCancel: () => {
            prompt.cancel("Cancelled");
            process.exit(1)
        }
    });
    return config
}

const nitroxIntegrationConfig = async () => {
    const integrationConfig = await prompt.group({
        uiInt: () => prompt.multiselect({
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
        ssrAdapter: () => prompt.select({
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
        otherInt: () => prompt.multiselect({
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
            prompt.cancel("Cancelled");
            process.exit(1)
        }
    });
    
    const integrations = [];
    integrations.push(integrationConfig.uiInt, integrationConfig.otherInt);
    integrationConfig.ssrAdapter !== "none" && integrations.push(integrationConfig.ssrAdapter);

    return integrations;
}