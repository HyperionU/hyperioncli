import gradient from "gradient-string";
import { setTimeout } from "timers/promises";
import * as prompt from "@clack/prompts"

export const outro = async () => {
    await setTimeout(1000);
    prompt.outro(`You are now ready to ${gradient.atlas("Hit The Ground Running")}!`);
}