import { note } from "@clack/prompts";
import { Command } from "commander";
import gradient from "gradient-string";
import { setTimeout } from "timers/promises";
import { initTurborepo, installTurboCommand } from "~/cli/turbo";
import { getUserPkgManager, PackageManager } from "~/utils/getPackageManager";
import { intro } from "~/utils/prompts/intro";
import { outro } from "~/utils/prompts/outro";
import { turboConfig } from "~/utils/prompts/turboPrompt";

export const turbo = new Command()
    .name('turbo')
    .description('initialize and scaffold new Turborepo')
    .option("-p, --path <path>", 'Path to new Turborepo')
    .action(async (option) => {
        const packageManager = getUserPkgManager();
        if (option.path === null) {await turboCLI(packageManager)}
        else {await initTurborepo(packageManager, option.path, true)}
    })

const turboCLI = async (packageManager:PackageManager) => {
    await intro()
    await installTurboCommand(packageManager, true);

    note(`Welcome to ${gradient.passion("Turbo")}. Let's get started.`, "Step 1.");
    await setTimeout(1000);

    const turboPath = await turboConfig();

    await initTurborepo(packageManager, turboPath, true);
    await outro()
}