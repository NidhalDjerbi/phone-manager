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

  const createPhoneMutation = useCreatePhone(
    (data) => {
    setEditingPhone(null)
    toast("Phone ajouté avec succès", { type: "success" });
  }, (error) => {
    const message = error.response?.data?.error || error.message;
    toast(`Erreur lors de l'ajout du téléphone : ${message}`, { type: "error" });
  });

  const updatePhoneMutation = useUpdatePhone(
    (data) => {
      setEditingPhone(null);
      toast("Téléphone mis à jour avec succès", { type: "success" });
    },
    (error) => {
      const message = error.response?.data?.error || error.message;
      toast(`Erreur lors de la mise à jour du téléphone : ${message}`, { type: "error" });
    }
  );
  const deletePhoneMutation = useDeletePhone(
    (id) => {
      setEditingPhone(null);
      toast("Téléphone supprimé avec succès", { type: "success" });
    },
    (error) => {
      const message = error.response?.data?.error || error.message;
      toast(`Erreur lors de la suppression du téléphone : ${message}`, { type: "error" });
    }
  );

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
