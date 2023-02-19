import { JSONSchema7 } from "json-schema";
import { parseSchema } from "./parsers/parseSchema";
import { format } from "./utils/format";
import $RefParser from "@apidevtools/json-schema-ref-parser";

export const jsonSchemaToZodDereffed = (
  schema: JSONSchema7,
  name?: string,
  module = true,
  withoutDefaults = false
): Promise<string> =>
  $RefParser
    .dereference(schema)
    .then((schema) =>
      jsonSchemaToZod(schema as JSONSchema7, name, module, withoutDefaults)
    );

export const jsonSchemaToZod = (
  schema: JSONSchema7,
  name?: string,
  module = true,
  withoutDefaults = false
): string =>
  format(
    `${module ? `import {z} from 'zod'\n\nexport ` : ""}${
      name ? `const ${name}=` : module ? "default " : "const schema="
    }${parseSchema(schema, withoutDefaults)}`
  );
