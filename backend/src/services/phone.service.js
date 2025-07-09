// service phone service

import AppError from "../utils/errors.js";
import PhoneRepository from "../repositories/phone.repository.js";
const phoneRepository = new PhoneRepository();
export class PhoneService {
  async createPhone(phoneData) {
    return await phoneRepository.createPhone(phoneData);
  }

  async getAllPhones() {
    return await phoneRepository.getAllPhones();
  }

  async getPhoneById(id) {
    return await phoneRepository.getPhoneById(id);
  }

  async updatePhone(id, phoneData) {
    return await phoneRepository.updatePhone(id, phoneData);
  }

  async deletePhone(id) {
    return await phoneRepository.deletePhone(id);
  }
}
