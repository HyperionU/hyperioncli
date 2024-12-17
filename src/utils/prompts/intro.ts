import * as prompt from "@clack/prompts";
import gradient from "gradient-string";
import { setTimeout } from "timers/promises";

export const intro = async () => {
    prompt.intro(gradient.atlas("HUCLI"));
    await setTimeout(1000)
}