import { useState } from 'react';
import { Camera, MapPin, Send } from 'lucide-react';

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

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Ministry Report</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Activity Type</label>
              <select
                name="activityType"
                value={formData.activityType}
                onChange={handleChange}
                className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
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

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  className="w-full bg-gray-50 text-gray-900 pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Souls Won</label>
              <input
                type="number"
                name="soulsWon"
                value={formData.soulsWon}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Members Visited</label>
              <input
                type="number"
                name="membersVisited"
                value={formData.membersVisited}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Calls Made</label>
              <input
                type="number"
                name="callsMade"
                value={formData.callsMade}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Add any additional details about your ministry activity..."
              rows={4}
              className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Photos <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer bg-gray-50">
              <Camera size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Click to upload photos</p>
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

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <Send size={20} />
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}
