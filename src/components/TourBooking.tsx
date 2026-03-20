import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Clock, Loader2 } from 'lucide-react';
import { createAppointment } from '@/services/Appointments';


interface DateOption {
  day: string;
  date: string;
  full: string;
}

// Ajout de l'interface pour les Props
interface TourBookingProps {
  productId: string | number;
}

export default function TourBooking({ productId }: TourBookingProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('11:00');
  const [dateOffset, setDateOffset] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateDates = (offset: number): DateOption[] => {
    const dates: DateOption[] = [];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + offset + i);
      const days = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      dates.push({
        day: days[date.getDay()],
        date: `${date.getDate()} ${months[date.getMonth()]}`,
        full: date.toISOString().split('T')[0]
      });
    }
    return dates;
  };

  const dates = generateDates(dateOffset);

  const handleConfirm = async (): Promise<void> => {
    if (!selectedDate) {
      alert('Veuillez sélectionner une date');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        product_id: productId,
        day: selectedDate,
        hour: selectedTime,
      };
        console.log(payload);
        
      await createAppointment(payload);
      alert(`Demande envoyée ! Rendez-vous enregistré pour le ${selectedDate} à ${selectedTime}`);
    } catch (error) {
      console.error("Erreur rdv:", error);
      alert("Une erreur est survenue lors de la réservation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mt-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <CalendarDays className="text-blue-600" />
          Planifier une visite
        </h2>
        
        <div className="flex items-center gap-1 mb-8">
          <button 
            onClick={() => setDateOffset(Math.max(0, dateOffset - 4))}
            disabled={dateOffset === 0}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="grid grid-cols-4 gap-2 flex-1">
            {dates.map((date, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedDate(date.full)}
                className={`py-3 rounded-xl transition-all text-center border-2 ${
                  selectedDate === date.full
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-transparent bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`text-[10px] font-bold uppercase ${selectedDate === date.full ? 'text-blue-600' : 'text-gray-400'}`}>
                  {date.day}
                </div>
                <div className="text-sm font-bold text-gray-800">{date.date.split(' ')[0]}</div>
                <div className="text-[10px] text-gray-500">{date.date.split(' ')[1]}</div>
              </button>
            ))}
          </div>

          <button 
            onClick={() => setDateOffset(dateOffset + 4)}
            className="p-2 rounded-full hover:bg-gray-100 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-8">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <Clock className="w-4 h-4 text-blue-600" />
            Heure disponible
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-700 transition-all cursor-pointer"
          >
            <option value="09:00">09:00 am</option>
            <option value="10:00">10:00 am</option>
            <option value="11:00">11:00 am</option>
            <option value="14:00">02:00 pm</option>
            <option value="16:00">04:00 pm</option>
          </select>
        </div>

        <button
          onClick={handleConfirm}
          disabled={isSubmitting || !selectedDate}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:bg-gray-400 disabled:shadow-none flex justify-center items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
          {isSubmitting ? 'Envoi en cours...' : 'Confirmer la date et l\'heure'}
        </button>
      </div>
    </div>
  );
}