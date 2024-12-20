import { note } from "@clack/prompts";
import { Command } from "commander";
import gradient from "gradient-string";
import { setTimeout } from "timers/promises";
import { runNitroxInit } from "~/cli/nitrox";
import { getUserPkgManager, PackageManager } from "~/utils/getPackageManager";
import { intro } from "~/utils/prompts/intro";
import { nitroxIntegrationConfig } from "~/utils/prompts/nitrox/integrationConfig";
import { nitroxStandardConfig } from "~/utils/prompts/nitrox/stdConfig";
import { outro } from "~/utils/prompts/outro";

export const nitrox = new Command()
    .name('nitrox')
    .description("Initialise and scaffold a new Nitrox project")
    .action(
        async () => {
            const packageManager = getUserPkgManager()
            await nitroxCLI(packageManager)
        }
    )


const nitroxCLI = async (packageManager:PackageManager) => {
    await intro()

    note(`Welcome to ${gradient.atlas("Nitrox")}. \nLet's get you up and running.`, "Step 1.")
    await setTimeout(1000)
    const config = await nitroxStandardConfig()
    
    note("Now, let's add some integrations.", "Step 2.")
    await setTimeout(1000)
    const integrations = await nitroxIntegrationConfig()

    await runNitroxInit(packageManager, config, integrations, true)
    await outro()
}