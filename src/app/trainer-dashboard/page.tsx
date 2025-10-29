'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Calendar,
  Video,
  FileText,
  Award,
  TrendingUp,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Plus,
  Edit,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  MessageSquare,
  Upload,
  Download
} from 'lucide-react';

const TrainerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);

  // Trainer data
  const trainerData = {
    name: "Jean Claude Nkusi",
    email: "jean@iremecorner.com",
    avatar: "/images/yv.jpg",
    specialty: "Basket Weaving & Pottery",
    rating: 4.9,
    totalCourses: 6,
    totalStudents: 124,
    activeSessions: 3,
    completedTrainings: 89
  };

  // Courses
  const courses = [
    {
      id: 1,
      title: "Basket Weaving Fundamentals",
      description: "Learn traditional Rwandan basket weaving techniques",
      students: 45,
      lessons: 12,
      duration: "8 weeks",
      status: "active",
      progress: 75,
      image: "/images/wallb.jpeg",
      startDate: "2025-09-01",
      completionRate: 85
    },
    {
      id: 2,
      title: "Advanced Pottery Techniques",
      description: "Master clay shaping and glazing",
      students: 32,
      lessons: 15,
      duration: "10 weeks",
      status: "active",
      progress: 45,
      image: "/images/kub.jpeg",
      startDate: "2025-10-01",
      completionRate: 78
    },
    {
      id: 3,
      title: "Imigongo Art Workshop",
      description: "Traditional Rwandan geometric art patterns",
      students: 28,
      lessons: 10,
      duration: "6 weeks",
      status: "completed",
      progress: 100,
      image: "/images/imigongo.jpeg",
      startDate: "2025-07-01",
      completionRate: 92
    }
  ];

  // Students
  const students = [
    {
      id: 1,
      name: "Marie Uwase",
      email: "marie@example.com",
      course: "Basket Weaving Fundamentals",
      progress: 85,
      attendance: 95,
      lastActive: "2025-10-16",
      status: "active",
      avatar: "/images/dia.png"
    },
    {
      id: 2,
      name: "Sarah Mugabo",
      email: "sarah@example.com",
      course: "Advanced Pottery Techniques",
      progress: 60,
      attendance: 88,
      lastActive: "2025-10-15",
      status: "active",
      avatar: "/images/yv.jpg"
    },
    {
      id: 3,
      name: "David Nkusi",
      email: "david@example.com",
      course: "Basket Weaving Fundamentals",
      progress: 92,
      attendance: 100,
      lastActive: "2025-10-17",
      status: "active",
      avatar: "/images/dia.png"
    }
  ];

  // Upcoming sessions
  const upcomingSessions = [
    {
      id: 1,
      title: "Basket Weaving - Live Demo",
      course: "Basket Weaving Fundamentals",
      date: "2025-10-20",
      time: "14:00 - 16:00",
      students: 45,
      type: "live",
      meetingLink: "https://zoom.us/j/123456789"
    },
    {
      id: 2,
      title: "Pottery Q&A Session",
      course: "Advanced Pottery Techniques",
      date: "2025-10-22",
      time: "15:00 - 16:00",
      students: 32,
      type: "qa",
      meetingLink: "https://zoom.us/j/987654321"
    },
    {
      id: 3,
      title: "Final Project Review",
      course: "Basket Weaving Fundamentals",
      date: "2025-10-25",
      time: "10:00 - 12:00",
      students: 45,
      type: "review",
      meetingLink: "https://zoom.us/j/456789123"
    }
  ];

  // Assignments
  const assignments = [
    {
      id: 1,
      title: "Create Traditional Basket",
      course: "Basket Weaving Fundamentals",
      dueDate: "2025-10-20",
      submitted: 32,
      pending: 13,
      total: 45
    },
    {
      id: 2,
      title: "Pottery Design Portfolio",
      course: "Advanced Pottery Techniques",
      dueDate: "2025-10-25",
      submitted: 18,
      pending: 14,
      total: 32
    }
  ];

  // Messages/Questions
  const messages = [
    {
      id: 1,
      student: "Marie Uwase",
      course: "Basket Weaving Fundamentals",
      message: "Could you explain the coiling technique again?",
      date: "2025-10-17",
      replied: false
    },
    {
      id: 2,
      student: "David Nkusi",
      course: "Advanced Pottery Techniques",
      message: "What temperature should I use for glazing?",
      date: "2025-10-16",
      replied: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Top Navigation */}
      <nav className="bg-[#202f32] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-white hover:text-orange-400"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <a href="/">
                <img 
                  src="/images/logo.png"
                  alt="IremeCorner"
                  className="h-10 w-auto"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </a>
              <span className="text-xl font-semibold hidden sm:inline">Trainer Dashboard</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative hover:text-orange-400 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {messages.filter(m => !m.replied).length}
                </span>
              </button>
              
              <div className="flex items-center space-x-3">
                <img
                  src={trainerData.avatar}
                  alt={trainerData.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:inline font-medium">{trainerData.name}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white shadow-lg z-40 mt-16 lg:mt-0`}>
          <div className="p-6 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'overview' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'courses' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">My Courses</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'students' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Students</span>
            </button>

            <button
              onClick={() => setActiveTab('sessions')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'sessions' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Sessions</span>
            </button>

            <button
              onClick={() => setActiveTab('assignments')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'assignments' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Assignments</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'messages' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Messages</span>
              {messages.filter(m => !m.replied).length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {messages.filter(m => !m.replied).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'analytics' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Award className="w-5 h-5" />
              <span className="font-medium">Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'settings' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>

            <div className="pt-4 border-t">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Welcome back, {trainerData.name}!</h2>
                  <p className="text-gray-600">{trainerData.specialty}</p>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowAddCourse(true)}
                    className="flex items-center space-x-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>New Course</span>
                  </button>
                  <button 
                    onClick={() => setShowAddSession(true)}
                    className="flex items-center space-x-2 bg-[#202f32] hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Schedule Session</span>
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="w-8 h-8 opacity-80" />
                    <span className="text-2xl font-bold">{trainerData.totalCourses}</span>
                  </div>
                  <p className="text-sm opacity-90">Total Courses</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 opacity-80" />
                    <span className="text-2xl font-bold">{trainerData.totalStudents}</span>
                  </div>
                  <p className="text-sm opacity-90">Total Students</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Video className="w-8 h-8 opacity-80" />
                    <span className="text-2xl font-bold">{trainerData.activeSessions}</span>
                  </div>
                  <p className="text-sm opacity-90">Active Sessions</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-8 h-8 opacity-80" />
                    <span className="text-2xl font-bold">{trainerData.completedTrainings}</span>
                  </div>
                  <p className="text-sm opacity-90">Completed</p>
                </div>
              </div>

              {/* Upcoming Sessions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Sessions</h3>
                <div className="space-y-4">
                  {upcomingSessions.slice(0, 3).map(session => (
                    <div key={session.id} className="flex items-center justify-between border-l-4 border-orange-400 bg-orange-50 p-4 rounded-r-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-orange-400 text-white p-3 rounded-lg">
                          <Video className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{session.title}</h4>
                          <p className="text-sm text-gray-600">{session.course}</p>
                          <p className="text-sm text-gray-500">{session.date} • {session.time} • {session.students} students</p>
                        </div>
                      </div>
                      <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md font-medium transition-colors">
                        Start Session
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Courses */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Active Courses</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {courses.filter(c => c.status === 'active').map(course => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex gap-4">
                        <img 
                          src={course.image} 
                          alt={course.title}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{course.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{course.students} students</p>
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-400 h-2 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Student Activity */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Student Activity</h3>
                <div className="space-y-3">
                  {students.slice(0, 5).map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={student.avatar} 
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.course}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">{student.progress}% complete</p>
                        <p className="text-xs text-gray-500">Last active: {student.lastActive}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* My Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
                <button 
                  onClick={() => setShowAddCourse(true)}
                  className="flex items-center space-x-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New Course</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        course.status === 'active' ? 'bg-green-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex justify-between">
                          <span>Students:</span>
                          <span className="font-semibold">{course.students}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lessons:</span>
                          <span className="font-semibold">{course.lessons}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-semibold">{course.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Completion Rate:</span>
                          <span className="font-semibold text-green-600">{course.completionRate}%</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 flex items-center justify-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Students Management</h2>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Course</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Progress</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Attendance</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Active</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={student.avatar} 
                              alt={student.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-gray-600">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{student.course}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <span className="text-sm">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            student.attendance >= 90 ? 'bg-green-100 text-green-700' :
                            student.attendance >= 75 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {student.attendance}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{student.lastActive}</td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Training Sessions</h2>
                <button 
                  onClick={() => setShowAddSession(true)}
                  className="flex items-center space-x-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Schedule New Session</span>
                </button>
              </div>

              <div className="space-y-4">
                {upcomingSessions.map(session => (
                  <div key={session.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-4 rounded-lg ${
                          session.type === 'live' ? 'bg-red-100' :
                          session.type === 'qa' ? 'bg-blue-100' :
                          'bg-green-100'
                        }`}>
                          <Video className={`w-8 h-8 ${
                            session.type === 'live' ? 'text-red-600' :
                            session.type === 'qa' ? 'text-blue-600' :
                            'text-green-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{session.title}</h3>
                          <p className="text-gray-600">{session.course}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {session.time}
                            </span>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {session.students} students
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors">
                          Start Session
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors">
                          <Edit className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Assignments</h2>
                <button className="flex items-center space-x-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors">
                  <Plus className="w-5 h-5" />
                  <span>Create Assignment</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {assignments.map(assignment => (
                  <div key={assignment.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{assignment.title}</h3>
                        <p className="text-sm text-gray-600">{assignment.course}</p>
                      </div>
                      <span className="text-sm text-gray-500">Due: {assignment.dueDate}</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Submitted</span>
                        <span className="font-bold text-green-600">{assignment.submitted}/{assignment.total}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Pending</span>
                        <span className="font-bold text-orange-600">{assignment.pending}/{assignment.total}</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full"
                          style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                        />
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                          View Submissions
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors">
                          <Edit className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Student Messages</h2>

              <div className="space-y-4">
                {messages.map(message => (
                  <div key={message.id} className={`bg-white rounded-xl shadow-lg p-6 ${!message.replied ? 'border-l-4 border-orange-400' : ''}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{message.student}</h4>
                        <p className="text-sm text-gray-600">{message.course}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">{message.date}</span>
                        {message.replied ? (
                          <span className="block text-xs text-green-600 mt-1">Replied</span>
                        ) : (
                          <span className="block text-xs text-orange-600 mt-1">New</span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{message.message}</p>
                    {!message.replied && (
                      <button className="flex items-center space-x-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors">
                        <MessageSquare className="w-5 h-5" />
                        <span>Reply</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Performance Analytics</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Course Performance</h3>
                  <div className="space-y-4">
                    {courses.map(course => (
                      <div key={course.id}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">{course.title}</span>
                          <span className="font-semibold text-gray-800">{course.completionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${course.completionRate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Student Engagement</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">Active Students</span>
                      <span className="font-bold text-green-600">112</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-700">Average Attendance</span>
                      <span className="font-bold text-blue-600">91%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-gray-700">Avg. Completion Rate</span>
                      <span className="font-bold text-orange-600">85%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Student Feedback</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-orange-400">{trainerData.rating}</div>
                      <div className="flex items-center justify-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-6 h-6 ${i < Math.floor(trainerData.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-600 mt-2">Based on 124 reviews</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Achievements</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <Award className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="font-semibold text-gray-800">Top Rated Trainer</p>
                        <p className="text-sm text-gray-600">October 2025</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-800">100 Students Trained</p>
                        <p className="text-sm text-gray-600">September 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={trainerData.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      defaultValue={trainerData.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Specialty</label>
                    <input 
                      type="text" 
                      defaultValue={trainerData.specialty}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Bio</label>
                    <textarea 
                      rows={4}
                      defaultValue="Expert trainer in traditional Rwandan crafts with over 10 years of experience."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">Create New Course</h3>
              <button 
                onClick={() => setShowAddCourse(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Course Title</label>
                <input 
                  type="text" 
                  placeholder="Enter course title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea 
                  rows={4}
                  placeholder="Course description..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Duration</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 8 weeks"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Number of Lessons</label>
                  <input 
                    type="number" 
                    placeholder="12"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Course Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button 
                  onClick={() => setShowAddCourse(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Create Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Session Modal */}
      {showAddSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">Schedule New Session</h3>
              <button 
                onClick={() => setShowAddSession(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Session Title</label>
                <input 
                  type="text" 
                  placeholder="Enter session title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Course</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Time</label>
                  <input 
                    type="time" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Session Type</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value="live">Live Workshop</option>
                  <option value="qa">Q&A Session</option>
                  <option value="review">Project Review</option>
                </select>
              </div>
              <div className="flex space-x-4 pt-4">
                <button 
                  onClick={() => setShowAddSession(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Schedule Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;
                              