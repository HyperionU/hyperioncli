import { note } from "@clack/prompts";
import { execa } from "execa";
import gradient from "gradient-string";
import { setTimeout } from "timers/promises";
import { PackageManager } from "~/utils/getPackageManager.js";
import { turboConfig } from "~/utils/prompts/turboPrompt";

export const turboPrompt = async (packageManager:PackageManager) => {
    await installTurboCommand(packageManager);

    note(`Welcome to ${gradient.passion("Turbo")}. Let's get started.`, "Step 2.");
    await setTimeout(1000);

    const turboPath = await turboConfig();

    await initTurborepo(packageManager, turboPath);
}

export async function installTurboCommand(packageManager: PackageManager) {
    switch (packageManager) {
        case "yarn":
            await execa({ stdout: 'inherit', stderr: 'inherit' })`yarn global add turbo`;
            break;
        default:
            await execa({ stdout: 'inherit', stderr: 'inherit' })`${packageManager} install turbo --global`;
            break;
    }
}

export async function initTurborepo(packageManager: PackageManager, turboPath: string) {
    switch (packageManager) {
        case "npm":
            await execa({ stdout: 'inherit', stderr: 'inherit' })`npx create-turbo ${turboPath} -m ${packageManager}`;
            break;

        default:
            await execa({ stdout: 'inherit', stderr: 'inherit' })`${packageManager} dlx create-turbo ${turboPath} -m ${packageManager}`;
            break;
    }
}
