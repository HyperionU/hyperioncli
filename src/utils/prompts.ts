import * as prompt from "@clack/prompts";
import { setTimeout } from "timers/promises";
import type { cliFlags, Packages } from "~/installers/index.js"
import { PackageManager } from "./getPackageManager.js";
import { cancelPrompt } from "./prompts/cancel.js";
import { exit } from "process";

export const configPrompt = async (packageManager: PackageManager, flags: cliFlags) => {
    
    await setTimeout(1000)

    const checkPM = await prompt.confirm({
        message: `Are you running ${packageManager}?`
    }) as boolean;
    
    if (!checkPM) exit(1);

    cancelPrompt(checkPM)

    prompt.log.message("Got it! Noted.");

    await setTimeout(1000)

    const config = flags

    if (!flags.nitrox) {
        const runNitrox = await prompt.confirm({
            message: "Do you want to start the new Nitrox DevKit?",
        }) as boolean;
        cancelPrompt(runNitrox)
        config.nitrox = runNitrox;
    }
    if (!flags.turbo) {
        const runTurbo = await prompt.confirm({
            message: "Do you want to start Turbo?",
        }) as boolean;
        cancelPrompt(runTurbo)
        config.turbo = runTurbo;
    }

    return config;
}

export const themePrompt = async (): Promise<Packages> => {
    const theme = await prompt.select({
        message: "What theme do you want to install?",
        options: [
            {value: "night", label: "Tokyo Night"},
            {value: "nightDark", label: "Tokyo Night Dark"}
        ]
    }) as Packages;
    return theme;
}

export const packagePrompt = async () => {
    const packages = await prompt.select({
        message: "Which set would you like to install?",
        options: [
            {value: "std", label: "Standard"},
            {value: "slim", label: "Slim"},
            {value: "sslim", label: "SuperSlim"},
            {value: "custom", label: "Custom"},
            {value: "skip", label: "Skip"},
        ],
        initialValue: "std"
    }) as string;


    return packages
}

export const install = async (packageSet: string): Promise<Packages[]> => {
    const pack: Packages[] = []

    switch (packageSet) {
        case "std":
            const stdPackages: Packages[] = [
                "ghActions", 
                "ghMarkdown", 
                "gitLens", 
                "htmlHint", 
                "marp", 
                "mdLint", 
                "prettier", 
                "vsIcons"
            ]
            stdPackages.forEach(element => {
                pack.push(element);
            });
            pack.push(await themePrompt())
            break;
        case "slim":
            const slimPackages: Packages[] = [
                "ghActions", 
                "htmlHint", 
                "marp", 
                "vsIcons"
            ];
            slimPackages.forEach(element => {
                pack.push(element);
            });
            pack.push(await themePrompt())
            break;
        case "sslim":
            const sslimPackages: Packages[] = [
                "ghActions",  
                "marp", 
                "vsIcons"
            ];
            sslimPackages.forEach(element => {
                pack.push(element);
            });
            pack.push(await themePrompt())
            break;
        case "custom":
            const customPack = await prompt.multiselect({
                message: "Which packages would you like to install?",
                options: [
                    {value: "vsIcons", label: "VSCode Icons"},
                    {value: "night", label: "Tokyo Night"},
                    {value: "nightDark", label: "Tokyo Night Dark"},
                    {value: "mdLint", label: "MarkdownLint"},
                    {value: "gitLens", label: "GitLens"},
                    {value: "prettier", label: "Prettier"},
                    {value: "ghMarkdown", label: "GitHub Markdown"},
                    {value: "htmlHint", label: "HTMLHint"},
                    {value: "marp", label: "Marp for VS Code"},
                    {value: "ghActions", label: "GitHub Actions"},
                ]
            }) as Packages[];
            customPack.forEach(element => {
                pack.push(element);
            });
            break;
        default:
            break;
    }

    return pack;
}