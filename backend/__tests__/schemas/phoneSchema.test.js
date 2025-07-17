import { phoneSchema } from "../../src/validators/phone.validator";
describe("phoneSchema", () => {
  it("valide un objet correct", () => {
    const validPhone = {
      imei: "123456789012345",
      name: "iPhone 13",
      brand: "Apple",
      color: "Noir",
      capacity: 128,
    };

    const result = phoneSchema.safeParse(validPhone);
    expect(result.success).toBe(true);
  });

  it("rejette un IMEI invalide (trop court)", () => {
    const invalidPhone = {
      imei: "123",
      name: "iPhone 13",
      brand: "Apple",
      color: "Noir",
      capacity: 128,
    };

    const result = phoneSchema.safeParse(invalidPhone);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toMatch(/Too small: expected string to have >=15 characters/);
  });

  it("rejette un nom vide", () => {
    const invalidPhone = {
      imei: "123456789012345",
      name: "",
      brand: "Apple",
      color: "Noir",
      capacity: 128,
    };

    const result = phoneSchema.safeParse(invalidPhone);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe("Le nom ne peut pas être vide");
  });

  it("rejette une capacité négative", () => {
    const invalidPhone = {
      imei: "123456789012345",
      name: "iPhone 13",
      brand: "Apple",
      color: "Noir",
      capacity: -16,
    };

    const result = phoneSchema.safeParse(invalidPhone);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      "La capacité doit être supérieure à zéro"
    );
  });

  it("rejette une capacité non multiple de 2", () => {
    const invalidPhone = {
      imei: "123456789012345",
      name: "iPhone 13",
      brand: "Apple",
      color: "Noir",
      capacity: 125,
    };

    const result = phoneSchema.safeParse(invalidPhone);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      "La capacité doit être un multiple de 2"
    );
  });
});
