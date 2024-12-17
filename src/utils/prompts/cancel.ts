import { cancel, isCancel } from "@clack/prompts"
import { exit } from "process"

export const cancelPrompt = (value: unknown) => {
    if (isCancel(value)) {
        cancel("Operation Cancelled.")
        exit(1)
    }
    return;
}