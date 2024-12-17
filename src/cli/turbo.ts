import { execa } from "execa";
import { PackageManager } from "~/utils/getPackageManager.js";
import * as prompt from "@clack/prompts"
import gradient from "gradient-string";
import { setTimeout } from "timers/promises";
import { isEmpty } from "~/utils/checkDir.js";
import { cancelPrompt } from "~/utils/prompts/cancel.js";

export const turboCLI = async (packageManager:PackageManager) => {
    switch (packageManager) {
        case "yarn":
            await execa({stdout: 'inherit', stderr: 'inherit'})`yarn global add turbo`
            break;
        default:
            await execa({stdout: 'inherit', stderr: 'inherit'})`${packageManager} install turbo --global`
            break;
    }

    const turboPath = await turboPrompt();

    switch (packageManager) {
        case "npm":
            await execa({stdout: 'inherit', stderr: 'inherit'})`npx create-turbo ${turboPath} -m ${packageManager}`
            break;
    
        default:
            await execa({stdout: 'inherit', stderr: 'inherit'})`${packageManager} dlx create-turbo ${turboPath} -m ${packageManager}`
            break;
    }
}

const turboPrompt = async () => {
    prompt.note(`Welcome to ${gradient.passion("Turbo")}. Let's get started.`, "Step 2.")
    await setTimeout(1000)

    const turbo = await prompt.text({
        message: "What is the path to your new turborepo?",
        placeholder: "./turbo",
        validate: (value) => {
            if (!value) return 'Please enter a path.';
            if (value[0] !== '.') return 'Please enter a relative path.';
            if (!isEmpty(value)) return 'Please enter an empty path.';
            return;
        }
    }) as string;

    cancelPrompt(turbo)

    return turbo;
    
}