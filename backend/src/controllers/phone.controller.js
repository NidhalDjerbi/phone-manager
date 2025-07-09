// phone controlller with validator
import { PhoneService } from "../services/phone.service.js";
import { phoneSchema } from "../validators/phone.validator.js";

const phoneService = new PhoneService();

export default class PhoneController {
  async createPhone(req, res) {
    const validatedPhone = phoneSchema.parse(req.body);

    const phone = await phoneService.createPhone(validatedPhone);
    return res.status(201).json(phone[0]);
  }

  async getPhones(req, res) {
    const phones = await phoneService.getAllPhones();
    return res.status(200).json(phones);
  }

  async getPhoneById(req, res) {
    const { id } = req.params;
    const phone = await phoneService.getPhoneById(id);

    if (!phone) {
      return res.status(404).json({ error: "Phone not found" });
    }

    return res.status(200).json(phone);
  }

  async updatePhone(req, res) {
    const { id } = req.params;

    const validatedPhone = phoneSchema.parse(req.body);
    const updatedPhone = await phoneService.updatePhone(id, validatedPhone);

    if (!updatedPhone) {
      return res.status(404).json({ error: "Phone not found" });
    }
    return res.status(200).json(updatedPhone);
  }

  async deletePhone(req, res) {
    const { id } = req.params;
    const deletedPhone = await phoneService.deletePhone(id);
    if (!deletedPhone) {
      return res.status(404).json({ error: "Phone not found" });
    }
    return res.status(204).send();
  }
}
