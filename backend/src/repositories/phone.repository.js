import Phone from "../models/phone.js";
import AppError from "../utils/errors.js";

export default class PhoneRepository {
  async createPhone(phoneData) {
    try {
      const phone = await Phone.create(phoneData);
      return phone;
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new AppError("Le téléphone avec cet IMEI existe déjà.", 400);
      }
      throw error
    }
  }

  async getAllPhones() {
    return await Phone.findAll()
  }

  async getPhoneById(id) {
    const phone = await Phone.findByPk(id);
      if (!phone) {
        throw new AppError("Téléphone non trouvé.", 404);
      }
      return phone;
  }

  async updatePhone(id, phoneData) {
    const [updated] = await Phone.update(phoneData, {
      where: { id },
    });
    if (!updated) {
      throw new AppError("Téléphone non trouvé.", 404);
    }
    return await this.getPhoneById(id);
  }

  async deletePhone(id) {
    const deleted = await Phone.destroy({
      where: { id },
    });
    if (!deleted) {
      throw new AppError("Téléphone non trouvé.", 404);
    }
    return deleted;
  }
}
