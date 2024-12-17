import { cancel, confirm, group, select, text } from "@clack/prompts";
import { isEmpty } from "~/utils/checkDir";

export const nitroxStandardConfig = async () => {
    const config = await group({
        route: () => text({
            message: "What is the path to your new site?",
            placeholder: "./www",
            validate: (value) => {
                if (!value) return 'Please enter a path.';
                if (value[0] !== '.') return 'Please enter a relative path.';
                if (!isEmpty(value)) return 'Please enter an empty path.';
                return;
            }
        }),
        typescript: () => select({
            message: "How strict should TypeScript be?",
            initialValue: "strict",
            options: [
                {value: "strict", label: "Strict"},
                {value: "strictest", label: "Strictest"},
                {value: "relaxed", label: "Relaxed", hint: "oh no"}
            ],
        }),
        runInstall: () => confirm({
            message: "Install dependencies?",
            initialValue: true
        }),
        initGit: () => confirm({
            message: "Initialize a Git Repository?",
            initialValue: false
        }),
    },
    {
        onCancel: () => {
            cancel("Cancelled");
            process.exit(1)
        }
    });
    return config
}