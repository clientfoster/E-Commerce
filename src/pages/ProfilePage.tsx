import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit2, Save, Plus, Trash2, Home, Briefcase } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authApi, Address } from '../lib/api';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, initialize } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  // Address state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Address>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
    type: 'home',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: '', // Phone is not in main profile yet, maybe add later or ignore for now
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    // In production, update profile in backend
    console.log('Profile updated:', formData);
    setEditing(false);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        await authApi.updateAddress(editingAddressId, addressForm);
      } else {
        await authApi.addAddress(addressForm);
      }
      await initialize(); // Refresh profile to get updated addresses
      setShowAddressForm(false);
      setEditingAddressId(null);
      resetAddressForm();
    } catch (error) {
      console.error('Failed to save address:', error);
      alert('Failed to save address');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await authApi.deleteAddress(addressId);
      await initialize();
    } catch (error) {
      console.error('Failed to delete address:', error);
      alert('Failed to delete address');
    }
  };

  const startEditAddress = (address: Address) => {
    setAddressForm(address);
    setEditingAddressId(address._id || null);
    setShowAddressForm(true);
  };

  const resetAddressForm = () => {
    setAddressForm({
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false,
      type: 'home',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <p className="text-gray-600">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-gray-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {profile?.fullName || 'User'}
              </h2>
              <p className="text-gray-600 text-sm mb-4">{user.email}</p>
              {profile?.isAdmin && (
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                  Admin
                </span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Personal Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 self-start sm:self-auto"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 self-start sm:self-auto"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </div>
                    </label>
                    <input
                      type="text"
                      disabled={!editing}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </div>
                    </label>
                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Addresses */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Saved Addresses
                </h2>
                <button
                  onClick={() => {
                    resetAddressForm();
                    setEditingAddressId(null);
                    setShowAddressForm(true);
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add New
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddressSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      placeholder="Full Name"
                      value={addressForm.fullName}
                      onChange={e => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      className="px-4 py-2 border rounded-lg"
                      required
                    />
                    <input
                      placeholder="Phone"
                      value={addressForm.phone}
                      onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="px-4 py-2 border rounded-lg"
                      required
                    />
                    <input
                      placeholder="Address"
                      value={addressForm.address}
                      onChange={e => setAddressForm({ ...addressForm, address: e.target.value })}
                      className="px-4 py-2 border rounded-lg md:col-span-2"
                      required
                    />
                    <input
                      placeholder="City"
                      value={addressForm.city}
                      onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="px-4 py-2 border rounded-lg"
                      required
                    />
                    <input
                      placeholder="State"
                      value={addressForm.state}
                      onChange={e => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="px-4 py-2 border rounded-lg"
                      required
                    />
                    <input
                      placeholder="ZIP Code"
                      value={addressForm.zipCode}
                      onChange={e => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                      className="px-4 py-2 border rounded-lg"
                      required
                    />
                    <input
                      placeholder="Country"
                      value={addressForm.country}
                      onChange={e => setAddressForm({ ...addressForm, country: e.target.value })}
                      className="px-4 py-2 border rounded-lg"
                      required
                    />
                    <select
                      value={addressForm.type}
                      onChange={e => setAddressForm({ ...addressForm, type: e.target.value as any })}
                      className="px-4 py-2 border rounded-lg"
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={addressForm.isDefault}
                      onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    />
                    <label htmlFor="isDefault">Set as default address</label>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg">
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile?.addresses?.map((addr) => (
                  <div key={addr._id} className="border border-gray-200 rounded-lg p-4 relative hover:border-gray-900 transition-colors">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => startEditAddress(addr)} className="text-gray-400 hover:text-gray-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => addr._id && handleDeleteAddress(addr._id)} className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {addr.type === 'home' && <Home className="w-4 h-4 text-gray-500" />}
                      {addr.type === 'work' && <Briefcase className="w-4 h-4 text-gray-500" />}
                      {addr.type === 'other' && <MapPin className="w-4 h-4 text-gray-500" />}
                      <span className="font-medium capitalize">{addr.type}</span>
                      {addr.isDefault && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Default</span>
                      )}
                    </div>
                    <p className="font-medium">{addr.fullName}</p>
                    <p className="text-gray-600 text-sm">{addr.address}</p>
                    <p className="text-gray-600 text-sm">{addr.city}, {addr.state} {addr.zipCode}</p>
                    <p className="text-gray-600 text-sm">{addr.country}</p>
                    <p className="text-gray-600 text-sm mt-1">{addr.phone}</p>
                  </div>
                ))}
                {(!profile?.addresses || profile.addresses.length === 0) && (
                  <div className="col-span-full text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    No addresses saved yet.
                  </div>
                )}
              </div>
            </div>

            {/* Gift Cards Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Gift Cards</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 mb-4">View and manage your gift cards</p>
                <button
                  onClick={() => navigate('/gift-cards')}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View Gift Cards
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
