import React, { useState, useEffect } from 'react';
import supabase from '../../../lib/supabase';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiSearch, FiImage } = FiIcons;

const CoursesManager = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);

    const emptyCourse = {
        title: '',
        description: '',
        category: 'business',
        instructor: 'Lilian Adegbola',
        price: 0,
        original_price: 0,
        duration: '',
        lessons_count: 0,
        level: 'Beginner',
        image_url: '',
        is_featured: false
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('courses_la2024')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCourses(data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentCourse.id) {
                const { error } = await supabase
                    .from('courses_la2024')
                    .update(currentCourse)
                    .eq('id', currentCourse.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('courses_la2024')
                    .insert([currentCourse]);
                if (error) throw error;
            }
            fetchCourses();
            setIsEditing(false);
            setCurrentCourse(null);
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Error saving course');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        try {
            const { error } = await supabase
                .from('courses_la2024')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-playfair font-bold text-navy-900">Courses Manager</h1>
                <button
                    onClick={() => {
                        setCurrentCourse(emptyCourse);
                        setIsEditing(true);
                    }}
                    className="bg-gold-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gold-600 transition-colors"
                >
                    <SafeIcon icon={FiPlus} className="w-5 h-5" />
                    Add Course
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="relative">
                    <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                </div>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <div className="h-48 bg-gray-200 relative">
                                {course.image_url ? (
                                    <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <SafeIcon icon={FiImage} className="w-8 h-8" />
                                    </div>
                                )}
                                {course.is_featured && (
                                    <span className="absolute top-2 right-2 bg-gold-500 text-white text-xs px-2 py-1 rounded">Featured</span>
                                )}
                            </div>
                            <div className="p-4 flex-1">
                                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="font-bold">₦{course.price}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setCurrentCourse(course);
                                                setIsEditing(true);
                                            }}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <SafeIcon icon={FiEdit2} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <SafeIcon icon={FiTrash2} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{currentCourse.id ? 'Edit Course' : 'New Course'}</h2>
                            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                                <SafeIcon icon={FiX} className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={currentCourse.title}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, title: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        value={currentCourse.description}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
                                        className="w-full border rounded-lg p-2 h-24"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Price (₦)</label>
                                    <input
                                        type="number"
                                        value={currentCourse.price}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, price: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Original Price (₦)</label>
                                    <input
                                        type="number"
                                        value={currentCourse.original_price}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, original_price: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Duration</label>
                                    <input
                                        type="text"
                                        value={currentCourse.duration}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, duration: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                        placeholder="e.g. 8 hours"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Lessons Count</label>
                                    <input
                                        type="number"
                                        value={currentCourse.lessons_count}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, lessons_count: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Level</label>
                                    <select
                                        value={currentCourse.level}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, level: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    >
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <select
                                        value={currentCourse.category}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, category: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    >
                                        <option value="business">Business</option>
                                        <option value="personal">Personal Development</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="leadership">Leadership</option>
                                    </select>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        value={currentCourse.image_url}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, image_url: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>

                                <div className="col-span-2 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={currentCourse.is_featured}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, is_featured: e.target.checked })}
                                        id="is_featured"
                                    />
                                    <label htmlFor="is_featured" className="text-sm font-medium">Featured Course</label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600"
                                >
                                    Save Course
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursesManager;
