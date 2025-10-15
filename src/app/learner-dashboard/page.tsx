"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LearnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [completedCourses, setCompletedCourses] = useState(3);
  const [inProgressCourses, setInProgressCourses] = useState(2);

  // Mock data for courses
  const courses = [
    {
      id: 1,
      title: "Traditional Basket Weaving",
      instructor: "Mukamana Jeanne",
      progress: 75,
      duration: "4 weeks",
      nextLesson: "Advanced Weaving Patterns",
      image: "images/basket.jpeg"
    },
    {
      id: 2,
      title: "Imigongo Art Techniques",
      instructor: "Niyomugabo Pierre",
      progress: 40,
      duration: "6 weeks",
      nextLesson: "Color Mixing & Application",
      image: "images/imigongo.jpeg"
    },
    {
      id: 3,
      title: "Agaseke Craft Mastery",
      instructor: "Uwimana Grace",
      progress: 100,
      duration: "8 weeks",
      nextLesson: "Course Completed",
      image: "images/agaseke.jpeg"
    }
  ];

  const achievements = [
    { id: 1, name: "First Project", icon: "🎯", date: "2024-01-15" },
    { id: 2, name: "Quick Learner", icon: "⚡", date: "2024-02-01" },
    { id: 3, name: "Master Weaver", icon: "🏆", date: "2024-02-20" }
  ];

  const upcomingEvents = [
    { id: 1, title: "Live Q&A Session", date: "2024-03-15", time: "14:00", type: "online" },
    { id: 2, title: "Community Workshop", date: "2024-03-20", time: "09:00", type: "in-person" },
    { id: 3, title: "Project Submission", date: "2024-03-25", time: "23:59", type: "deadline" }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Shared Static Background Image for entire page */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-fixed -z-10"
        style={{ 
          backgroundImage: "url('images/wall.jpeg')",
          opacity: 0.5,
        }}
      />

      {/* Optional overlay for better readability */}
      <div className="fixed inset-0 bg-white -z-10" style={{ opacity: 0.7 }} />

      <Header />

      {/* Dashboard Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#202f32] mb-2">
              Learner Dashboard
            </h1>
            <p className="text-gray-600">Welcome back! Continue your craft journey.</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <p className="text-gray-600">Courses Enrolled</p>
                  <p className="text-2xl font-bold text-[#202f32]">5</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <p className="text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-[#202f32]">{completedCourses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">⏱️</span>
                </div>
                <div>
                  <p className="text-gray-600">Learning Hours</p>
                  <p className="text-2xl font-bold text-[#202f32]">42</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', name: 'Overview' },
                  { id: 'courses', name: 'My Courses' },
                  { id: 'achievements', name: 'Achievements' },
                  { id: 'schedule', name: 'Schedule' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Current Courses */}
                  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                    <h2 className="text-2xl font-bold text-[#202f32] mb-4">Continue Learning</h2>
                    <div className="space-y-4">
                      {courses.filter(course => course.progress < 100).map((course) => (
                        <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-all duration-300">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={course.image} 
                              alt={course.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">{course.title}</h3>
                              <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                              <div className="mt-2">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Progress</span>
                                  <span>{course.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${course.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mt-2">
                                Next: {course.nextLesson}
                              </p>
                            </div>
                            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300">
                              Continue
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Achievements */}
                  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                    <h2 className="text-2xl font-bold text-[#202f32] mb-4">Recent Achievements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {achievements.map((achievement) => (
                        <div key={achievement.id} className="text-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-all duration-300">
                          <div className="text-3xl mb-2">{achievement.icon}</div>
                          <h3 className="font-semibold text-gray-800">{achievement.name}</h3>
                          <p className="text-sm text-gray-600">{achievement.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Courses Tab */}
              {activeTab === 'courses' && (
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                  <h2 className="text-2xl font-bold text-[#202f32] mb-6">My Courses</h2>
                  <div className="space-y-6">
                    {courses.map((course) => (
                      <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300">
                        <div className="flex items-start space-x-6">
                          <img 
                            src={course.image} 
                            alt={course.title}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                course.progress === 100 
                                  ? 'bg-green-100 text-green-800'
                                  : course.progress > 50
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {course.progress === 100 ? 'Completed' : 'In Progress'}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">Instructor: {course.instructor}</p>
                            <p className="text-gray-600 mb-4">Duration: {course.duration}</p>
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                  className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex space-x-4">
                              <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300">
                                {course.progress === 100 ? 'Review' : 'Continue'}
                              </button>
                              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:border-orange-300 transition-colors duration-300">
                                View Materials
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements Tab */}
              {activeTab === 'achievements' && (
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                  <h2 className="text-2xl font-bold text-[#202f32] mb-6">My Achievements</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...achievements, ...achievements].map((achievement, index) => (
                      <div key={index} className="text-center p-6 border-2 border-orange-200 rounded-lg bg-orange-50 hover:border-orange-300 transition-all duration-300">
                        <div className="text-4xl mb-4">{achievement.icon}</div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{achievement.name}</h3>
                        <p className="text-gray-600 mb-4">Earned on {achievement.date}</p>
                        <div className="w-12 h-12 mx-auto bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">✓</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule Tab */}
              {activeTab === 'schedule' && (
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                  <h2 className="text-2xl font-bold text-[#202f32] mb-6">Learning Schedule</h2>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-all duration-300">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            event.type === 'online' ? 'bg-blue-100' :
                            event.type === 'in-person' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            <span className={`text-lg ${
                              event.type === 'online' ? 'text-blue-600' :
                              event.type === 'in-person' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {event.type === 'online' ? '💻' : event.type === 'in-person' ? '🏛️' : '📝'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{event.title}</h3>
                            <p className="text-gray-600">
                              {event.date} at {event.time}
                            </p>
                          </div>
                        </div>
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300">
                          {event.type === 'deadline' ? 'Submit' : 'Join'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold text-[#202f32] mb-4">Upcoming Deadlines</h3>
                <div className="space-y-3">
                  {upcomingEvents.filter(event => event.type === 'deadline').map((event) => (
                    <div key={event.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-red-800">{event.title}</span>
                        <span className="text-sm text-red-600">{event.date}</span>
                      </div>
                      <p className="text-sm text-red-600 mt-1">Due at {event.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold text-[#202f32] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center space-x-2">
                    <span>📚</span>
                    <span>Browse Courses</span>
                  </button>
                  <button className="w-full border border-orange-500 text-orange-500 py-3 rounded-lg hover:bg-orange-50 transition-colors duration-300 flex items-center justify-center space-x-2">
                    <span>👥</span>
                    <span>Community Forum</span>
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:border-orange-300 transition-colors duration-300 flex items-center justify-center space-x-2">
                    <span>📋</span>
                    <span>My Projects</span>
                  </button>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="bg-gradient-to-br from-[#202f32] to-gray-800 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold mb-4">Overall Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Course Completion</span>
                      <span>60%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Skill Level</span>
                      <span>Intermediate</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Community Engagement</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LearnerDashboard;