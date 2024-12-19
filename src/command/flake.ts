import { Command } from "commander";
import { readFileSync } from "fs";
import { Flake } from "~/installers";
import { flakeValidate } from "~/utils/flake";

export const flake = new Command()
    .name('flake')
    .description("Initialise new Flake or scaffold new project with Flake")
    .argument('[flake-file]')
    .option('-i, --init')
    .action(async (flake, opts) => {
        if (opts.init) {}
        if (flake !== undefined) {
            const flakeValue = readFileSync(flake, 'utf-8')
            const parsedFlake = JSON.parse(flakeValue) as Flake
            await flakeValidate(parsedFlake)
            console.log(flakeValue)
        }
    })