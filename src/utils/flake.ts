import Ajv from "ajv";
import * as schema from "~/utils/flake.schema.json"

const ajv = new Ajv();

const validate = ajv.compile(schema);

export const flakeValidate = (data: any) => {

    const valid = validate(data);

    if (!valid) {
        return console.error(validate.errors)
    }
    
    return console.log("Data Valid!")
}