import { log } from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";
import { execa } from "execa";
import { readFileSync } from "fs";
import gradient from "gradient-string";
import path from "path";
import { cwd } from "process";
import { setTimeout } from "timers/promises";
import { runNitroxInit, runStarlightInit } from "~/cli/nitrox";
import { initTurborepo } from "~/cli/turbo";
import { Flake, FlakeConfig } from "~/installers";
import { Packages } from "~/installers";
import { installPackages } from "~/installers/installPackage";
import { flakeValidate, generateFlakeSchema, initFlake } from "~/utils/flake";
import { turboGradient } from "~/utils/gradients";
import { install } from "~/utils/prompts";
import { intro } from "~/utils/prompts/intro";
import { outro } from "~/utils/prompts/outro";
import { tasks, Task } from "~/utils/task";

export const flake = new Command()
  .name("flake")
  .description("Initialise new Flake or scaffold new project with Flake")
  .argument("<flake-file>")
  .action(async (flake) => {
    try {
      await intro();
      await parseFlake(flake);
      await outro();
    } catch (error) {
      console.error(chalk.bgRed(error));
    }
  });

flake
  .command("init")
  .description("Initalise new Flake")
  .argument("[dir]", "Directory to new flake", cwd())
  .action((dir) => {
    const flakeDir = path.resolve(dir);
    initFlake(flakeDir);
  });

flake
  .command("gen")
  .description("Generate new flake schema")
  .argument("[file]", "File name for schema", "flake.schema")
  .action((file) => {
    generateFlakeSchema(file);
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
  const overrides = flakeConfig.overrides;

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
        try {
          if (options?.turboPath === undefined)
            throw new Error("Turbo Path not defined.");
          await initTurborepo(packageManager, options?.turboPath, false);
          return `${turboGradient("Turbo")} initialized!`;
        } catch (error) {
          return `${chalk.bgRed(error)}`;
        }
      },
      enabled: services.turbo ?? false,
    },
    {
      title: `Overriding ${turboGradient("Turbo")} apps`,
      async task() {
        try {
          /* Top level: turboPath & Overrides defined? */
          if (options?.turboPath === undefined)
            throw new Error("Turbo Path not defined.");
          if (overrides?.apps === undefined)
            throw new Error("Apps override not defined.");
          /* Web level: Web defined? */
          if (overrides.web === undefined && overrides.apps.includes("web"))
            throw new Error("Web override not defined.");
          if (overrides.web?.nitrox) {
            const nitroxRoute = path.resolve(cwd(), options?.turboPath, "apps/web");
            nitrox.route = path.resolve(cwd(), options.turboPath, "apps", nitrox.route)
            execa`rm -rf ${nitroxRoute}`
            await runNitroxInit(packageManager, nitrox, integrations, false)
          }
          if (overrides.docs === undefined && overrides.apps.includes("docs"))
            throw new Error("Docs override not defined.");
          if (overrides.docs?.starlight) {
            const starlightRoute = path.resolve(cwd(), options.turboPath, "apps/docs")
            nitrox.route = starlightRoute
            execa`rm -rf ${starlightRoute}`
            await runStarlightInit(packageManager, nitrox, integrations, false)
          }
          return `${turboGradient("Turbo")} overrides complete.`;
        } catch (error) {
          return `${chalk.bgRed(error)}`;
        }
      },
      enabled: overrides?.enable ?? false,
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
      enabled: (services.nitrox ?? false) && overrides?.enable === false,
    },
  ];

  log.message("Flake Detected! Using flake settings.", {
    symbol: chalk.cyan("~"),
  });
  await setTimeout(1000);

  await tasks(flakeTasks);
};
