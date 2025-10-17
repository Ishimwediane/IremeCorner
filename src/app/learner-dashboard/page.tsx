'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  Calendar, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Users,
  Video,
  FileText,
  Settings,
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react';

const LearnerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileName, setProfileName] = useState("Marie Uwase");
  const [profileEmail, setProfileEmail] = useState("marie@example.com");
  const [notifications, setNotifications] = useState({
    email: true,
    reminders: true,
    achievements: false
  });

  // Sample learner data
  const learnerData = {
    name: profileName,
    email: profileEmail,
    avatar: "/images/dia.png",
    enrolledCourses: 4,
    completedCourses: 1,
    totalHours: 32,
    certificates: 1
  };

  // Sample courses data
  const courses = [
    {
      id: 1,
      title: "Basket Weaving",
      instructor: "Jean Claude",
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      nextLesson: "Advanced Weaving Patterns",
      image: "/images/wallb.jpeg",
      status: "in-progress",
      dueDate: "2025-11-15"
    },
    {
      id: 2,
      title: "Imigongo Art",
      instructor: "Sarah Mugabo",
      progress: 100,
      totalLessons: 10,
      completedLessons: 10,
      nextLesson: "Course Completed",
      image: "/images/imigongo.jpeg",
      status: "completed",
      dueDate: "2025-10-01"
    },
    {
      id: 3,
      title: "Pottery",
      instructor: "David Nkusi",
      progress: 45,
      totalLessons: 15,
      completedLessons: 7,
      nextLesson: "Glazing Techniques",
      image: "/images/kub.jpeg",
      status: "in-progress",
      dueDate: "2025-12-01"
    },
    {
      id: 4,
      title: "Crochet & Yarn Crafts",
      instructor: "Grace Uwera",
      progress: 20,
      totalLessons: 8,
      completedLessons: 2,
      nextLesson: "Basic Stitches",
      image: "/images/croch.jpeg",
      status: "in-progress",
      dueDate: "2025-11-30"
    }
  ];

  // Sample upcoming sessions
  const upcomingSessions = [
    {
      id: 1,
      course: "Basket Weaving",
      title: "Live Workshop: Advanced Techniques",
      date: "2025-10-20",
      time: "2:00 PM - 4:00 PM",
      instructor: "Jean Claude"
    },
    {
      id: 2,
      course: "Pottery",
      title: "Q&A Session",
      date: "2025-10-22",
      time: "3:00 PM - 4:00 PM",
      instructor: "David Nkusi"
    }
  ];

  // Sample achievements
  const achievements = [
    {
      id: 1,
      title: "First Course Completed",
      description: "Completed your first training course",
      icon: "🎓",
      earned: true,
      date: "2025-10-01"
    },
    {
      id: 2,
      title: "Fast Learner",
      description: "Completed 5 lessons in one week",
      icon: "⚡",
      earned: true,
      date: "2025-09-15"
    },
    {
      id: 3,
      title: "Perfect Attendance",
      description: "Attended all live sessions in a month",
      icon: "✨",
      earned: false,
      date: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Top Navigation Bar */}
      <nav className="bg-[#202f32] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo & Menu Toggle */}
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
              <span className="text-xl font-semibold hidden sm:inline">Learner Dashboard</span>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <button className="relative hover:text-orange-400 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              <div className="flex items-center space-x-3">
                <img
                  src={learnerData.avatar}
                  alt={learnerData.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:inline font-medium">{learnerData.name}</span>
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
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'schedule' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Schedule</span>
            </button>

            <button
              onClick={() => setActiveTab('achievements')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'achievements' ? 'bg-orange-400 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Award className="w-5 h-5" />
              <span className="font-medium">Achievements</span>
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
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Enrolled Courses</p>
                      <p className="text-3xl font-bold text-gray-800">{learnerData.enrolledCourses}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Completed</p>
                      <p className="text-3xl font-bold text-gray-800">{learnerData.completedCourses}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Learning Hours</p>
                      <p className="text-3xl font-bold text-gray-800">{learnerData.totalHours}</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Certificates</p>
                      <p className="text-3xl font-bold text-gray-800">{learnerData.certificates}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Continue Learning */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Continue Learning</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {courses.filter(c => c.status === 'in-progress').map(course => (
                    <div key={course.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex gap-4">
                        <img 
                          src={course.image} 
                          alt={course.title}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{course.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">Next: {course.nextLesson}</p>
                          <div className="mb-2">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>{course.progress}% Complete</span>
                              <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-400 h-2 rounded-full transition-all"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                          <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                            Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Sessions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Sessions</h2>
                <div className="space-y-4">
                  {upcomingSessions.map(session => (
                    <div key={session.id} className="flex items-center justify-between border-l-4 border-orange-400 bg-orange-50 p-4 rounded-r-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-orange-400 text-white p-3 rounded-lg">
                          <Video className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{session.title}</h3>
                          <p className="text-sm text-gray-600">{session.course} • {session.instructor}</p>
                          <p className="text-sm text-gray-500">{session.date} • {session.time}</p>
                        </div>
                      </div>
                      <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md font-medium transition-colors">
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* My Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                    <div className="relative h-48">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      {course.status === 'completed' && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Completed
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">Instructor: {course.instructor}</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-orange-400 h-3 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{course.completedLessons}/{course.totalLessons} lessons</span>
                        <button className="bg-[#202f32] hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                          {course.status === 'completed' ? 'Review' : 'Continue'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">My Schedule</h2>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="space-y-4">
                  {upcomingSessions.map(session => (
                    <div key={session.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4">
                          <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg text-center">
                            <div className="text-2xl font-bold">{new Date(session.date).getDate()}</div>
                            <div className="text-xs">{new Date(session.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-lg">{session.title}</h3>
                            <p className="text-gray-600">{session.course}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              <Clock className="w-4 h-4 inline mr-1" />
                              {session.time}
                            </p>
                            <p className="text-sm text-gray-500">
                              <Users className="w-4 h-4 inline mr-1" />
                              {session.instructor}
                            </p>
                          </div>
                        </div>
                        <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md font-medium transition-colors">
                          Join Session
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Achievements & Certificates</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`bg-white rounded-xl shadow-lg p-6 ${
                      achievement.earned ? 'border-2 border-orange-400' : 'opacity-60'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">{achievement.icon}</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{achievement.title}</h3>
                      <p className="text-gray-600 mb-4">{achievement.description}</p>
                      {achievement.earned ? (
                        <div className="text-sm text-green-600 font-semibold">
                          Earned on {achievement.date}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Not yet earned
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Certificates */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">My Certificates</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {courses.filter(c => c.status === 'completed').map(course => (
                    <div key={course.id} className="border-2 border-orange-400 rounded-lg p-6 bg-gradient-to-br from-orange-50 to-white">
                      <div className="flex items-center justify-between mb-4">
                        <Award className="w-12 h-12 text-orange-400" />
                        <span className="text-sm text-gray-600">Completed: {course.dueDate}</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 mb-2">{course.title}</h4>
                      <p className="text-gray-600 mb-4">Instructor: {course.instructor}</p>
                      <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-md font-medium transition-colors">
                        Download Certificate
                      </button>
                    </div>
                  ))}
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
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Email notifications</span>
                    <input 
                      type="checkbox" 
                      checked={notifications.email}
                      onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                      className="w-5 h-5 text-orange-400 rounded focus:ring-orange-400"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Course reminders</span>
                    <input 
                      type="checkbox" 
                      checked={notifications.reminders}
                      onChange={(e) => setNotifications({...notifications, reminders: e.target.checked})}
                      className="w-5 h-5 text-orange-400 rounded focus:ring-orange-400"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Achievement alerts</span>
                    <input 
                      type="checkbox" 
                      checked={notifications.achievements}
                      onChange={(e) => setNotifications({...notifications, achievements: e.target.checked})}
                      className="w-5 h-5 text-orange-400 rounded focus:ring-orange-400"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default LearnerDashboard;