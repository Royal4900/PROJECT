import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  FileText, 
  Edit, 
  Eye, 
  Download, 
  Copy, 
  Trash2, 
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user, apiRequest } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await apiRequest('/api/resumes');
      if (response.ok) {
        const data = await response.json();
        setResumes(data.data);
      } else {
        toast.error('Failed to fetch resumes');
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await apiRequest(`/api/resumes/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setResumes(resumes.filter(resume => resume._id !== id));
        toast.success('Resume deleted successfully');
      } else {
        toast.error('Failed to delete resume');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const response = await apiRequest(`/api/resumes/${id}/duplicate`, { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setResumes([data.data, ...resumes]);
        toast.success('Resume duplicated successfully');
      } else {
        toast.error('Failed to duplicate resume');
      }
    } catch (error) {
      console.error('Error duplicating resume:', error);
      toast.error('Failed to duplicate resume');
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await apiRequest(`/api/resumes/${id}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Resume downloaded successfully');
      } else {
        toast.error('Failed to download resume');
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.firstName}! 👋
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your resumes and create new ones with AI assistance
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                to="/builder"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Resume</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{resumes.length}</div>
            <div className="text-sm text-gray-600">Total Resumes</div>
          </div>
          
          <div className="card text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {resumes.filter(r => r.isPublic).length}
            </div>
            <div className="text-sm text-gray-600">Public Resumes</div>
          </div>
          
          <div className="card text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {resumes.length > 0 ? formatDate(resumes[0].createdAt) : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Latest Created</div>
          </div>
          
          <div className="card text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {resumes.length > 0 ? formatDate(resumes[0].lastModified) : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Last Modified</div>
          </div>
        </div>

        {/* Resumes List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Resumes</h2>
            {resumes.length > 0 && (
              <span className="text-sm text-gray-500">
                {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {resumes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No resumes yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first resume to get started with your job search
              </p>
              <Link
                to="/builder"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Resume</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {resume.title}
                        </h3>
                        {resume.isPublic && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Public
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created: {formatDate(resume.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Modified: {formatDate(resume.lastModified)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>Template: {resume.template}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/builder/${resume._id}`)}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
                        title="Edit resume"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => navigate(`/preview/${resume._id}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        title="Preview resume"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => handleDownload(resume._id)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                        title="Download PDF"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => handleDuplicate(resume._id)}
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                        title="Duplicate resume"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(resume._id)}
                        disabled={deletingId === resume._id}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                        title="Delete resume"
                      >
                        {deletingId === resume._id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
