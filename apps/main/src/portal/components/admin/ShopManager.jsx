import React, { useState, useEffect } from 'react';
import supabase from '../../../lib/supabase';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiSearch, FiImage, FiShoppingBag } = FiIcons;

const ShopManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const emptyProduct = {
        name: '',
        description: '',
        category: 'books',
        price: 0,
        original_price: 0,
        image_url: '',
        is_bestseller: false,
        in_stock: true
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products_la2024')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentProduct.id) {
                const { error } = await supabase
                    .from('products_la2024')
                    .update(currentProduct)
                    .eq('id', currentProduct.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products_la2024')
                    .insert([currentProduct]);
                if (error) throw error;
            }
            fetchProducts();
            setIsEditing(false);
            setCurrentProduct(null);
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const { error } = await supabase
                .from('products_la2024')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-playfair font-bold text-navy-900">Shop Manager</h1>
                <button
                    onClick={() => {
                        setCurrentProduct(emptyProduct);
                        setIsEditing(true);
                    }}
                    className="bg-gold-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gold-600 transition-colors"
                >
                    <SafeIcon icon={FiPlus} className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="relative">
                    <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                </div>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <div className="h-48 bg-gray-200 relative">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <SafeIcon icon={FiShoppingBag} className="w-8 h-8" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-1">
                                    {product.is_bestseller && (
                                        <span className="bg-gold-500 text-white text-xs px-2 py-1 rounded">Best Seller</span>
                                    )}
                                    {!product.in_stock && (
                                        <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">Out of Stock</span>
                                    )}
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-2 capitalize">{product.category}</p>
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="font-bold">₦{product.price}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setCurrentProduct(product);
                                                setIsEditing(true);
                                            }}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <SafeIcon icon={FiEdit2} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
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
                            <h2 className="text-xl font-bold">{currentProduct.id ? 'Edit Product' : 'New Product'}</h2>
                            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                                <SafeIcon icon={FiX} className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    value={currentProduct.name}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                    className="w-full border rounded-lg p-2"
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={currentProduct.description}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                    className="w-full border rounded-lg p-2 h-24"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price (₦)</label>
                                    <input
                                        type="number"
                                        value={currentProduct.price}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Original Price (₦)</label>
                                    <input
                                        type="number"
                                        value={currentProduct.original_price}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, original_price: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <select
                                        value={currentProduct.category}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    >
                                        <option value="books">Books</option>
                                        <option value="planners">Planners</option>
                                        <option value="accessories">Accessories</option>
                                        <option value="apparel">Apparel</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={currentProduct.image_url}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, image_url: e.target.value })}
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>

                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={currentProduct.is_bestseller}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, is_bestseller: e.target.checked })}
                                        id="is_bestseller"
                                    />
                                    <label htmlFor="is_bestseller" className="text-sm font-medium">Bestseller</label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={currentProduct.in_stock}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, in_stock: e.target.checked })}
                                        id="in_stock"
                                    />
                                    <label htmlFor="in_stock" className="text-sm font-medium">In Stock</label>
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
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopManager;
