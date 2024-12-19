import Ajv from "ajv";
import * as schema from "./flake.schema.json"
import { Flake } from "~/installers";

const ajv = new Ajv()

const validate = ajv.compile<Flake>(schema)

export const flakeValidate = async (flake: Flake) => {
    const valid = validate(flake)
    
    if (!valid) {
        console.error(validate.errors)
    }

    return valid;
}