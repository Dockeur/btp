import React, { useState, useEffect } from 'react';
import { Trash2, User, Calendar, Clock, Mail, X, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { getAppointments, updateAppointmentStatus, deleteAppointment } from 'src/services/appointmentService';

// Uniquement deux niveaux de statut
type AppointmentStatus = 'In pending' | 'Done';

interface Product {
  id: number;
  reference: string;
  description: string;
  productable: {
    land_title?: string;
    images: string[];
  };
}

interface User {
  id: number;
  email: string;
  profile: string;
}

interface Appointment {
  id: number;
  day: string;
  hour: string;
  status: AppointmentStatus;
  user: User;
  product: Product;
}

const AdminAppointmentsTable: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; appointmentId: number | null; appointmentName: string }>({
    isOpen: false,
    appointmentId: null,
    appointmentName: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAppointments();
      const data = response.data || response;
      setAppointments(data);
    } catch (err: any) {
      setError('Erreur lors du chargement des rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number): Promise<void> => {
    const appointment = appointments.find(apt => apt.id === id);
    // On ne change le statut que s'il est en attente
    if (!appointment || appointment.status === 'Done') return;

    const newStatus: AppointmentStatus = 'Done';
    
    try {
      // Mise à jour optimiste
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: newStatus } : apt
      ));

      await updateAppointmentStatus(id, newStatus);
    } catch (err: any) {
      // Rollback en cas d'erreur
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: 'In pending' } : apt
      ));
      alert('Erreur lors de la validation du rendez-vous');
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await deleteAppointment(id);
      setAppointments(appointments.filter(apt => apt.id !== id));
      closeDeleteModal();
    } catch (err: any) {
      alert('Erreur lors de la suppression');
    }
  };

  const openDeleteModal = (id: number, name: string) => setDeleteModal({ isOpen: true, appointmentId: id, appointmentName: name });
  const closeDeleteModal = () => setDeleteModal({ isOpen: false, appointmentId: null, appointmentName: '' });

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'In pending').length,
    done: appointments.filter(a => a.status === 'Done').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Rendez-vous</h1>
          <p className="text-gray-600">Passez les rendez-vous de "En attente" à "Terminé"</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium mb-1">Total</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-yellow-100">
            <div className="text-yellow-700 text-sm font-medium mb-1">En attente (Pending)</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-100">
            <div className="text-green-700 text-sm font-medium mb-1">Terminés (Done)</div>
            <div className="text-3xl font-bold text-green-600">{stats.done}</div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Date & Heure</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Bien Immobilier</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={apt.user.profile} 
                            className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                            onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + apt.user.email; }}
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{apt.user.email.split('@')[0]}</div>
                            <div className="text-xs text-gray-500">{apt.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center"><Calendar className="w-3.5 h-3.5 mr-2 text-gray-400" />{new Date(apt.day).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500 flex items-center"><Clock className="w-3.5 h-3.5 mr-2 text-gray-400" />{apt.hour}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium text-gray-800">{apt.product.productable.land_title || 'Sans titre'}</div>
                        <div className="text-xs text-gray-400">Réf: {apt.product.reference}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleStatusChange(apt.id)}
                          disabled={apt.status === 'Done'}
                          className={`
                            px-4 py-1.5 rounded-full text-xs font-bold transition-all
                            ${apt.status === 'Done' 
                              ? 'bg-green-100 text-green-700 cursor-default flex items-center mx-auto' 
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 active:scale-95'}
                          `}
                        >
                          {apt.status === 'Done' ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Terminé</>
                          ) : (
                            'Marquer comme Terminé'
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => openDeleteModal(apt.id, apt.user.email)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Suppression (Simplifié) */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Supprimer le rendez-vous ?</h3>
            <p className="text-gray-500 text-sm mb-6">Cette action pour <strong>{deleteModal.appointmentName}</strong> est définitive.</p>
            <div className="flex space-x-3">
              <button onClick={closeDeleteModal} className="flex-1 py-2 text-gray-600 bg-gray-100 rounded-lg font-medium">Annuler</button>
              <button onClick={() => deleteModal.appointmentId && handleDelete(deleteModal.appointmentId)} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointmentsTable;