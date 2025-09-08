import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Download, 
  Brain,
  Plus,
  Trash2,
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ResumeBuilder = () => {
  const { id } = useParams();
  const { user, apiRequest } = useAuth();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
    reset
  } = useForm({
    defaultValues: {
      title: '',
      template: 'modern',
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        summary: ''
      },
      education: [],
      experience: [],
      skills: []
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    if (id) {
      fetchResume();
    } else {
      setValue('personalInfo.firstName', user?.firstName || '');
      setValue('personalInfo.lastName', user?.lastName || '');
      setValue('personalInfo.email', user?.email || '');
      setLoading(false);
    }
  }, [id, user]);

  const fetchResume = async () => {
    try {
      const response = await apiRequest(`/api/resumes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setResume(data.data);
        reset(data.data);
      } else {
        toast.error('Failed to fetch resume');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast.error('Failed to fetch resume');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const url = id ? `/api/resumes/${id}` : '/api/resumes';
      const method = id ? 'PUT' : 'POST';
      
      const response = await apiRequest(url, {
        method,
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        if (!id) {
          navigate(`/builder/${result.data._id}`);
        }
        toast.success('Resume saved successfully!');
        setResume(result.data);
      } else {
        toast.error('Failed to save resume');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const getAISuggestions = async () => {
    setAiLoading(true);
    try {
      const response = await apiRequest('/api/ai/suggestions', {
        method: 'POST',
        body: JSON.stringify({
          resumeData: watchedValues
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestion(data.data.suggestion);
        setShowAISuggestions(true);
      } else {
        toast.error('Failed to get AI suggestions');
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast.error('Failed to get AI suggestions');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-outline flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {id ? 'Edit Resume' : 'Create New Resume'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={saving || !isDirty}
                className="btn-primary flex items-center space-x-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
              
              {id && (
                <>
                  <button
                    onClick={() => navigate(`/preview/${id}`)}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  
                  <button
                    onClick={() => navigate(`/preview/${id}`)}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Assistant</h3>
                <button
                  onClick={getAISuggestions}
                  disabled={aiLoading}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  {aiLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Brain className="w-4 h-4" />
                  )}
                  <span>{aiLoading ? 'Getting Suggestions...' : 'Get AI Suggestions'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Resume Title & Template */}
              <div className="card">
                <h2 className="section-title">Resume Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="form-label">Resume Title</label>
                    <input
                      id="title"
                      type="text"
                      className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                      placeholder="e.g., Software Engineer Resume"
                      {...register('title', { required: 'Resume title is required' })}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="template" className="form-label">Template</label>
                    <select
                      id="template"
                      className="input-field"
                      {...register('template')}
                    >
                      <option value="modern">Modern</option>
                      <option value="classic">Classic</option>
                      <option value="creative">Creative</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="card">
                <h2 className="section-title">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      className={`input-field ${errors.personalInfo?.firstName ? 'border-red-500' : ''}`}
                      {...register('personalInfo.firstName', { required: 'First name is required' })}
                    />
                    {errors.personalInfo?.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.personalInfo.firstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      className={`input-field ${errors.personalInfo?.lastName ? 'border-red-500' : ''}`}
                      {...register('personalInfo.lastName', { required: 'Last name is required' })}
                    />
                    {errors.personalInfo?.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.personalInfo.lastName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      id="email"
                      type="email"
                      className={`input-field ${errors.personalInfo?.email ? 'border-red-500' : ''}`}
                      {...register('personalInfo.email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.personalInfo?.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.personalInfo.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      className="input-field"
                      {...register('personalInfo.phone')}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="summary" className="form-label">Professional Summary</label>
                    <textarea
                      id="summary"
                      rows={4}
                      className="input-field"
                      placeholder="Write a brief professional summary highlighting your key skills and experience..."
                      {...register('personalInfo.summary')}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Keep it concise (2-3 sentences) and focus on your value proposition
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="card">
                <h2 className="section-title">Skills</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      className="input-field flex-1"
                      placeholder="Add a skill (e.g., JavaScript, React, Project Management)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const skill = e.target.value.trim();
                          if (skill) {
                            const currentSkills = watchedValues.skills || [];
                            setValue('skills', [...currentSkills, { name: skill, level: 'Intermediate' }]);
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder*="Add a skill"]');
                        const skill = input.value.trim();
                        if (skill) {
                          const currentSkills = watchedValues.skills || [];
                          setValue('skills', [...currentSkills, { name: skill, level: 'Intermediate' }]);
                          input.value = '';
                        }
                      }}
                      className="btn-primary"
                    >
                      Add
                    </button>
                  </div>
                  
                  {watchedValues.skills && watchedValues.skills.length > 0 && (
                    <div className="space-y-2">
                      {watchedValues.skills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{skill.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const currentSkills = watchedValues.skills || [];
                              setValue('skills', currentSkills.filter((_, i) => i !== index));
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* AI Suggestions Modal */}
      {showAISuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-primary-600" />
                  <span>AI Suggestions</span>
                </h3>
                <button
                  onClick={() => setShowAISuggestions(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {aiSuggestion}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowAISuggestions(false)}
                  className="btn-primary"
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
