import { useState } from 'react';
import {
  Camera,
  MapPin,
  Send,
  Users,
  Phone,
  Heart,
  Sparkles,
  Loader2,
  X,
  ShieldAlert,
  Building2,
  UserRound,
  CircleDollarSign,
  BusFront,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SubmitReport() {
  const [formData, setFormData] = useState({
    activityType: 'fellowship',
    councilName: '',
    fellowshipName: '',
    leaderName: '',
    soulsWon: '',
    membersVisited: '',
    callsMade: '',
    location: '',
    comments: '',
    busAttendance: '',
    busCost: '',
    busOffering: '',
    firstTimers: '',
  });
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);

  const isSubmissionClosed = () => {
    const now = new Date();
    const isFriday = now.getDay() === 5;
    const isAfterDeadline = now.getHours() >= 23;
    return isFriday && isAfterDeadline;
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const uploadPhotos = async () => {
    const uploadedUrls = [];

    for (const photo of photos) {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `reports/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('report-photos').upload(filePath, photo);
      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from('report-photos').getPublicUrl(filePath);
      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmissionClosed()) {
      alert('The fellowship report form closes every Friday by 23:00. Please submit before the deadline.');
      return;
    }

    setUploading(true);

    try {
      const photoUrls = photos.length > 0 ? await uploadPhotos() : [];
      const { data: { user } } = await supabase.auth.getUser();

      const reportPayload = {
        leader_id: user?.id,
        activity_type: formData.activityType,
        souls_won: Number(formData.soulsWon) || 0,
        members_visited: Number(formData.membersVisited) || 0,
        calls_made: Number(formData.callsMade) || 0,
        location: formData.location,
        comments: formData.comments || '',
        photos: photoUrls,
        council_name: formData.councilName || null,
        fellowship_name: formData.fellowshipName || null,
        leader_name: formData.leaderName || user?.email || null,
        bus_attendance: Number(formData.busAttendance) || 0,
        bus_cost: Number(formData.busCost) || 0,
        bus_offering: Number(formData.busOffering) || 0,
        first_timers: Number(formData.firstTimers) || 0,
      };

      const { error } = await supabase.from('reports').insert(reportPayload);
      if (error) throw error;

      await supabase.from('activities').insert({
        profile_id: user?.id,
        type: 'report_submitted',
        description: `Submitted a ${formData.activityType} report at ${formData.location}`,
      });

      alert('Report submitted successfully!');

      setFormData({
        activityType: 'fellowship',
        councilName: '',
        fellowshipName: '',
        leaderName: '',
        soulsWon: '',
        membersVisited: '',
        callsMade: '',
        location: '',
        comments: '',
        busAttendance: '',
        busCost: '',
        busOffering: '',
        firstTimers: '',
      });
      setPhotos([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report. Please try again.');
    } finally {
      setUploading(false);
    }
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

  const reportClosed = isSubmissionClosed();

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl shadow-lg mb-4">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fellowship Report</h1>
          <p className="text-gray-500">Submit your weekly leadership and ministry updates</p>
        </div>

        {reportClosed && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
            <ShieldAlert size={18} />
            <span>The fellowship report form is closed for Friday after 23:00. Please submit before the deadline.</span>
          </div>
        )}

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
                    <option value="fellowship">Fellowship</option>
                    <option value="sunday-busing">Sunday Busing</option>
                    <option value="midweek">Midweek</option>
                    <option value="outreach">Outreach</option>
                    <option value="visitation">Visitation</option>
                    <option value="prayer">Prayer Meeting</option>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-gray-700 font-semibold text-sm">Council Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="councilName"
                      value={formData.councilName}
                      onChange={handleChange}
                      placeholder="Mufuchani Council"
                      className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-semibold text-sm">Fellowship Name</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="fellowshipName"
                      value={formData.fellowshipName}
                      onChange={handleChange}
                      placeholder="Fellowship name"
                      className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-gray-700 font-semibold text-sm">Leader Name</label>
                  <div className="relative">
                    <UserRound className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="leaderName"
                      value={formData.leaderName}
                      onChange={handleChange}
                      placeholder="Leader name"
                      className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 font-semibold text-sm">Report Deadline</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700">
                    <ShieldAlert size={18} className="text-red-500" />
                    <span>Friday 23:00</span>
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
                        className={`w-full ${stat.bgColor} text-gray-900 pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-sm">Sunday Busing Details</label>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="relative">
                    <BusFront className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      name="busAttendance"
                      value={formData.busAttendance}
                      onChange={handleChange}
                      placeholder="Attendance"
                      className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <CircleDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      name="busCost"
                      value={formData.busCost}
                      onChange={handleChange}
                      placeholder="Bus cost"
                      className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <CircleDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      name="busOffering"
                      value={formData.busOffering}
                      onChange={handleChange}
                      placeholder="Bus offering"
                      className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      name="firstTimers"
                      value={formData.firstTimers}
                      onChange={handleChange}
                      placeholder="First timers"
                      className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    />
                  </div>
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
                  Photos <span className="text-red-500">(optional)</span>
                </label>
                <div
                  onClick={() => document.getElementById('photo-upload').click()}
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-red-500 hover:bg-red-50/50 transition-all cursor-pointer bg-white group"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-100 transition-colors">
                    <Camera size={32} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                  </div>
                  <p className="text-gray-700 font-medium mb-1">Click to upload photos</p>
                  <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
                  <input id="photo-upload" type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoChange} />
                </div>

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-xl" />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 bg-gradient-to-r from-red-600 to-red-700">
              <button
                type="submit"
                disabled={uploading || reportClosed}
                className="w-full bg-white hover:bg-gray-50 text-red-600 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    {reportClosed ? 'Reporting Closed' : 'Submit Report'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
