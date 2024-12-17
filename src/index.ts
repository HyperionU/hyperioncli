#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { version } from "../package.json";
import { init } from "./command/init.js";


const program = new Command()
    .name("hyperioncli")
    .description("The easiest way to configure your development environment to UofH Standards.")
    .version(chalk.grey(version))

program
    .addCommand(init)

program.parse()
