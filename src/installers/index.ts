import { z } from "zod";
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

export type Flake = z.infer<typeof flakeSchema>
type Services = z.infer<typeof servicesSchema>
type Options = z.infer<typeof optionsSchema>

const nitroxConfigSchema = z.object({
    path: z.string(),
    typescript: z
        .union([z.literal("strict"), z.literal("strictest"), z.literal("relaxed")]),
    runInstall: z.boolean(),
    initGit: z.boolean(),
    integrations: z.array(z.string()).optional()
})

const packageManagerSchema = z.union([
    z.literal("npm"),
    z.literal("pnpm"),
    z.literal("yarn"),
    z.literal("bun"),
    z.literal("deno")
])

const servicesSchema = z.object({
    packageSet: z.boolean().optional(),
    turbo: z.boolean().optional(),
    nitrox: z.boolean().optional(),
    shadcn: z.boolean().optional()
})

const optionsSchema = z.object({
    packageSet: z.object({
        value: z.union([
            z.literal("std"),
            z.literal("slim"),
            z.literal("sslim"),
            z.literal("custom")
        ]),
        packages: z.array(z.string()).optional()
    }).optional(),
    turboPath: z.string().optional(),
    nitrox: nitroxConfigSchema.optional()
}).optional()

export const flakeSchema = z.object({
    "$schema": z.string(),
    description: z.string(),
    packageManager: packageManagerSchema,
    services: servicesSchema,
    options: optionsSchema,
    turboOverrides: z
        .object({
            apps: z.array(z.string()).optional(),
            web: z.object({
                nitrox: z.boolean()
            }).optional(),
            docs: z.object({
                starlight: z.boolean()
            }).optional()
        })
        .optional()
})

export class FlakeConfig {
    description: string;
    packageManager: PackageManager
    services: Services
    options: Options

    constructor(flake: Flake){
        this.description = flake.description
        this.packageManager = flake.packageManager
        this.services = flake.services
        this.options = flake.options
    }
}