import { note } from "@clack/prompts";
import { Command } from "commander";
import { readFileSync } from "fs";
import gradient from "gradient-string";
import { setTimeout } from "timers/promises";
import { runNitroxInit } from "~/cli/nitrox";
import { initTurborepo } from "~/cli/turbo";
import { Flake, Packages } from "~/installers"
import { installPackages } from "~/installers/installPackage";
import { flakeValidate } from "~/utils/flake";
import { install } from "~/utils/prompts";
import { intro } from "~/utils/prompts/intro";
import { outro } from "~/utils/prompts/outro";
import { tasks, Task } from "~/utils/task";

export const flake = new Command()
    .name('flake')
    .description("Initialise new Flake or scaffold new project with Flake")
    .argument('[flake-file]')
    .option('-i, --init')
    .action(async (flake, opts) => {
        if (opts.init) {}
        if (flake !== undefined) {
            await parseFlake(flake)
        }
    })

const parseFlake = async (flakeFile:any) => {
    /* Pass 1: Read and Parse flake */
    const flakeValue = readFileSync(flakeFile, 'utf-8')
    const parsedFlake = JSON.parse(flakeValue) as Flake
    /* Pass 2: Validate flake content */
    const valid = await flakeValidate(parsedFlake)
    /* Pass 3: Initialise using flake content */
    if (!valid) return
    await flakeCLI(parsedFlake)
}  

const flakeCLI = async (flake:Flake) => {
    await intro()
    const packageManager = flake.packageManager;
    const packageSet = flake.packageSet.value;
    let packages: Packages[] = [];
    const enableTurbo = flake.turbo.enable
    const turboPath = flake.turbo.path as string
    const enableNitrox = flake.nitrox.enable
    const nitroxConfig = {
        route: flake.nitrox.path as string,
        typescript: flake.nitrox.typescript as string,
        runInstall: flake.nitrox.runInstall as boolean,
        initGit: flake.nitrox.initGit as boolean
    }
    const nitroxIntegrations = flake.nitrox.integrations as string[]
    
    if (packageSet === "custom") {
        packages = flake.packageSet.packages as Packages[]
    }
    else {
        packages = await install(packageSet)
    }

    const taskSet: Task[] = [
        {
            title: "Installing Extensions",
            async task() {
                await installPackages(packages);
                await setTimeout(1000 * packages.length);
                return `${gradient.atlas("Extensions installed.")}`;
            },
        },
        {
            title: "Initialising Turborepo",
            async task() {
                await initTurborepo(packageManager, turboPath)
                return `${gradient.passion("Turbo")} running.`
            },
            enabled: enableTurbo
        },
        {
            title: "Initialising Nitrox",
            async task() {
                await runNitroxInit(packageManager, nitroxConfig, nitroxIntegrations)
            },
            enabled: enableNitrox
        }
    ]
    note(`Flake Enabled, using following flake settings.

    - Package Manager: ${packageManager}

    - Package Set: ${packageSet}
        - Packages: ${packages}

    - Turbo
        - Enabled: ${enableTurbo}
        ${enableTurbo ? `- Turborepo Path: ${turboPath}` : ""}

    - Nitrox
        - Enabled: ${enableNitrox}
        ${enableNitrox ? `- Config:
            - Path: ${nitroxConfig.route}
            - Typescript Strictness: ${nitroxConfig.typescript}
            - Install Dependencies: ${nitroxConfig.runInstall}
            - Initialise Git: ${nitroxConfig.initGit}` : ""}
        ${enableNitrox ? `- Integrations: ${!nitroxIntegrations.length ? "None" : nitroxIntegrations}` : ""}
    `, "Re: Flakes")

    await tasks(taskSet)
    await outro()
    return flake
}