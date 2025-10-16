/**
 * API Service for backend communication
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Generic API request handler
 */
const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    console.log('🚀 API Request:', {
      endpoint,
      method: options.method,
      headers,
      body: options.body,
    });
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Send OTP to email
 */
export const sendOTP = async (email: string, name?: string): Promise<ApiResponse> => {
  return apiRequest('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email, name }),
  });
};

/**
 * Verify OTP
 */
export const verifyOTP = async (email: string, otp: string): Promise<ApiResponse> => {
  return apiRequest('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
};

/**
 * Resend OTP
 */
export const resendOTP = async (email: string, name?: string): Promise<ApiResponse> => {
  return apiRequest('/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email, name }),
  });
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (email: string, name: string): Promise<ApiResponse> => {
  return apiRequest('/auth/send-welcome', {
    method: 'POST',
    body: JSON.stringify({ email, name }),
  });
};

export default {
  sendOTP,
  verifyOTP,
  resendOTP,
  sendWelcomeEmail,
};

/**
 * Enrollment API - Teacher-Student relationships
 */

/**
 * Get all available teachers
 */
export const getAllTeachers = async (): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/enrollment/teachers', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * Get student's enrolled teachers
 */
export const getMyTeachers = async (): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/enrollment/my-teachers', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * Enroll with a teacher
 */
export const enrollWithTeacher = async (teacherId: string): Promise<ApiResponse> => {
  console.log('📚 enrollWithTeacher called with:', teacherId);
  console.log('📚 teacherId type:', typeof teacherId);
  console.log('📚 teacherId stringified:', JSON.stringify({ teacherId }));
  
  const token = localStorage.getItem('authToken');
  const body = JSON.stringify({ teacherId });
  console.log('📚 Request body:', body);
  
  return apiRequest('/enrollment/enroll-teacher', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: body,
  });
};

/**
 * Unenroll from a teacher
 */
export const unenrollFromTeacher = async (teacherId: string): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/enrollment/unenroll-teacher', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ teacherId }),
  });
};

/**
 * Get teacher's students
 */
export const getMyStudents = async (): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/enrollment/my-students', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * Course Management API - For teachers to manage courses
 */

/**
 * Get all available courses
 */
export const getAllCoursesAPI = async (): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/courses', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * Get teacher's teaching courses
 */
/**
 * Get course content with modules and lessons
 */
export const getTeachingCourses = async (): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/courses/teaching', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * Add course to teacher's teaching list
 */
export const addTeachingCourse = async (courseId: string): Promise<ApiResponse> => {
  console.log('📚 addTeachingCourse called with:', courseId);
  const token = localStorage.getItem('authToken');
  const body = JSON.stringify({ courseId });
  console.log('📚 Request body:', body);
  
  return apiRequest('/courses/add-teaching', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: body,
  });
};

/**
 * Remove course from teacher's teaching list
 */
export const removeTeachingCourse = async (courseId: string): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/courses/remove-teaching', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ courseId }),
  });
};

/**
 * Get course content with modules and lessons
 */
