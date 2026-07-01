import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiCalendar, FiPlus, FiClock, FiUsers, FiMapPin, FiVideo, 
  FiChevronLeft, FiChevronRight, FiEdit3, FiTrash2, FiEye
} = FiIcons;

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [showEventModal, setShowEventModal] = useState(false);

  const events = [
    {
      id: 1,
      title: 'Live Coaching Session',
      description: 'Weekly group coaching session with Lillian Adegbola',
      date: '2024-02-15',
      time: '15:00',
      duration: 60,
      type: 'webinar',
      attendees: 45,
      location: 'Zoom Meeting',
      color: 'blue'
    },
    {
      id: 2,
      title: 'Community Q&A',
      description: 'Monthly community question and answer session',
      date: '2024-02-16',
      time: '14:00',
      duration: 90,
      type: 'discussion',
      attendees: 120,
      location: 'Community Platform',
      color: 'emerald'
    },
    {
      id: 3,
      title: 'New Course Launch',
      description: 'Launch of Advanced Leadership Principles course',
      date: '2024-02-23',
      time: '10:00',
      duration: 30,
      type: 'course',
      attendees: 200,
      location: 'Learning Platform',
      color: 'purple'
    },
    {
      id: 4,
      title: 'Goal Review Workshop',
      description: 'Monthly goal setting and review workshop',
      date: '2024-02-28',
      time: '16:00',
      duration: 120,
      type: 'workshop',
      attendees: 75,
      location: 'Virtual Event',
      color: 'orange'
    }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const eventTypeIcons = {
    webinar: FiVideo,
    discussion: FiUsers,
    course: FiCalendar,
    workshop: FiClock
  };

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-navy-800">Calendar & Events</h1>
            <p className="text-gray-600 font-montserrat">Stay organized with your learning schedule</p>
          </div>
          <button
            onClick={() => setShowEventModal(true)}
            className="bg-gold-gradient text-navy-800 px-6 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            New Event
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-playfair font-bold text-navy-800">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <SafeIcon icon={FiChevronLeft} className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <SafeIcon icon={FiChevronRight} className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {['month', 'week', 'day'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-4 py-2 rounded-lg font-montserrat font-medium transition-all duration-200 ${
                        viewMode === mode
                          ? 'bg-gold-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {dayNames.map(day => (
                  <div key={day} className="p-3 text-center font-montserrat font-medium text-gray-500 text-sm">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {getDaysInMonth(currentDate).map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isSelected = day.toDateString() === selectedDate.toDateString();
                  const dayEvents = getEventsForDate(day);

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.01 }}
                      className={`min-h-[100px] p-2 border border-gray-100 cursor-pointer transition-all duration-200 ${
                        isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'
                      } ${isToday ? 'ring-2 ring-gold-500' : ''} ${isSelected ? 'bg-gold-50' : ''}`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className={`text-sm font-montserrat font-medium mb-1 ${
                        isToday ? 'text-gold-600' : isCurrentMonth ? 'text-navy-800' : 'text-gray-400'
                      }`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded bg-${event.color}-100 text-${event.color}-700 font-montserrat truncate`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 font-montserrat">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                {selectedDate.toDateString()}
              </h3>
              <div className="space-y-3">
                {getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map(event => (
                    <div key={event.id} className="p-3 bg-luxury-pearl rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <SafeIcon 
                          icon={eventTypeIcons[event.type]} 
                          className={`w-4 h-4 text-${event.color}-600`} 
                        />
                        <h4 className="font-montserrat font-medium text-navy-800 text-sm">
                          {event.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 font-montserrat mb-2">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 font-montserrat">
                        <span>{event.time} ({event.duration}min)</span>
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 font-montserrat text-sm text-center py-4">
                    No events scheduled
                  </p>
                )}
              </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 bg-luxury-pearl rounded-lg">
                    <div className={`w-8 h-8 bg-${event.color}-500 rounded-full flex items-center justify-center flex-shrink-0`}>
                      <SafeIcon icon={eventTypeIcons[event.type]} className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-montserrat font-medium text-navy-800 text-sm mb-1">
                        {event.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 font-montserrat">
                        <SafeIcon icon={FiCalendar} className="w-3 h-3" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <SafeIcon icon={FiClock} className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-montserrat text-gray-600">Total Events</span>
                  <span className="font-montserrat font-bold text-navy-800">{events.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-montserrat text-gray-600">Live Sessions</span>
                  <span className="font-montserrat font-bold text-navy-800">
                    {events.filter(e => e.type === 'webinar').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-montserrat text-gray-600">Workshops</span>
                  <span className="font-montserrat font-bold text-navy-800">
                    {events.filter(e => e.type === 'workshop').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-montserrat text-gray-600">Total Attendees</span>
                  <span className="font-montserrat font-bold text-navy-800">
                    {events.reduce((sum, e) => sum + e.attendees, 0)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;