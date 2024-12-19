import { PackageManager } from "~/utils/getPackageManager";

export const packages = {
    /* Theme */
    "vsIcons": "vscode-icons-team.vscode-icons",
    "night": "enkia.tokyo-night",
    "nightDark": "drewxs.tokyo-night-dark",
    /* Core */
    "mdLint": "davidanson.vscode-markdownlint",
    "gitLens": "eamodio.gitlens",
    "prettier": "esbenp.prettier-vscode",
    "ghMarkdown": "bierner.github-markdown-preview",
    "htmlHint": "htmlhint.vscode-htmlhint",
    "marp": "marp-team.marp-vscode",
    "ghActions": "github.vscode-github-actions",
    /* Nitrox */
    "Astro": "astro-build.astro-vscode",
    "Tailwind": "bradlc.vscode-tailwindcss"
} as const satisfies Record<string, string>;

export type Packages = keyof typeof packages;

export type PackageID = (typeof packages)[Packages];

export interface cliFlags {
    default: boolean,
    nitrox: boolean,
    turbo: boolean,
}

export interface cliResults {
    flags: cliFlags,
    packages: Packages[],
}

export interface Flake{
    description: string
    packageManager: PackageManager
    packageSet: {
        value: "std" | "slim" | "sslim" | "custom" 
        packages?: Packages[] 
    }        
    turbo: {
        enable: boolean
        path?: string
    }
    nitrox: {
        enable: boolean
        path?: string
        typescript?: "strict" | "strictest" |"relaxed"
        runInstall?: boolean
        initGit?: boolean
        integrations?: string[]
           
    }
}