export const getCourseContentAPI = async (courseId: string): Promise<ApiResponse> => {
  console.log('🔍 API Call - getCourseContentAPI for courseId:', courseId);
  const token = localStorage.getItem('authToken');
  console.log('🔑 Auth token exists:', !!token);
  return apiRequest(`/courses/${courseId}/content`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * Grade API - For students and teachers
 */

/**
 * Get student's grades
 */
export const getStudentGrades = async (): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/grades/student', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * Get teacher's grades overview
 */
export const getTeacherGrades = async (): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/grades/teacher', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * Get detailed grade report for a student in a course
 */
export const getStudentGradeReport = async (studentId: string, courseId: string): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest(`/grades/student/${studentId}/course/${courseId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * Get student's enrolled courses
 */
export const getEnrolledCourses = async (): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/courses/enrolled', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * Enroll in a course
 */
export const enrollInCourse = async (courseId: string): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/courses/enroll', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ courseId }),
  });
};

/**
 * Enroll in a course with teacher selection
 */
export const enrollInCourseWithTeacher = async (courseId: string, teacherId: string): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/enrollment/enroll-course', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ courseId, teacherId }),
  });
};

/**
 * Unenroll from a course
 */
export const unenrollFromCourseNew = async (courseId: string): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/enrollment/unenroll-course', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ courseId }),
  });
};

/**
 * Assignment API - For teachers and students
 */

/**
 * Create a new assignment (Teacher only)
 */
export const createAssignment = async (assignmentData: any): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/assignments/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(assignmentData),
  });
};

/**
 * Get assignments for student (from enrolled teachers)
 */
export const getStudentAssignments = async (): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/assignments/student', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * Get assignments created by teacher
 */
export const getTeacherAssignments = async (): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/assignments/teacher', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * Submit an assignment (Student only)
 */
export const submitAssignment = async (submissionData: any): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest('/assignments/submit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(submissionData),
  });
};

/**
 * Submit an assignment with file attachments (Student only)
 */
export const submitAssignmentWithFiles = async (
  assignmentId: string, 
  content: string, 
  files: File[],
  onProgress?: (fileName: string, progress: number) => void,
  onFileComplete?: (fileName: string) => void
): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  
  // Create a custom upload function to track progress
  const uploadWithProgress = async (): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('assignmentId', assignmentId);
    formData.append('content', content || ''); // Ensure content is always a string
    
    files.forEach((file) => {
      console.log('Appending file to form data:', file.name, file.type);
      formData.append('attachments', file);
    });
    
    try {
      console.log('Submitting assignment with files:', { assignmentId, content, fileCount: files.length });
      
      // For simplicity, we'll simulate progress since the fetch API doesn't directly support upload progress
      // In a real implementation, you would use XMLHttpRequest or a library like axios
      if (onProgress) {
        files.forEach(file => {
          onProgress(file.name, 0);
        });
        
        // Simulate progress updates
        const interval = setInterval(() => {
          files.forEach(file => {
            const fileId = `${file.name}-${file.size}-${file.lastModified}`;
            const currentProgress = parseInt(localStorage.getItem(`uploadProgress_${fileId}`) || '0');
            if (currentProgress < 90) { // Stop at 90% to leave room for server processing
              const newProgress = Math.min(90, currentProgress + 10);
              localStorage.setItem(`uploadProgress_${fileId}`, newProgress.toString());
              onProgress(file.name, newProgress);
            }
          });
        }, 200);
        
        // Clear interval after 2 seconds
        setTimeout(() => {
          clearInterval(interval);
          files.forEach(file => {
            const fileId = `${file.name}-${file.size}-${file.lastModified}`;
            localStorage.setItem(`uploadProgress_${fileId}`, '100');
            onProgress(file.name, 100);
            if (onFileComplete) {
              onFileComplete(file.name);
            }
          });
        }, 2000);
      }
      
      const response = await fetch(`${API_BASE_URL}/assignments/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      console.log('File submission response status:', response.status);
      const data = await response.json();
      console.log('File submission response:', data);
      
      // Mark files as completely uploaded
      if (onFileComplete) {
        files.forEach(file => {
          onFileComplete(file.name);
        });
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
  
  return uploadWithProgress();
};

/**
 * Get submissions for a specific assignment (Teacher only)
 */
export const getAssignmentSubmissions = async (assignmentId: string): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest(`/assignments/${assignmentId}/submissions`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * Grade a submission (Teacher only)
 */
export const gradeSubmission = async (submissionId: string, gradeData: any): Promise<ApiResponse> => {
  const token = localStorage.getItem('authToken');
  return apiRequest(`/assignments/grade/${submissionId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(gradeData),
  });
};

/**
 * AI Grade a submission (Teacher only)
 */
export const aiGradeSubmission = async (submissionId: string, aiPrompt?: string): Promise<ApiResponse> => {
  console.log('🚀 API Call - aiGradeSubmission for submissionId:', submissionId);
  const token = localStorage.getItem('authToken');
  return apiRequest(`/assignments/ai-grade/${submissionId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ aiPrompt }),
  });
};