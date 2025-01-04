import { text } from "@clack/prompts";
import { isEmpty } from "~/utils/checkDir";
import { cancelPrompt } from "~/utils/prompts/cancel";
import { turboGradient } from "../gradients";

export const turboConfig = async () => {

    const turbo = await text({
        message: `What is the path to your new ${turboGradient("turborepo?")}`,
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
