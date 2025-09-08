import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Edit,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ResumePreview = () => {
  const { id } = useParams();
  const { user, apiRequest } = useAuth();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContactInfo, setShowContactInfo] = useState(true);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const response = await apiRequest(`/api/resumes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setResume(data.data);
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

  const handleDownload = async () => {
    try {
      const response = await apiRequest(`/api/resumes/${id}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resume.title || 'resume'}.pdf`;
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

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resume not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 print-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-outline flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {resume.title}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowContactInfo(!showContactInfo)}
                className="btn-outline flex items-center space-x-2"
              >
                {showContactInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showContactInfo ? 'Hide' : 'Show'} Contact Info</span>
              </button>
              
              <button
                onClick={() => navigate(`/builder/${id}`)}
                className="btn-outline flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              
              <button
                onClick={handleDownload}
                className="btn-outline flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              
              <button
                onClick={handlePrint}
                className="btn-primary flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Resume Content */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
          <div className="p-8 print:p-6">
            {/* Header */}
            <div className="text-center mb-8 print:mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 print:text-2xl">
                {resume.personalInfo.firstName} {resume.personalInfo.lastName}
              </h1>
              
              {showContactInfo && (
                <div className="space-y-1 text-gray-600 print:text-sm">
                  {resume.personalInfo.email && (
                    <p>{resume.personalInfo.email}</p>
                  )}
                  {resume.personalInfo.phone && (
                    <p>{resume.personalInfo.phone}</p>
                  )}
                  {resume.personalInfo.address && (
                    <p>
                      {resume.personalInfo.address}
                      {resume.personalInfo.city && `, ${resume.personalInfo.city}`}
                      {resume.personalInfo.state && `, ${resume.personalInfo.state}`}
                      {resume.personalInfo.zipCode && ` ${resume.personalInfo.zipCode}`}
                    </p>
                  )}
                  <div className="flex justify-center space-x-4 pt-2">
                    {resume.personalInfo.linkedin && (
                      <a href={resume.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 print:text-primary-600">
                        LinkedIn
                      </a>
                    )}
                    {resume.personalInfo.github && (
                      <a href={resume.personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 print:text-primary-600">
                        GitHub
                      </a>
                    )}
                    {resume.personalInfo.portfolio && (
                      <a href={resume.personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 print:text-primary-600">
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            {resume.personalInfo.summary && (
              <div className="mb-8 print:mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 print:text-lg print:mb-2 border-b border-gray-300 pb-2">
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed print:text-sm">
                  {resume.personalInfo.summary}
                </p>
              </div>
            )}

            {/* Experience */}
            {resume.experience && resume.experience.length > 0 && (
              <div className="mb-8 print:mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 print:text-lg print:mb-3 border-b border-gray-300 pb-2">
                  Professional Experience
                </h2>
                <div className="space-y-6 print:space-y-4">
                  {resume.experience.map((exp, index) => (
                    <div key={index} className="print:break-inside-avoid">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 print:text-base">
                          {exp.position}
                        </h3>
                        <span className="text-sm text-gray-600 print:text-xs">
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p className="text-primary-600 font-medium mb-2 print:text-sm">
                        {exp.company}
                      </p>
                      <p className="text-gray-700 mb-3 print:text-sm">
                        {exp.description}
                      </p>
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 print:text-sm">
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx} className="text-gray-700">
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resume.education && resume.education.length > 0 && (
              <div className="mb-8 print:mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 print:text-lg print:mb-3 border-b border-gray-300 pb-2">
                  Education
                </h2>
                <div className="space-y-4 print:space-y-3">
                  {resume.education.map((edu, index) => (
                    <div key={index} className="print:break-inside-avoid">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 print:text-base">
                            {edu.degree} in {edu.field}
                          </h3>
                          <p className="text-primary-600 font-medium print:text-sm">
                            {edu.institution}
                          </p>
                        </div>
                        <span className="text-sm text-gray-600 print:text-xs">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </span>
                      </div>
                      {edu.gpa && (
                        <p className="text-gray-700 mt-1 print:text-sm">
                          GPA: {edu.gpa}
                        </p>
                      )}
                      {edu.description && (
                        <p className="text-gray-700 mt-2 print:text-sm">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resume.skills && resume.skills.length > 0 && (
              <div className="mb-8 print:mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 print:text-lg print:mb-3 border-b border-gray-300 pb-2">
                  Skills
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 print:grid-cols-2 print:gap-2">
                  {resume.skills.map((skill, index) => (
                    <div key={index} className="print:break-inside-avoid">
                      <span className="font-medium text-gray-900 print:text-sm">
                        {skill.name}
                      </span>
                      <span className="text-gray-600 print:text-xs">
                        {' '}({skill.level})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resume.projects && resume.projects.length > 0 && (
              <div className="mb-8 print:mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 print:text-lg print:mb-3 border-b border-gray-300 pb-2">
                  Projects
                </h2>
                <div className="space-y-4 print:space-y-3">
                  {resume.projects.map((project, index) => (
                    <div key={index} className="print:break-inside-avoid">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 print:text-base">
                        {project.name}
                      </h3>
                      <p className="text-gray-700 mb-2 print:text-sm">
                        {project.description}
                      </p>
                      {project.technologies && project.technologies.length > 0 && (
                        <p className="text-sm text-gray-600 print:text-xs">
                          <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {resume.certifications && resume.certifications.length > 0 && (
              <div className="mb-8 print:mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 print:text-lg print:mb-3 border-b border-gray-300 pb-2">
                  Certifications
                </h2>
                <div className="space-y-3 print:space-y-2">
                  {resume.certifications.map((cert, index) => (
                    <div key={index} className="print:break-inside-avoid">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900 print:text-sm">
                            {cert.name}
                          </h3>
                          <p className="text-primary-600 print:text-xs">
                            {cert.issuer}
                          </p>
                        </div>
                        <span className="text-sm text-gray-600 print:text-xs">
                          {formatDate(cert.date)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {resume.languages && resume.languages.length > 0 && (
              <div className="mb-8 print:mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 print:text-lg print:mb-3 border-b border-gray-300 pb-2">
                  Languages
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 print:grid-cols-2 print:gap-2">
                  {resume.languages.map((lang, index) => (
                    <div key={index} className="print:break-inside-avoid">
                      <span className="font-medium text-gray-900 print:text-sm">
                        {lang.name}
                      </span>
                      <span className="text-gray-600 print:text-xs">
                        {' '}({lang.proficiency})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
