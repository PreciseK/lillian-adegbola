import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../../lib/supabase';

const {
  FiTarget, FiPlus, FiEdit3, FiTrash2, FiCalendar, FiClock,
  FiCheckCircle, FiCircle, FiTrendingUp, FiAward, FiFlag,
  FiBarChart, FiMoreHorizontal, FiFilter
} = FiIcons;

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    targetDate: '',
    milestones: []
  });

  const categories = [
    { id: 'all', name: 'All Goals', color: 'gray' },
    { id: 'personal', name: 'Personal', color: 'blue' },
    { id: 'career', name: 'Career', color: 'purple' },
    { id: 'learning', name: 'Learning', color: 'emerald' },
    { id: 'health', name: 'Health', color: 'red' }
  ];

  const priorityColors = {
    low: 'text-gray-600 bg-gray-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-red-600 bg-red-100'
  };

  useEffect(() => {
    fetchUserAndGoals();
  }, []);

  const fetchUserAndGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('goals_la2024')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        // Parse milestones if they are stored as JSON stirng, usually supabase returns JSON object directly for jsonb
        setGoals(data || []);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGoals = goals.filter(goal =>
    selectedCategory === 'all' || goal.category === selectedCategory
  );

  const handleCreateGoal = async () => {
    if (!user) return alert('Please sign in to create goals');

    try {
      const goalData = {
        user_id: user.id,
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        priority: newGoal.priority,
        target_date: newGoal.targetDate,
        milestones: newGoal.milestones.map((m, i) => ({ id: i + 1, title: m, completed: false })),
        progress: 0,
        status: 'in-progress'
      };

      const { data, error } = await supabase
        .from('goals_la2024')
        .insert([goalData])
        .select()
        .single();

      if (error) throw error;

      setGoals([data, ...goals]);
      setNewGoal({
        title: '',
        description: '',
        category: 'personal',
        priority: 'medium',
        targetDate: '',
        milestones: []
      });
      setShowNewGoalModal(false);
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Failed to create goal');
    }
  };

  const updateGoalProgress = (goalId, progress) => {
    setGoals(goals.map(goal =>
      goal.id === goalId ? { ...goal, progress } : goal
    ));
  };

  const toggleMilestone = (goalId, milestoneId) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone =>
          milestone.id === milestoneId
            ? { ...milestone, completed: !milestone.completed }
            : milestone
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        return { ...goal, milestones: updatedMilestones, progress };
      }
      return goal;
    }));
  };

  const stats = [
    {
      title: 'Active Goals',
      value: goals.filter(g => g.status === 'in-progress').length,
      icon: FiTarget,
      color: 'blue'
    },
    {
      title: 'Completed Goals',
      value: goals.filter(g => g.status === 'completed').length,
      icon: FiCheckCircle,
      color: 'emerald'
    },
    {
      title: 'Average Progress',
      value: `${Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)}%`,
      icon: FiTrendingUp,
      color: 'purple'
    },
    {
      title: 'This Month',
      value: goals.filter(g => new Date(g.targetDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length,
      icon: FiCalendar,
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-navy-800">Goals & Objectives</h1>
            <p className="text-gray-600 font-montserrat">Track your progress and achieve your dreams</p>
          </div>
          <button
            onClick={() => setShowNewGoalModal(true)}
            className="bg-gold-gradient text-navy-800 px-6 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            New Goal
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-500 rounded-lg flex items-center justify-center`}>
                  <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-2xl font-playfair font-bold text-navy-800 mb-1">{stat.value}</p>
              <p className="text-sm font-montserrat text-gray-600">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center space-x-4 mb-4">
            <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-400" />
            <span className="font-montserrat font-medium text-navy-800">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-montserrat font-medium transition-all duration-200 ${selectedCategory === category.id
                    ? `bg-${category.color}-500 text-white`
                    : `bg-${category.color}-100 text-${category.color}-700 hover:bg-${category.color}-200`
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Goals List */}
        <div className="space-y-6">
          {filteredGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-playfair font-bold text-navy-800">{goal.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-medium ${priorityColors[goal.priority]}`}>
                      {goal.priority}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-montserrat font-medium bg-blue-100 text-blue-700">
                      {goal.category}
                    </span>
                  </div>
                  <p className="text-gray-600 font-montserrat mb-3">{goal.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 font-montserrat">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiFlag} className="w-4 h-4" />
                      <span>{goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-montserrat text-gray-600">Progress</span>
                  <span className="text-sm font-montserrat font-medium text-navy-800">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gold-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h4 className="font-montserrat font-medium text-navy-800 mb-3">Milestones</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {goal.milestones.map(milestone => (
                    <div
                      key={milestone.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => toggleMilestone(goal.id, milestone.id)}
                    >
                      <SafeIcon
                        icon={milestone.completed ? FiCheckCircle : FiCircle}
                        className={`w-5 h-5 ${milestone.completed ? 'text-emerald-500' : 'text-gray-400'}`}
                      />
                      <span className={`font-montserrat text-sm ${milestone.completed ? 'text-gray-500 line-through' : 'text-navy-800'}`}>
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* New Goal Modal */}
      {showNewGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-playfair font-bold text-navy-800">Create New Goal</h2>
              <button
                onClick={() => setShowNewGoalModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <SafeIcon icon={FiPlus} className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                  placeholder="Enter your goal title"
                />
              </div>

              <div>
                <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                  placeholder="Describe your goal in detail"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                  >
                    <option value="personal">Personal</option>
                    <option value="career">Career</option>
                    <option value="learning">Learning</option>
                    <option value="health">Health</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">Priority</label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">Target Date</label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowNewGoalModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-montserrat font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGoal}
                  className="px-6 py-2 bg-gold-gradient text-navy-800 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300"
                >
                  Create Goal
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Goals;