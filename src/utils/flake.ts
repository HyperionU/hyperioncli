import Ajv from "ajv";
import { writeFileSync } from "fs";
import zodToJsonSchema from "zod-to-json-schema";
import { Flake, flakeSchema } from "~/installers";

const ajv = new Ajv()

const validate = ajv.compile<Flake>(zodToJsonSchema(flakeSchema))

export const flakeValidate = async (flake: Flake) => {
    try {
        const valid = validate(flake)
        if (!valid) throw validate.errors
        return valid;
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

export function generateFlakeSchema(fileName: string) {
    writeFileSync(
        `./src/utils/schema/${fileName}.json`, 
        JSON.stringify(zodToJsonSchema(flakeSchema)),
        {
            "encoding": "utf-8"
        }
    )
}