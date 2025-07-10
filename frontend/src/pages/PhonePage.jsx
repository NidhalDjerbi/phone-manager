import { useState } from "react";
import { toast } from "sonner";
import { usePhones } from "../services/usePhones";
import { useCreatePhone } from "../services/useCreatePhone";
import { useUpdatePhone } from "../services/useUpdatePhone";
import { useDeletePhone } from "../services/useDeletePhone";
import PhoneForm from "../components/PhoneForm";
import ListPhones from "../components/ListPhones";

function PhonePage() {
  const { data, isLoading, error } = usePhones();
  const [editingPhone, setEditingPhone] = useState(null);

  const createPhoneMutation = useCreatePhone(() => {
    setEditingPhone(null)
    toast("Phone ajouté avec succès", { type: "success" });
  }, (error) => {
    const message = error.response?.data?.error || error.message;
    toast(`Erreur lors de l'ajout du téléphone : ${message}`, { type: "error" });
  });

  const updatePhoneMutation = useUpdatePhone(() => setEditingPhone(null));
  const deletePhoneMutation = useDeletePhone();

  const handleEdit = (phone) => {
    setEditingPhone(phone);
  };

  const handleSubmit = (formData) => {
    if (editingPhone) {
      updatePhoneMutation.mutate({ id: editingPhone.id, data: formData });
    } else {
      createPhoneMutation.mutate(formData);
    }
  };

  const handleReset = () => {
    setEditingPhone(null); 
  }

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
        onReset={handleReset}
        editingPhone={editingPhone}
        isPending={
          createPhoneMutation.isPending ||
          updatePhoneMutation.isPending ||
          deletePhoneMutation.isPending
        }
        submitLabel={editingPhone ? "Mettre à jour" : "Ajouter"}
      />

      <ListPhones
        phones={data}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default PhonePage;
