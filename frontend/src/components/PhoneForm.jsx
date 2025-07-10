import { useState, useEffect } from "react";
import { phoneSchema } from "../utils/phoneSchema";

function PhoneForm({
  initialData = null,
  onSubmit,
  onReset,
  editingPhone = false,
  isPending,
  submitLabel = "Envoyer",
}) {
  const [formData, setFormData] = useState({
    brand: "",
    imei: "",
    name: "",
    color: "Rouge",
    capacity: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      brand: initialData?.brand ?? "",
      imei: initialData?.imei ?? "",
      name: initialData?.name ?? "",
      color: initialData?.color ?? "",
      capacity: initialData?.capacity?.toString() ?? "",
    });
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const parsedData = {
      ...formData,
      capacity: Number(formData.capacity),
    };

    const result = phoneSchema.safeParse(parsedData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues?.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit(parsedData);
  };

  const handleReset = () => {
    setFormData({
      brand: "",
      imei: "",
      name: "",
      color: "",
      capacity: "",
    })
    setErrors({});
    onReset?.();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {editingPhone
              ? "Modifier le téléphone"
              : "Ajouter un nouveau téléphone"}
          </h2>

          <div className="flex gap-4">
            <button
            type="reset"
            disabled={isPending}
            onClick={handleReset}
            className={`bg-gray-200 text-gray-800 px-8 py-2 rounded-lg hover:bg-gray-300 transition`}
          >
            Réinitialiser
          </button>
          

          <button
            type="submit"
            disabled={isPending}
            className={`px-8 py-2 rounded-lg font-semibold transition-colors ${
              isPending
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isPending ? "Chargement..." : submitLabel}
          </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marque
          </label>
          <input
            name="brand"
            value={formData.brand}
            placeholder="Ex: iPhone, Samsung Galaxy"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={handleChange}
          />
          {errors.brand && <p style={{ color: "red" }}>{errors.brand}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IMEI
          </label>
          <input
            placeholder="15 chiffres exactement"
            maxLength={15}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            name="imei"
            value={formData.imei}
            onChange={handleChange}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.imei.length}/15 caractères
          </div>
          {errors.imei && <p style={{ color: "red" }}>{errors.imei}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du téléphone
          </label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: iPhone 15 Pro"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Couleur
          </label>
          <input
            name="color"
            type="text"
            value={formData.color}
            onChange={handleChange}
            placeholder="Rouge ou Bleu"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.color && <p style={{ color: "red" }}>{errors.color}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacité (GO)
          </label>
          <input
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({
                ...formData,
                capacity: parseInt(e.target.value) ?? '',
              })
            }
            placeholder="Ex: 128"
            min="0"
            step="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="text-xs text-gray-500 mt-1">
            Doit être un multiple de 2 et supérieur à 0
          </div>
          {errors.capacity && <p style={{ color: "red" }}>{errors.capacity}</p>}
        </div>
      </form>
    </div>
  );
}

export default PhoneForm;
