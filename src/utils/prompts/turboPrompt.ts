import * as prompt from "@clack/prompts";
import { isEmpty } from "~/utils/checkDir";
import { cancelPrompt } from "~/utils/prompts/cancel";

export const turboConfig = async () => {

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

    cancelPrompt(turbo);

    return turbo;

};
