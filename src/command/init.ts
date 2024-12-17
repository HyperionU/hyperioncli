import chalk from "chalk";
import { Command } from "commander";
import { runCLI } from "~/cli";
import { cliFlags } from "~/installers";
import { getUserPkgManager } from "~/utils/getPackageManager";

export const init = new Command()
    .name('init')
    .description('initialize and configure a new project')
    .option(
        "--ntrx, --nitrox",
        `Runs the new Nitrox bootstrapper. ${chalk.bgRedBright("EXPERIMENTAL")}`,
        false
    )
    .option(
        "-t, --turbo",
        `Bootstrap a Turbo monorepo. ${chalk.bgRedBright("EXPERIMENTAL")}`,
        false
    )
    .option(
        "-y, --default",
        "Skip the CLI and bootstrap a new environment using defaults.",
        false
    )
    .action(
        async (opts: cliFlags) => {
            const flags = opts;
            const packageManager = getUserPkgManager();
            await runCLI(packageManager, flags)
        }   
    )