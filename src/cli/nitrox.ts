import { execa } from "execa";
import { PackageManager } from "~/utils/getPackageManager.js";
import * as prompt from "@clack/prompts"
import gradient from "gradient-string";
import { setTimeout } from "timers/promises";
import { cliFlags } from "~/installers/index.js";
import { nitroxStandardConfig } from "~/utils/prompts/nitrox/stdConfig";
import { nitroxIntegrationConfig } from "~/utils/prompts/nitrox/integrationConfig";

export const nitroxPrompt = async (packageManager: PackageManager, flags: cliFlags) => {

    prompt.note(`Welcome to ${gradient.atlas("Nitrox")}. \nLet's get you up and running.`, `${flags.turbo ? "Step 3a." : "Step 2a."}`);
    await setTimeout(1000);

    const config = await nitroxStandardConfig()

    prompt.note("Now, let's add some integrations.", `${flags.turbo ? "Step 3b." : "Step 2b."}`)
    await setTimeout(1000)

    const integrations = await nitroxIntegrationConfig()

    await runNitroxInit(packageManager, config, integrations, true);
}

export async function runNitroxInit(packageManager: string, config: { route: string; typescript: string; runInstall: boolean; initGit: boolean; }, integrations: (string | string[])[], outFlag: boolean) {
    switch (packageManager) {
        case "npm":
            await execa({ stdout: `${outFlag ? 'inherit' : 'ignore'}`, stderr: `${outFlag ? 'inherit' : 'ignore'}` })`${packageManager} create astro ${config.route} -- --template minimal --typescript ${config.typescript} ${config.runInstall ? "--install" : "--no-install"} ${config.initGit ? "--git" : "--no-git"} --add ${integrations.join(' ')}`;
            break;

        default:
            await execa({ stdout: `${outFlag ? 'inherit' : 'ignore'}`, stderr: `${outFlag ? 'inherit' : 'ignore'}` })`${packageManager} create astro ${config.route} --template minimal --typescript ${config.typescript} ${config.runInstall ? "--install" : "--no-install"} ${config.initGit ? "--git" : "--no-git"} --add ${integrations.join(' ')}`;
            break;
    }
}
