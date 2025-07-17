import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { toast } from 'sonner';
import PhonePage from '../PhonePage';

vi.mock('../../services/usePhones');
vi.mock('../../services/useCreatePhone');
vi.mock('../../services/useUpdatePhone');
vi.mock('../../services/useDeletePhone');

vi.mock('../../components/PhoneForm', () => ({
  default: ({ onSubmit, onReset, initialData, isPending, submitLabel, editingPhone }) => (
    <div data-testid="phone-form">
      <button 
        onClick={() => onSubmit({ name: 'iPhone 15', brand: 'Apple', imei: '123456789', color: 'Blue', capacity: 128 })}
        data-testid="submit-button"
        disabled={isPending}
      >
        {submitLabel}
      </button>
      <button onClick={onReset} data-testid="reset-button">Reset</button>
      {initialData && <div data-testid="editing-data">{initialData.name}</div>}
      {isPending && <div data-testid="form-pending">Loading...</div>}
    </div>
  )
}));

vi.mock('../../components/ListPhones', () => ({
  default: ({ phones, handleEdit, handleDelete }) => (
    <div data-testid="list-phones">
      {phones?.map(phone => (
        <div key={phone.id} data-testid={`phone-${phone.id}`}>
          <span>{phone.name}</span>
          <button onClick={() => handleEdit(phone)} data-testid={`edit-${phone.id}`}>Edit</button>
          <button onClick={() => handleDelete(phone.id)} data-testid={`delete-${phone.id}`}>Delete</button>
        </div>
      ))}
    </div>
  )
}));

vi.mock('sonner', () => ({
  toast: vi.fn()
}));

global.window.confirm = vi.fn();

import { usePhones } from '../../services/usePhones';
import { useCreatePhone } from '../../services/useCreatePhone';
import { useUpdatePhone } from '../../services/useUpdatePhone';
import { useDeletePhone } from '../../services/useDeletePhone';

