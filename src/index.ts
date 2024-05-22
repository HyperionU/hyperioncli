#!usr/bin/env node

import { runCLI } from "./cli";

const main = async () => {
    const { flags, packages } = await runCLI();

    console.log(flags);
    console.log(packages);
}

await main();