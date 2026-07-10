import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  parseISO
} from 'date-fns';

const { FiChevronLeft, FiChevronRight } = FiIcons;

const STATUS_DOT = {
  pending: 'bg-orange-400',
  confirmed: 'bg-green-500',
  cancelled: 'bg-red-400',
  completed: 'bg-blue-400'
};

const MAX_VISIBLE_PER_DAY = 3;

const BookingCalendarView = ({ bookings, onSelectBooking }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const bookingsByDay = (day) =>
    bookings.filter((booking) => {
      try {
        return isSameDay(parseISO(booking.appointment_date), day);
      } catch {
        return false;
      }
    });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-playfair font-bold text-navy-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous month"
          >
            <SafeIcon icon={FiChevronLeft} className="text-gray-600" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-montserrat font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next month"
          >
            <SafeIcon icon={FiChevronRight} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
          <div key={label} className="bg-gray-50 text-center py-2 text-xs font-montserrat font-semibold text-gray-500 uppercase">
            {label}
          </div>
        ))}

        {days.map((day) => {
          const dayBookings = bookingsByDay(day);
          const visible = dayBookings.slice(0, MAX_VISIBLE_PER_DAY);
          const overflow = dayBookings.length - visible.length;

          return (
            <div
              key={day.toISOString()}
              className={`bg-white min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2 ${!isSameMonth(day, currentMonth) ? 'opacity-40' : ''}`}
            >
              <div
                className={`text-xs font-montserrat font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-gold-400 text-navy-900' : 'text-gray-500'
                  }`}
              >
                {format(day, 'd')}
              </div>
              <div className="mt-1 space-y-1">
                {visible.map((booking) => (
                  <button
                    key={booking.id}
                    type="button"
                    onClick={() => onSelectBooking(booking)}
                    className="w-full text-left px-1.5 py-1 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                    title={`${booking.first_name} ${booking.last_name} - ${booking.service_name}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[booking.status] || 'bg-gray-400'}`} />
                    <span className="text-[11px] font-montserrat text-navy-800 truncate">
                      {booking.appointment_time} {booking.first_name}
                    </span>
                  </button>
                ))}
                {overflow > 0 && (
                  <div className="text-[11px] font-montserrat text-gray-400 px-1.5">
                    +{overflow} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendarView;
