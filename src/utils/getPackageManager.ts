import { detect } from "@antfu/ni";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun" | "deno";

export const getUserPkgManager: () => Promise<PackageManager> = async () => {
    
    const packageManager = await detect({programmatic: true});

    switch (packageManager) {
        case "yarn@berry":
            return "yarn"
        case "pnpm@6":
            return "pnpm"
        case "bun":
            return "bun"      
        default:
            return packageManager ?? "npm"
    }

};