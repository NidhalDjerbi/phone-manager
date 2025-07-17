import { jest } from "@jest/globals";

import Phone from "../../src/models/phone.js";
import AppError from "../../src/utils/errors.js";
import PhoneRepository from "../../src/repositories/phone.repository.js";

describe("PhoneRepository", () => {
  let phoneRepository;

  beforeEach(() => {
    phoneRepository = new PhoneRepository();

    jest.clearAllMocks();
  });

  describe("createPhone", () => {
    const phoneData = {
      name: "iPhone 13",
      imei: "123456789012345",
      brand: "Apple",
      color: "Black",
      capacity: 128,
    };

    it("should create and return a phone successfully", async () => {
      const createdPhone = { id: 1, ...phoneData };
      jest.spyOn(Phone, "create").mockResolvedValue(createdPhone);

      const result = await phoneRepository.createPhone(phoneData);

      expect(Phone.create).toHaveBeenCalledWith(phoneData);
      expect(result).toEqual(createdPhone);
    });

    it("should throw AppError when IMEI already exists", async () => {
      const uniqueError = new Error("Unique constraint error");
      uniqueError.name = "SequelizeUniqueConstraintError";
      jest.spyOn(Phone, "create").mockRejectedValue(uniqueError);

      await expect(phoneRepository.createPhone(phoneData)).rejects.toThrow(
        AppError
      );
      await expect(
        phoneRepository.createPhone(phoneData)
      ).rejects.toMatchObject({
        message: "Le téléphone avec cet IMEI existe déjà.",
        statusCode: 400,
      });
    });

    it("should rethrow other database errors", async () => {
      const dbError = new Error("Database connection failed");
      dbError.name = "SequelizeConnectionError";
      jest.spyOn(Phone, "create").mockRejectedValue(dbError);

      await expect(phoneRepository.createPhone(phoneData)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("getAllPhones", () => {
    it("should return all phones", async () => {
      const phones = [
        { id: 1, name: "iPhone 13", imei: "123456789012345" },
        { id: 2, name: "Samsung Galaxy S21", imei: "987654321098765" },
      ];
      jest.spyOn(Phone, "findAll").mockResolvedValue(phones);

      const result = await phoneRepository.getAllPhones();

      expect(Phone.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(phones);
    });

    it("should return empty array when no phones exist", async () => {
      jest.spyOn(Phone, "findAll").mockResolvedValue([]);

      const result = await phoneRepository.getAllPhones();

      expect(Phone.findAll).toHaveBeenCalledWith();
      expect(result).toEqual([]);
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      Phone.findAll.mockRejectedValue(dbError);

      await expect(phoneRepository.getAllPhones()).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("getPhoneById", () => {
    it("should return phone when found", async () => {
      const phone = { id: 1, name: "iPhone 13", imei: "123456789012345" };
      jest.spyOn(Phone, "findByPk").mockResolvedValue(phone);

      const result = await phoneRepository.getPhoneById(1);

      expect(Phone.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(phone);
    });

    it("should throw AppError when phone not found", async () => {
      jest.spyOn(Phone, "findByPk").mockResolvedValue(null);

      await expect(phoneRepository.getPhoneById(999)).rejects.toThrow(AppError);
      await expect(phoneRepository.getPhoneById(999)).rejects.toMatchObject({
        message: "Téléphone non trouvé.",
        statusCode: 404,
      });
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      jest.spyOn(Phone, "findByPk").mockRejectedValue(dbError);

      await expect(phoneRepository.getPhoneById(1)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("updatePhone", () => {
    const updateData = { name: "iPhone 13 Pro", color: "Blue" };

    it("should update and return updated phone", async () => {
      const updatedPhone = { id: 1, ...updateData };
      jest.spyOn(Phone, "update").mockResolvedValue([1]);

      const getPhoneByIdSpy = jest
        .spyOn(phoneRepository, "getPhoneById")
        .mockResolvedValue(updatedPhone);

      const result = await phoneRepository.updatePhone(1, updateData);

      expect(Phone.update).toHaveBeenCalledWith(updateData, {
        where: { id: 1 },
      });
      expect(getPhoneByIdSpy).toHaveBeenCalledWith(1);
      expect(result).toEqual(updatedPhone);

      getPhoneByIdSpy.mockRestore();
    });

    it("should throw AppError when phone not found for update", async () => {
      jest.spyOn(Phone, "update").mockResolvedValue([0]);

      await expect(
        phoneRepository.updatePhone(999, updateData)
      ).rejects.toThrow(AppError);
      await expect(
        phoneRepository.updatePhone(999, updateData)
      ).rejects.toMatchObject({
        message: "Téléphone non trouvé.",
        statusCode: 404,
      });
    });

    it("should handle database errors during update", async () => {
      const dbError = new Error("Database error");
      jest.spyOn(Phone, "update").mockRejectedValue(dbError);

      await expect(phoneRepository.updatePhone(1, updateData)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("deletePhone", () => {
    it("should delete phone and return deleted count", async () => {
      jest.spyOn(Phone, "destroy").mockResolvedValue(1);

      const result = await phoneRepository.deletePhone(1);

      expect(Phone.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(1);
    });

    it("should throw AppError when phone not found for deletion", async () => {
      jest.spyOn(Phone, "destroy").mockResolvedValue(0);

      await expect(phoneRepository.deletePhone(999)).rejects.toThrow(AppError);
      await expect(phoneRepository.deletePhone(999)).rejects.toMatchObject({
        message: "Téléphone non trouvé.",
        statusCode: 404,
      });
    });

    it("should handle database errors during deletion", async () => {
      const dbError = new Error("Database error");
      jest.spyOn(Phone, "destroy").mockRejectedValue(dbError);

      await expect(phoneRepository.deletePhone(1)).rejects.toThrow(
        "Database error"
      );
    });
  });
});