describe('PhonePage', () => {
  const mockPhones = [
    { id: 1, name: 'iPhone 13', brand: 'Apple', imei: '123456789', color: 'Blue', capacity: 128 },
    { id: 2, name: 'Samsung Galaxy S21', brand: 'Samsung', imei: '987654321', color: 'Black', capacity: 256 }
  ];

  const mockMutate = vi.fn();
  const mockCreateMutation = {
    mutate: mockMutate,
    isPending: false
  };
  const mockUpdateMutation = {
    mutate: mockMutate,
    isPending: false
  };
  const mockDeleteMutation = {
    mutate: mockMutate,
    isPending: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    usePhones.mockReturnValue({
      data: mockPhones,
      isLoading: false,
      error: null
    });

    useCreatePhone.mockImplementation((onSuccess, onError) => {
      mockCreateMutation.onSuccess = onSuccess;
      mockCreateMutation.onError = onError;
      return mockCreateMutation;
    });

    useUpdatePhone.mockImplementation((onSuccess, onError) => {
      mockUpdateMutation.onSuccess = onSuccess;
      mockUpdateMutation.onError = onError;
      return mockUpdateMutation;
    });

    useDeletePhone.mockImplementation((onSuccess, onError) => {
      mockDeleteMutation.onSuccess = onSuccess;
      mockDeleteMutation.onError = onError;
      return mockDeleteMutation;
    });
  });

  describe('Rendu initial', () => {
    it('devrait rendre le composant avec PhoneForm et ListPhones', () => {
      render(<PhonePage />);
      
      expect(screen.getByTestId('phone-form')).toBeInTheDocument();
      expect(screen.getByTestId('list-phones')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toHaveTextContent('Ajouter');
    });

    it('devrait afficher les téléphones dans la liste', () => {
      render(<PhonePage />);
      
      expect(screen.getByTestId('phone-1')).toBeInTheDocument();
      expect(screen.getByTestId('phone-2')).toBeInTheDocument();
      expect(screen.getByText('iPhone 13')).toBeInTheDocument();
      expect(screen.getByText('Samsung Galaxy S21')).toBeInTheDocument();
    });
  });

  describe('États de chargement et d\'erreur', () => {
    it('devrait afficher le message de chargement', () => {
      usePhones.mockReturnValue({
        data: null,
        isLoading: true,
        error: null
      });

      render(<PhonePage />);
      expect(screen.getByText('Chargement...')).toBeInTheDocument();
    });

    it('devrait afficher le message d\'erreur', () => {
      const mockError = { message: 'Erreur de connexion' };
      usePhones.mockReturnValue({
        data: null,
        isLoading: false,
        error: mockError
      });

      render(<PhonePage />);
      expect(screen.getByText('Erreur : Erreur de connexion')).toBeInTheDocument();
    });
  });

  describe('Gestion du formulaire', () => {
    it('devrait soumettre le formulaire pour créer un téléphone', () => {
      render(<PhonePage />);
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      expect(mockMutate).toHaveBeenCalledWith({
        name: 'iPhone 15',
        brand: 'Apple',
        imei: '123456789',
        color: 'Blue',
        capacity: 128
      });
    });

    it('devrait réinitialiser le formulaire', () => {
      render(<PhonePage />);
      
      const editButton = screen.getByTestId('edit-1');
      fireEvent.click(editButton);
      
      expect(screen.getByTestId('editing-data')).toHaveTextContent('iPhone 13');
      
      const resetButton = screen.getByTestId('reset-button');
      fireEvent.click(resetButton);
      
      expect(screen.queryByTestId('editing-data')).not.toBeInTheDocument();
    });
  });

  describe('Gestion de l\'édition', () => {
    it('devrait passer en mode édition quand on clique sur Edit', () => {
      render(<PhonePage />);
      
      const editButton = screen.getByTestId('edit-1');
      fireEvent.click(editButton);

      expect(screen.getByTestId('editing-data')).toHaveTextContent('iPhone 13');
      expect(screen.getByTestId('submit-button')).toHaveTextContent('Mettre à jour');
    });

    it('devrait soumettre une mise à jour quand en mode édition', () => {
      render(<PhonePage />);
      
      const editButton = screen.getByTestId('edit-1');
      fireEvent.click(editButton);
      
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      expect(mockMutate).toHaveBeenCalledWith({
        id: 1,
        data: {
          name: 'iPhone 15',
          brand: 'Apple',
          imei: '123456789',
          color: 'Blue',
          capacity: 128
        }
      });
    });
  });

  describe('Gestion de la suppression', () => {
    it('devrait supprimer un téléphone après confirmation', () => {
      window.confirm.mockReturnValue(true);
      render(<PhonePage />);
      
      const deleteButton = screen.getByTestId('delete-1');
      fireEvent.click(deleteButton);

      expect(window.confirm).toHaveBeenCalledWith('Supprimer ce téléphone ?');
      expect(mockMutate).toHaveBeenCalledWith(1);
    });

    it('ne devrait pas supprimer un téléphone si l\'utilisateur annule', () => {
      window.confirm.mockReturnValue(false);
      render(<PhonePage />);
      
      const deleteButton = screen.getByTestId('delete-1');
      fireEvent.click(deleteButton);

      expect(window.confirm).toHaveBeenCalledWith('Supprimer ce téléphone ?');
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('États de pending', () => {
    it('devrait afficher l\'état pending quand une mutation est en cours', () => {
      useCreatePhone.mockImplementation((onSuccess, onError) => ({
        ...mockCreateMutation,
        isPending: true
      }));

      render(<PhonePage />);
      
      expect(screen.getByTestId('form-pending')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeDisabled();
    });
  });

  describe('Callbacks des mutations', () => {
    it('devrait gérer le succès de création', () => {
      render(<PhonePage />);
      
      mockCreateMutation.onSuccess();

      expect(toast).toHaveBeenCalledWith('Phone ajouté avec succès', { type: 'success' });
    });

    it('devrait gérer l\'erreur de création', () => {
      render(<PhonePage />);
      
      const mockError = {
        response: { data: { error: 'IMEI déjà existant' } }
      };
      
      mockCreateMutation.onError(mockError);

      expect(toast).toHaveBeenCalledWith(
        'Erreur lors de l\'ajout du téléphone : IMEI déjà existant', 
        { type: 'error' }
      );
    });

    it('devrait gérer le succès de mise à jour', () => {
      render(<PhonePage />);
      
      mockUpdateMutation.onSuccess();

      expect(toast).toHaveBeenCalledWith('Téléphone mis à jour avec succès', { type: 'success' });
    });

    it('devrait gérer l\'erreur de mise à jour', () => {
      render(<PhonePage />);
      
      const mockError = { message: 'Erreur réseau' };
      
      mockUpdateMutation.onError(mockError);

      expect(toast).toHaveBeenCalledWith(
        'Erreur lors de la mise à jour du téléphone : Erreur réseau', 
        { type: 'error' }
      );
    });

    it('devrait gérer le succès de suppression', () => {
      render(<PhonePage />);
      
      mockDeleteMutation.onSuccess();

      expect(toast).toHaveBeenCalledWith('Téléphone supprimé avec succès', { type: 'success' });
    });

    it('devrait gérer l\'erreur de suppression', () => {
      render(<PhonePage />);
      
      const mockError = {
        response: { data: { error: 'Téléphone non trouvé' } }
      };
      
      mockDeleteMutation.onError(mockError);

      expect(toast).toHaveBeenCalledWith(
        'Erreur lors de la suppression du téléphone : Téléphone non trouvé', 
        { type: 'error' }
      );
    });
  });

  describe('Gestion des erreurs de format', () => {
    it('devrait utiliser error.message si response.data.error n\'existe pas', () => {
      render(<PhonePage />);
      
      const mockError = { message: 'Erreur générique' };
      
      mockCreateMutation.onError(mockError);

      expect(toast).toHaveBeenCalledWith(
        'Erreur lors de l\'ajout du téléphone : Erreur générique', 
        { type: 'error' }
      );
    });
  });
});
