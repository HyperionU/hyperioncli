import { execa } from "execa";
import { PackageManager } from "~/utils/getPackageManager";

export const shadCn = async (
  packageManager: PackageManager,
  projectDir: string
) => {

  switch (packageManager) {
    case "npm":
      await execa`npx shadcn@canary init -c ${projectDir} -d -s`;
      break;
    default:
      await execa`${packageManager} dlx shadcn@canary init -c ${projectDir} -d -s `;
      break;
  }
};