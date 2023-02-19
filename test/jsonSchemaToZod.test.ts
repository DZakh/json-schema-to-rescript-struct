import jsonSchemaToZod from "../src";

describe("jsonSchemaToZod", () => {
  it("should produce a string of JS code creating a Zod schema from a simple JSON schema", () => {
    expect(
      jsonSchemaToZod({
        type: "string",
      })
    ).toStrictEqual(`let struct = z.string()`);
  });

  it("should include defaults", () => {
    expect(
      jsonSchemaToZod({
        type: "string",
        default: "foo",
      })
    ).toStrictEqual(`let struct = z.string().default("foo")`);
  });

  it("should include falsy defaults", () => {
    expect(
      jsonSchemaToZod({
        type: "string",
        default: "",
      })
    ).toStrictEqual(`let struct = z.string().default("")`);
  });

  it("should include falsy defaults", () => {
    expect(
      jsonSchemaToZod({
        type: "string",
        const: "",
      })
    ).toStrictEqual(`let struct = z.literal("")`);
  });

  it("can exclude defaults", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
          default: "foo",
        },
        undefined,
        true,
        true
      )
    ).toStrictEqual(`let struct = z.string()`);
  });

  it("will remove optionality if default is present", () => {
    expect(
      jsonSchemaToZod({
        type: "object",
        properties: {
          prop: {
            type: "string",
            default: "def",
          },
        },
      })
    ).toStrictEqual(
      `let struct = z.object({"prop":z.string().default("def")})`
    );
  });

  it("will handle falsy defaults", () => {
    expect(
      jsonSchemaToZod({
        type: "boolean",
        default: false,
      })
    ).toStrictEqual(`let struct = z.boolean().default(false)`);
  });

  it("will ignore undefined as default", () => {
    expect(
      jsonSchemaToZod({
        type: "null",
        default: undefined,
      })
    ).toStrictEqual(`let struct = z.null()`);
  });
});
