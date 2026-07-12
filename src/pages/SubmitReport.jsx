import { useState } from 'react';
import { Camera, MapPin, Send, Users, Phone, Heart, Sparkles } from 'lucide-react';

export default function SubmitReport() {
  const [formData, setFormData] = useState({
    activityType: '',
    soulsWon: '',
    membersVisited: '',
    callsMade: '',
    location: '',
    comments: '',
    photos: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Report submitted:', formData);
    alert('Report submitted successfully!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const statsCards = [
    { icon: Heart, label: 'Souls Won', name: 'soulsWon', color: 'bg-red-500', bgColor: 'bg-red-50' },
    { icon: Users, label: 'Members Visited', name: 'membersVisited', color: 'bg-blue-500', bgColor: 'bg-blue-50' },
    { icon: Phone, label: 'Calls Made', name: 'callsMade', color: 'bg-green-500', bgColor: 'bg-green-50' },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl shadow-lg mb-4">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Ministry Report</h1>
          <p className="text-gray-500">Share your ministry activities and impact</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-gray-700 font-semibold text-sm">Activity Type</label>
                  <select
                    name="activityType"
                    value={formData.activityType}
                    onChange={handleChange}
                    className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    required
                  >
                    <option value="">Select activity type</option>
                    <option value="outreach">Outreach</option>
                    <option value="visitation">Visitation</option>
                    <option value="fellowship">Fellowship</option>
                    <option value="prayer">Prayer Meeting</option>
                    <option value="bible-study">Bible Study</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-semibold text-sm">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter location"
                      className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm">Impact Statistics</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {statsCards.map((stat) => (
                    <div key={stat.name} className="relative">
                      <stat.icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${stat.color} text-white rounded-lg p-1.5`} size={20} />
                      <input
                        type="number"
                        name={stat.name}
                        value={formData[stat.name]}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className={`w-full ${stat.bgColor} text-gray-900 pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all font-semibold`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6 bg-gray-50/50">
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm">Comments</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  placeholder="Share highlights, testimonies, or prayer requests from your ministry activity..."
                  rows={4}
                  className="w-full bg-white text-gray-900 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm">
                  Photos <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-red-500 hover:bg-red-50/50 transition-all cursor-pointer bg-white group">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-100 transition-colors">
                    <Camera size={32} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                  </div>
                  <p className="text-gray-700 font-medium mb-1">Click to upload photos</p>
                  <p className="text-gray-400 text-sm">PNG, JPG up to 10MB (Required)</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => setFormData({ ...formData, photos: e.target.files })}
                  />
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-r from-red-600 to-red-700">
              <button
                type="submit"
                className="w-full bg-white hover:bg-gray-50 text-red-600 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Send size={20} />
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
