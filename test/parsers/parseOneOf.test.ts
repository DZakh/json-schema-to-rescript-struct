import { parseOneOf } from "../../src/parsers/parseOneOf";

describe("parseOneOf", () => {
  it("should create a union from two or more schemas", () => {
    expect(
      parseOneOf(
        {
          oneOf: [
            {
              type: "string",
            },
            { type: "number" },
          ],
        },
        false
      )
    ).toStrictEqual(`z.any().superRefine((x, ctx) => {
    const schemas = [z.string(),z.number()];
    const errors = schemas.reduce(
      (errors: z.ZodError[], schema) =>
        ((result) => ("error" in result ? [...errors, result.error] : errors))(
          schema.safeParse(x)
        ),
      []
    );
    if (schemas.length - errors.length !== 1) {
      ctx.addIssue({
        path: ctx.path,
        code: "invalid_union",
        unionErrors: errors,
        message: "Invalid input: Should pass single schema",
      });
    }
  })`);
  });

  it("should extract a single schema", () => {
    expect(parseOneOf({ oneOf: [{ type: "string" }] }, false)).toStrictEqual(
      "z.string()"
    );
  });

  it("should return z.any() if array is empty", () => {
    expect(parseOneOf({ oneOf: [] }, false)).toStrictEqual("z.any()");
  });
});
