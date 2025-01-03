import { log } from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";
import { readFileSync } from "fs";
import gradient from "gradient-string";
import { setTimeout } from "timers/promises";
import { runNitroxInit } from "~/cli/nitrox";
import { initTurborepo } from "~/cli/turbo";
import { Flake, FlakeConfig } from "~/installers";
import { Packages } from "~/installers";
import { installPackages } from "~/installers/installPackage";
import { flakeValidate, generateFlakeSchema } from "~/utils/flake";
import { turboGradient } from "~/utils/gradients";
import { install } from "~/utils/prompts";
import { intro } from "~/utils/prompts/intro";
import { outro } from "~/utils/prompts/outro";
import { tasks, Task } from "~/utils/task";

export const flake = new Command()
  .name("flake")
  .description("Initialise new Flake or scaffold new project with Flake")
  .argument("[flake-file]")
  .option("-i, --init")
  .option("-g, --gen", "generate flake schema")
  .action(async (flake, opts) => {
    if (opts.init) {
    }
    if (opts.gen) {
      generateFlakeSchema("flake.schema");
    }
    if (flake !== undefined) {
      await intro();
      await parseFlake(flake);
      await outro();
    }
  });

const parseFlake = async (flakeFile: any) => {
  /* Pass 1: Read and Parse flake */
  const flakeValue = readFileSync(flakeFile, "utf-8");
  const parsedFlake = JSON.parse(flakeValue) as Flake;
  /* Pass 2: Validate flake content */
  const valid = await flakeValidate(parsedFlake);
  /* Pass 3: Initialise using flake content */
  if (!valid) return;
  await flakeCLI(parsedFlake);
};

const flakeCLI = async (flake: Flake) => {
  const flakeConfig = new FlakeConfig(flake);
  const packageManager = flakeConfig.packageManager;
  const services = flakeConfig.services;
  const options = flakeConfig.options;
  const nitrox = {
    route: options?.nitrox?.path ?? "",
    typescript: options?.nitrox?.typescript ?? "",
    runInstall: options?.nitrox?.runInstall ?? false,
    initGit: options?.nitrox?.initGit ?? false,
  };
  const integrations = options?.nitrox?.integrations ?? [];

  const flakeTasks: Task[] = [
    {
      title: "Installing Packages",
      async task() {
        try {
          let packages: Packages[] = [];
          if (options?.packageSet?.value === undefined) {
            throw new Error("Package Set not defined.");
          }
          if (options?.packageSet?.value === "custom") {
            packages = options.packageSet.packages as Packages[];
          }
          if (options.packageSet.packages?.length === 0) {
            return `${chalk.bgYellowBright("Install skipped.")}`;
          } else {
            await install(options?.packageSet?.value);
          }
          await installPackages(packages);
          await setTimeout(packages.length * 1000);
          return "Packages Installed.";
        } catch (error) {
          return `${chalk.bgRed(error)}`;
        }
      },
      enabled: services.packageSet ?? false,
    },
    {
      title: `Initializing ${turboGradient("Turbo")}`,
      async task() {
        if (options?.turboPath === undefined) return "Initalization Skipped.";
        await initTurborepo(packageManager, options?.turboPath, false);
        return `${turboGradient("Turbo")} initialized!`;
      },
      enabled: services.turbo ?? false,
    },
    {
      title: `Initializing ${gradient.atlas("Nitrox")}`,
      async task() {
        try {
          if (nitrox.route === "") throw new Error("Nitrox path not defined!");
          if (nitrox.typescript === "")
            throw new Error("Typescript not defined!");
          await runNitroxInit(packageManager, nitrox, integrations, false);
          return `${gradient.atlas("Nitrox Initialized!")}`;
        } catch (error) {
          return `${chalk.bgRed(error)}`;
        }
      },
      enabled: services.nitrox ?? false,
    },
  ];

  log.message("Flake Detected! Using flake settings.", {symbol: chalk.cyan("~")})
  await setTimeout(1000)

  await tasks(flakeTasks);
};
