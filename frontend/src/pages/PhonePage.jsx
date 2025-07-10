import { useState } from "react";
import { usePhones } from "../services/usePhones";
import { useCreatePhone } from "../services/useCreatePhone";
import { useUpdatePhone } from "../services/useUpdatePhone";
import { useDeletePhone } from "../services/useDeletePhone";
import PhoneForm from "../components/PhoneForm";
import ListPhones from "./ListPhones";

function PhonePage() {
  const { data, isLoading, error } = usePhones();
  const [editingPhone, setEditingPhone] = useState(null);

  const createPhoneMutation = useCreatePhone(() => setEditingPhone(null));
  const updatePhoneMutation = useUpdatePhone(() => setEditingPhone(null));
  const deletePhoneMutation = useDeletePhone();

  const handleEdit = (phone) => {
    setEditingPhone(phone);
  };

  const handleCancelEdit = () => {
    setEditingPhone(null);
  };

  const handleSubmit = (formData) => {
    if (editingPhone) {
      updatePhoneMutation.mutate({ id: editingPhone.id, data: formData });
    } else {
      createPhoneMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer ce téléphone ?")) {
      deletePhoneMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div>
      <PhoneForm
        initialData={editingPhone}
        onSubmit={handleSubmit}
        editingPhone={editingPhone}
        isPending={
          createPhoneMutation.isPending ||
          updatePhoneMutation.isPending ||
          deletePhoneMutation.isPending
        }
        submitLabel={editingPhone ? "Mettre à jour" : "Ajouter"}
      />

      {editingPhone && (
        <div className="flex justify-center gap-4 my-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Mettre à jour
          </button>
          <button
            onClick={handleCancelEdit}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Annuler la modification
          </button>
        </div>
      )}

      <ListPhones
        phones={data}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default PhonePage;
