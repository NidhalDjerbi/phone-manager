import React from "react";
import { Edit, Trash2 } from "lucide-react";

export default function ListPhones({ phones, handleEdit, handleDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700">
                IMEI
              </th>
              <th className="text-left p-4 font-semibold text-gray-700">Nom</th>
              <th className="text-left p-4 font-semibold text-gray-700">
                Marque
              </th>
              <th className="text-left p-4 font-semibold text-gray-700">
                Couleur
              </th>
              <th className="text-left p-4 font-semibold text-gray-700">
                Capacité (GO)
              </th>
              <th className="text-left p-4 font-semibold text-gray-700">
                Date de création
              </th>
              <th className="text-left p-4 font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {phones.map((phone) => (
              <tr key={phone.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono text-sm text-gray-600">
                  {phone.imei}
                </td>
                <td className="p-4 font-semibold text-gray-900">
                  {phone.name}
                </td>
                <td className="p-4 text-gray-700">{phone.brand}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white `}
                  >
                    {phone.color}
                  </span>
                </td>
                <td className="p-4 text-gray-700">{phone.capacity} GO</td>
                <td className="p-4 text-gray-600">
                  {new Date(phone.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(phone)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(phone.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
