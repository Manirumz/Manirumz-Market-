import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../i18n/translations';
import { Store, Plus, Package, Coins, Trash2, Truck, Layers, Upload, Loader2 } from 'lucide-react';
import { Category, OrderStatus, Product } from '../../types';
import { uploadProductImage } from '../../lib/firebase';

export const SellerDashboard: React.FC = () => {
  const { 
    user, 
    products, 
    orders, 
    addProduct, 
    deleteProduct, 
    updateOrderStatus, 
    language 
  } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [titleHa, setTitleHa] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionHa, setDescriptionHa] = useState('');
  const [category, setCategory] = useState<Category>('electronics');
  const [pricePi, setPricePi] = useState('1.5');
  const [priceUsd, setPriceUsd] = useState('450');
  const [stock, setStock] = useState('10');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80');

  const myProducts = products.filter(p => p.sellerId === user?.uid || true);
  const myOrders = orders;

  const totalSalesPi = myOrders.reduce((acc, o) => acc + o.totalPi, 0);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const uploadedUrl = await uploadProductImage(file);
      setImageUrl(uploadedUrl);
    } catch (err) {
      console.error("Storage upload failed, fallback to URL:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addProduct({
      sellerId: user?.uid || 'seller1',
      sellerName: user?.displayName || 'Manirumz Seller',
      title,
      titleHa,
      description,
      descriptionHa,
      category,
      pricePi: parseFloat(pricePi) || 1,
      priceUsd: parseFloat(priceUsd) || 300,
      stock: parseInt(stock) || 10,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      isFeatured: true
    });

    setShowAddForm(false);
    setTitle('');
    setTitleHa('');
    setDescription('');
    setDescriptionHa('');
  };


  return (
    <div className="space-y-6">
      {/* Seller Header Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#FF6321] text-xs font-black uppercase tracking-widest mb-1">
            <Store className="w-4 h-4" />
            <span>{getTranslation(language, 'sellerDashboard')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">{user?.storeName || 'Manirumz Electronics & Pi Hardware'}</h2>
          <p className="text-xs text-zinc-400 mt-1 font-medium">Manage listings, accept Pi orders and track store earnings.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Total Sales (Pi)</p>
            <p className="text-xl font-black text-[#FF6321] flex items-center gap-1 font-mono mt-0.5">
              <Coins className="w-5 h-5" />
              <span>{totalSalesPi.toFixed(2)} π</span>
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-3 rounded-2xl bg-[#FF6321] hover:bg-white text-black font-black text-xs uppercase tracking-wider shadow-xl transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{getTranslation(language, 'addProduct')}</span>
          </button>
        </div>
      </div>

      {/* Add Product Form Modal / Section */}
      {showAddForm && (
        <form onSubmit={handleProductSubmit} className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-[#FF6321]/40 space-y-4 shadow-2xl">
          <h3 className="font-black text-base uppercase tracking-tight text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-[#FF6321]" />
            <span>{getTranslation(language, 'addProduct')}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">{getTranslation(language, 'productTitle')}</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Samsung Galaxy S24 Ultra"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">{getTranslation(language, 'productTitleHa')}</label>
              <input
                type="text"
                value={titleHa}
                onChange={(e) => setTitleHa(e.target.value)}
                placeholder="Galaxy S24 Ultra na Asali"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">{getTranslation(language, 'categories')}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6321]"
              >
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion & Clothing</option>
                <option value="phones">Phones & Tablets</option>
                <option value="automotive">Vehicles & Parts</option>
                <option value="groceries">Food & Groceries</option>
                <option value="services">Digital Services</option>
                <option value="art">Arts & Crafts</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">{getTranslation(language, 'pricePi')}</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={pricePi}
                  onChange={(e) => setPricePi(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF6321]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">{getTranslation(language, 'priceUsd')}</label>
                <input
                  type="number"
                  required
                  value={priceUsd}
                  onChange={(e) => setPriceUsd(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF6321]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">{getTranslation(language, 'stockQty')}</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF6321]"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400">{getTranslation(language, 'imageUrl')}</label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6321]"
                />
                <label className="w-full sm:w-auto shrink-0 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 border border-zinc-700 transition-colors">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#FF6321]" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-[#FF6321]" />
                      <span>Upload File to Firebase Storage</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" disabled={isUploading} />
                </label>
              </div>
              {imageUrl && (
                <div className="flex items-center gap-3 pt-1">
                  <img src={imageUrl} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-zinc-800 shrink-0" />
                  <p className="text-[10px] text-zinc-400 font-mono truncate">Storage / Image URL ready</p>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">{getTranslation(language, 'description')}</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6321]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-black uppercase tracking-wider text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FF6321] hover:bg-white text-black text-xs font-black uppercase tracking-wider transition-colors"
            >
              Publish Product
            </button>
          </div>
        </form>
      )}

      {/* Received Orders Section */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8">
        <h3 className="text-base font-black uppercase tracking-tight text-white mb-6 flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#FF6321]" />
          <span>Received Orders ({myOrders.length})</span>
        </h3>

        <div className="space-y-3">
          {myOrders.map((o) => (
            <div key={o.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="font-mono font-black text-xs text-white">Order #{o.id} • Customer: {o.customerName}</p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Total: <strong className="text-[#FF6321] font-mono">{o.totalPi} π (${o.totalUsd})</strong> via {o.paymentMethod}
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Address: {o.shippingAddress}</p>
              </div>

              {/* Status Updater Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Update Status:</span>
                {(['processing', 'shipped', 'delivered'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => updateOrderStatus(o.id, st)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors ${
                      o.status === st
                        ? 'bg-[#FF6321] text-black'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Catalog Management */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8">
        <h3 className="text-base font-black uppercase tracking-tight text-white mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#FF6321]" />
          <span>Store Inventory ({myProducts.length})</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-500 uppercase font-black tracking-wider">
                <th className="py-3 px-3">Item</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price (Pi)</th>
                <th className="py-3 px-3">Stock</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {myProducts.map((p) => (
                <tr key={p.id}>
                  <td className="py-3.5 px-3 flex items-center gap-3">
                    <img src={p.imageUrl} alt={p.title} className="w-10 h-10 object-cover rounded-xl shrink-0" />
                    <span className="font-extrabold text-white line-clamp-1 uppercase tracking-tight">{p.title}</span>
                  </td>
                  <td className="py-3.5 px-3 capitalize text-zinc-400 font-medium">{p.category}</td>
                  <td className="py-3.5 px-3 font-black text-[#FF6321] font-mono">{p.pricePi} π</td>
                  <td className="py-3.5 px-3 font-mono text-zinc-300">{p.stock} units</td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
