import { note } from "@clack/prompts";
import { execa } from "execa";
import gradient from "gradient-string";
import { setTimeout } from "timers/promises";
import { PackageManager } from "~/utils/getPackageManager.js";
import { turboConfig } from "~/utils/prompts/turboPrompt";

export const turboPrompt = async (packageManager:PackageManager) => {
    await installTurboCommand(packageManager, true);

    note(`Welcome to ${gradient.passion("Turbo")}. Let's get started.`, "Step 2.");
    await setTimeout(1000);

    const turboPath = await turboConfig();

    await initTurborepo(packageManager, turboPath, true);
}

export async function installTurboCommand(packageManager: PackageManager, outFlag: boolean) {
    switch (packageManager) {
        case "yarn":
            await execa({ stdout: `${outFlag ? 'inherit' : 'ignore'}`, stderr: `${outFlag ? 'inherit' : 'ignore'}` })`yarn global add turbo`;
            break;
        default:
            await execa({ stdout: `${outFlag ? 'inherit' : 'ignore'}`, stderr: `${outFlag ? 'inherit' : 'ignore'}` })`${packageManager} install turbo --global`;
            break;
    }
}

export async function initTurborepo(packageManager: PackageManager, turboPath: string, outFlag: boolean) {
    switch (packageManager) {
        case "npm":
            await execa({ stdout: `${outFlag ? 'inherit' : 'ignore'}`, stderr: `${outFlag ? 'inherit' : 'ignore'}` })`npx create-turbo ${turboPath} -m ${packageManager}`;
            break;

        default:
            await execa({ stdout: `${outFlag ? 'inherit' : 'ignore'}`, stderr: `${outFlag ? 'inherit' : 'ignore'}` })`${packageManager} dlx create-turbo ${turboPath} -m ${packageManager}`;
            break;
    }
}
