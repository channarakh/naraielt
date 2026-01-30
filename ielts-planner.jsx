import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, BookOpen, Target, TrendingUp, Award, Clock, Plus, Save, Trash2, Download, Upload } from 'lucide-react';

export default function IELTSStudyPlanner() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [practiceTests, setPracticeTests] = useState([]);
  const [studyLogs, setStudyLogs] = useState([]);
  const [vocabulary, setVocabulary] = useState([]);
  const [goals, setGoals] = useState({
    targetOverall: 7.5,
    targetListening: 7.5,
    targetReading: 7.5,
    targetWriting: 7.0,
    targetSpeaking: 7.5,
    examDate: '',
    weeklyGoal: 20,
    weeklyFocus: ''
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTests = localStorage.getItem('ielts_practiceTests');
    const savedLogs = localStorage.getItem('ielts_studyLogs');
    const savedVocab = localStorage.getItem('ielts_vocabulary');
    const savedGoals = localStorage.getItem('ielts_goals');

    if (savedTests) setPracticeTests(JSON.parse(savedTests));
    if (savedLogs) setStudyLogs(JSON.parse(savedLogs));
    if (savedVocab) setVocabulary(JSON.parse(savedVocab));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ielts_practiceTests', JSON.stringify(practiceTests));
  }, [practiceTests]);

  useEffect(() => {
    localStorage.setItem('ielts_studyLogs', JSON.stringify(studyLogs));
  }, [studyLogs]);

  useEffect(() => {
    localStorage.setItem('ielts_vocabulary', JSON.stringify(vocabulary));
  }, [vocabulary]);

  useEffect(() => {
    localStorage.setItem('ielts_goals', JSON.stringify(goals));
  }, [goals]);

  // Calculate statistics
  const totalStudyHours = studyLogs.reduce((sum, log) => 
    sum + (parseFloat(log.listening) || 0) + (parseFloat(log.reading) || 0) + 
    (parseFloat(log.writing) || 0) + (parseFloat(log.speaking) || 0), 0
  );

  const latestTest = practiceTests[practiceTests.length - 1];
  const currentScores = latestTest ? {
    listening: parseFloat(latestTest.listening) || 0,
    reading: parseFloat(latestTest.reading) || 0,
    writing: parseFloat(latestTest.writing) || 0,
    speaking: parseFloat(latestTest.speaking) || 0,
  } : { listening: 0, reading: 0, writing: 0, speaking: 0 };

  const overallScore = latestTest ? 
    Math.round((currentScores.listening + currentScores.reading + currentScores.writing + currentScores.speaking) / 4 * 2) / 2 
    : 0;

  const daysToExam = goals.examDate ? 
    Math.max(0, Math.ceil((new Date(goals.examDate) - new Date()) / (1000 * 60 * 60 * 24))) 
    : null;

  // Chart data
  const progressData = practiceTests.map((test, idx) => ({
    name: `Test ${idx + 1}`,
    Listening: parseFloat(test.listening) || 0,
    Reading: parseFloat(test.reading) || 0,
    Writing: parseFloat(test.writing) || 0,
    Speaking: parseFloat(test.speaking) || 0,
  }));

  const pieData = [
    { name: 'Listening', value: currentScores.listening, color: '#8b5cf6' },
    { name: 'Reading', value: currentScores.reading, color: '#ec4899' },
    { name: 'Writing', value: currentScores.writing, color: '#f59e0b' },
    { name: 'Speaking', value: currentScores.speaking, color: '#10b981' },
  ];

  // Export/Import functions
  const exportData = () => {
    const data = {
      practiceTests,
      studyLogs,
      vocabulary,
      goals,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ielts-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.practiceTests) setPracticeTests(data.practiceTests);
          if (data.studyLogs) setStudyLogs(data.studyLogs);
          if (data.vocabulary) setVocabulary(data.vocabulary);
          if (data.goals) setGoals(data.goals);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h1 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              IELTS Study Planner
            </h1>
            <p className="text-purple-200 text-lg">Your complete journey to IELTS success</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 p-2 flex flex-wrap gap-2">
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: TrendingUp },
            { id: 'tests', label: '📝 Tests', icon: BookOpen },
            { id: 'study', label: '📚 Study Log', icon: Clock },
            { id: 'vocabulary', label: '📖 Vocabulary', icon: Award },
            { id: 'goals', label: '🎯 Goals', icon: Target },
            { id: 'resources', label: '🔗 Resources', icon: Calendar },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                icon={<Clock className="w-8 h-8" />}
                value={totalStudyHours.toFixed(1)}
                label="Study Hours"
                gradient="from-blue-500 to-cyan-500"
              />
              <StatCard
                icon={<BookOpen className="w-8 h-8" />}
                value={practiceTests.length}
                label="Practice Tests"
                gradient="from-purple-500 to-pink-500"
              />
              <StatCard
                icon={<Award className="w-8 h-8" />}
                value={vocabulary.length}
                label="Words Learned"
                gradient="from-orange-500 to-red-500"
              />
              <StatCard
                icon={<Calendar className="w-8 h-8" />}
                value={daysToExam ?? '--'}
                label="Days to Test"
                gradient="from-green-500 to-teal-500"
              />
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overall Score */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Overall Band Score
                </h3>
                <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-center my-8">
                  {overallScore > 0 ? overallScore.toFixed(1) : 'N/A'}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Progress to Target</span>
                    <span>Target: {goals.targetOverall}</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${Math.min((overallScore / goals.targetOverall) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Sub-scores */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
                  Sub-Band Scores
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <ScoreBox label="Listening" score={currentScores.listening} color="bg-purple-500" />
                  <ScoreBox label="Reading" score={currentScores.reading} color="bg-pink-500" />
                  <ScoreBox label="Writing" score={currentScores.writing} color="bg-orange-500" />
                  <ScoreBox label="Speaking" score={currentScores.speaking} color="bg-green-500" />
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line Chart */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Progress Over Time</h3>
                {practiceTests.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 9]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Listening" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="Reading" stroke="#ec4899" strokeWidth={2} />
                      <Line type="monotone" dataKey="Writing" stroke="#f59e0b" strokeWidth={2} />
                      <Line type="monotone" dataKey="Speaking" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="No test data yet. Add your first practice test!" />
                )}
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Current Score Distribution</h3>
                {overallScore > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="Complete a practice test to see your score distribution" />
                )}
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Data Management</h3>
              <div className="flex gap-4">
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Download className="w-5 h-5" />
                  Export Data
                </button>
                <label className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer">
                  <Upload className="w-5 h-5" />
                  Import Data
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Practice Tests Tab */}
        {activeTab === 'tests' && (
          <PracticeTestsTab
            practiceTests={practiceTests}
            setPracticeTests={setPracticeTests}
          />
        )}

        {/* Study Log Tab */}
        {activeTab === 'study' && (
          <StudyLogTab
            studyLogs={studyLogs}
            setStudyLogs={setStudyLogs}
          />
        )}

        {/* Vocabulary Tab */}
        {activeTab === 'vocabulary' && (
          <VocabularyTab
            vocabulary={vocabulary}
            setVocabulary={setVocabulary}
          />
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <GoalsTab
            goals={goals}
            setGoals={setGoals}
          />
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && <ResourcesTab />}
      </div>
    </div>
  );
}

// Component: StatCard
function StatCard({ icon, value, label, gradient }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white bg-opacity-20 p-3 rounded-xl">
          {icon}
        </div>
      </div>
      <div className="text-4xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-90 uppercase tracking-wider">{label}</div>
    </div>
  );
}

// Component: ScoreBox
function ScoreBox({ label, score, color }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-all">
      <div className="text-sm text-gray-600 font-semibold mb-2">{label}</div>
      <div className={`text-3xl font-bold ${color} bg-clip-text text-transparent bg-gradient-to-r from-current to-current`}>
        {score > 0 ? score.toFixed(1) : '--'}
      </div>
    </div>
  );
}

// Component: EmptyState
function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
      <div className="text-6xl mb-4">📊</div>
      <p className="text-center">{message}</p>
    </div>
  );
}

// Component: PracticeTestsTab
function PracticeTestsTab({ practiceTests, setPracticeTests }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Full Test',
    listening: '',
    reading: '',
    writing: '',
    speaking: ''
  });

  const addTest = () => {
    if (!formData.date) {
      alert('Please select a date');
      return;
    }
    setPracticeTests([...practiceTests, { ...formData }]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'Full Test',
      listening: '',
      reading: '',
      writing: '',
      speaking: ''
    });
  };

  const deleteTest = (index) => {
    if (confirm('Are you sure you want to delete this test?')) {
      setPracticeTests(practiceTests.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Practice Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Test Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Test Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            >
              <option>Full Test</option>
              <option>Listening Only</option>
              <option>Reading Only</option>
              <option>Writing Only</option>
              <option>Speaking Only</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {['listening', 'reading', 'writing', 'speaking'].map(skill => (
            <div key={skill}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                {skill} Score
              </label>
              <input
                type="number"
                min="0"
                max="9"
                step="0.5"
                value={formData[skill]}
                onChange={(e) => setFormData({ ...formData, [skill]: e.target.value })}
                placeholder="0.0-9.0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>
          ))}
        </div>
        <button
          onClick={addTest}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Practice Test
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Test History</h2>
        {practiceTests.length === 0 ? (
          <EmptyState message="No practice tests recorded yet. Add your first test above!" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <th className="px-4 py-3 text-left rounded-tl-xl">Date</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-center">L</th>
                  <th className="px-4 py-3 text-center">R</th>
                  <th className="px-4 py-3 text-center">W</th>
                  <th className="px-4 py-3 text-center">S</th>
                  <th className="px-4 py-3 text-center">Overall</th>
                  <th className="px-4 py-3 text-center rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody>
                {practiceTests.map((test, idx) => {
                  const overall = Math.round(
                    ((parseFloat(test.listening) || 0) + 
                     (parseFloat(test.reading) || 0) + 
                     (parseFloat(test.writing) || 0) + 
                     (parseFloat(test.speaking) || 0)) / 4 * 2
                  ) / 2;
                  return (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{test.date}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {test.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">{test.listening || '--'}</td>
                      <td className="px-4 py-3 text-center">{test.reading || '--'}</td>
                      <td className="px-4 py-3 text-center">{test.writing || '--'}</td>
                      <td className="px-4 py-3 text-center">{test.speaking || '--'}</td>
                      <td className="px-4 py-3 text-center font-bold text-purple-600">
                        {overall.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => deleteTest(idx)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Component: StudyLogTab
function StudyLogTab({ studyLogs, setStudyLogs }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    listening: '',
    reading: '',
    writing: '',
    speaking: '',
    notes: ''
  });

  const addLog = () => {
    if (!formData.date) {
      alert('Please select a date');
      return;
    }
    setStudyLogs([...studyLogs, { ...formData }]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      listening: '',
      reading: '',
      writing: '',
      speaking: '',
      notes: ''
    });
  };

  const deleteLog = (index) => {
    if (confirm('Are you sure you want to delete this study log?')) {
      setStudyLogs(studyLogs.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Log Study Session</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
            />
          </div>
          {['listening', 'reading', 'writing', 'speaking'].map(skill => (
            <div key={skill}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                {skill} (hrs)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData[skill]}
                onChange={(e) => setFormData({ ...formData, [skill]: e.target.value })}
                placeholder="0.0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
              />
            </div>
          ))}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="What did you focus on today?"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
          />
        </div>
        <button
          onClick={addLog}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Log Study Session
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Study History</h2>
        {studyLogs.length === 0 ? (
          <EmptyState message="No study sessions logged yet. Start tracking your study time!" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                  <th className="px-4 py-3 text-left rounded-tl-xl">Date</th>
                  <th className="px-4 py-3 text-center">Listening</th>
                  <th className="px-4 py-3 text-center">Reading</th>
                  <th className="px-4 py-3 text-center">Writing</th>
                  <th className="px-4 py-3 text-center">Speaking</th>
                  <th className="px-4 py-3 text-center">Total</th>
                  <th className="px-4 py-3 text-left">Notes</th>
                  <th className="px-4 py-3 text-center rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody>
                {studyLogs.map((log, idx) => {
                  const total = (parseFloat(log.listening) || 0) + 
                               (parseFloat(log.reading) || 0) + 
                               (parseFloat(log.writing) || 0) + 
                               (parseFloat(log.speaking) || 0);
                  return (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{log.date}</td>
                      <td className="px-4 py-3 text-center">{log.listening || 0}h</td>
                      <td className="px-4 py-3 text-center">{log.reading || 0}h</td>
                      <td className="px-4 py-3 text-center">{log.writing || 0}h</td>
                      <td className="px-4 py-3 text-center">{log.speaking || 0}h</td>
                      <td className="px-4 py-3 text-center font-bold text-blue-600">
                        {total.toFixed(1)}h
                      </td>
                      <td className="px-4 py-3">{log.notes || '--'}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => deleteLog(idx)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Component: VocabularyTab
function VocabularyTab({ vocabulary, setVocabulary }) {
  const [formData, setFormData] = useState({
    word: '',
    meaning: '',
    example: '',
    topic: 'Environment'
  });

  const addVocab = () => {
    if (!formData.word || !formData.meaning) {
      alert('Please enter both word and meaning');
      return;
    }
    setVocabulary([...vocabulary, { 
      ...formData, 
      date: new Date().toISOString().split('T')[0] 
    }]);
    setFormData({
      word: '',
      meaning: '',
      example: '',
      topic: 'Environment'
    });
  };

  const deleteVocab = (index) => {
    if (confirm('Are you sure you want to delete this vocabulary?')) {
      setVocabulary(vocabulary.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Vocabulary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Word/Phrase</label>
            <input
              type="text"
              value={formData.word}
              onChange={(e) => setFormData({ ...formData, word: e.target.value })}
              placeholder="e.g., Inevitable"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Meaning</label>
            <input
              type="text"
              value={formData.meaning}
              onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
              placeholder="e.g., Certain to happen; unavoidable"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Example Sentence</label>
          <input
            type="text"
            value={formData.example}
            onChange={(e) => setFormData({ ...formData, example: e.target.value })}
            placeholder="e.g., Climate change is inevitable without action."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
          <select
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
          >
            <option>Environment</option>
            <option>Education</option>
            <option>Technology</option>
            <option>Health</option>
            <option>Society</option>
            <option>Culture</option>
            <option>Economics</option>
            <option>Science</option>
            <option>Other</option>
          </select>
        </div>
        <button
          onClick={addVocab}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Vocabulary
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Vocabulary List</h2>
        {vocabulary.length === 0 ? (
          <EmptyState message="No vocabulary added yet. Start building your word bank!" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                  <th className="px-4 py-3 text-left rounded-tl-xl">Word</th>
                  <th className="px-4 py-3 text-left">Meaning</th>
                  <th className="px-4 py-3 text-left">Example</th>
                  <th className="px-4 py-3 text-left">Topic</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-center rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody>
                {vocabulary.map((vocab, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold">{vocab.word}</td>
                    <td className="px-4 py-3">{vocab.meaning}</td>
                    <td className="px-4 py-3 italic">{vocab.example || '--'}</td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                        {vocab.topic}
                      </span>
                    </td>
                    <td className="px-4 py-3">{vocab.date}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => deleteVocab(idx)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Component: GoalsTab
function GoalsTab({ goals, setGoals }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Set Your Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Overall Band Score
            </label>
            <input
              type="number"
              min="0"
              max="9"
              step="0.5"
              value={goals.targetOverall}
              onChange={(e) => setGoals({ ...goals, targetOverall: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Test Date</label>
            <input
              type="date"
              value={goals.examDate}
              onChange={(e) => setGoals({ ...goals, examDate: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Listening Target
            </label>
            <input
              type="number"
              min="0"
              max="9"
              step="0.5"
              value={goals.targetListening}
              onChange={(e) => setGoals({ ...goals, targetListening: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reading Target
            </label>
            <input
              type="number"
              min="0"
              max="9"
              step="0.5"
              value={goals.targetReading}
              onChange={(e) => setGoals({ ...goals, targetReading: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Writing Target
            </label>
            <input
              type="number"
              min="0"
              max="9"
              step="0.5"
              value={goals.targetWriting}
              onChange={(e) => setGoals({ ...goals, targetWriting: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Speaking Target
            </label>
            <input
              type="number"
              min="0"
              max="9"
              step="0.5"
              value={goals.targetSpeaking}
              onChange={(e) => setGoals({ ...goals, targetSpeaking: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
            />
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Save className="w-5 h-5" />
          Goals Saved Automatically
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Study Plan</h2>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Weekly Study Goal (hours)
          </label>
          <input
            type="number"
            min="0"
            value={goals.weeklyGoal}
            onChange={(e) => setGoals({ ...goals, weeklyGoal: parseFloat(e.target.value) })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Focus Areas This Week
          </label>
          <textarea
            value={goals.weeklyFocus}
            onChange={(e) => setGoals({ ...goals, weeklyFocus: e.target.value })}
            rows="6"
            placeholder="What will you focus on this week?"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
          ></textarea>
        </div>
        <button
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Save className="w-5 h-5" />
          Plan Saved Automatically
        </button>
      </div>
    </div>
  );
}

// Component: ResourcesTab
function ResourcesTab() {
  const resources = [
    {
      category: '🎯 Official IELTS Resources',
      items: [
        { name: 'IELTS Official', url: 'https://www.ielts.org/', desc: 'Official IELTS website' },
        { name: 'British Council', url: 'https://www.britishcouncil.org/exam/ielts', desc: 'Free practice materials' },
        { name: 'Cambridge IELTS', url: 'https://www.cambridgeenglish.org/', desc: 'Official practice tests' },
      ]
    },
    {
      category: '📚 Practice Materials',
      items: [
        { name: 'IELTS Liz', url: 'https://ieltsliz.com/', desc: 'Free lessons and tips' },
        { name: 'IELTS Advantage', url: 'https://www.ieltsadvantage.com/', desc: 'Comprehensive resources' },
        { name: 'Road to IELTS', url: 'https://takeielts.britishcouncil.org/', desc: 'Practice tests' },
        { name: 'BBC Learning', url: 'https://www.bbc.co.uk/learningenglish/', desc: 'Improve your English' },
      ]
    },
    {
      category: '🛠️ Study Tools',
      items: [
        { name: 'Write & Improve', url: 'https://writeandimprove.com/', desc: 'Free writing tool' },
        { name: 'Anki', url: 'https://apps.ankiweb.net/', desc: 'Flashcard app' },
        { name: 'Quizlet', url: 'https://quizlet.com/', desc: 'Study sets' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {resources.map((section, idx) => (
        <div key={idx} className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{section.category}</h2>
          <div className="space-y-4">
            {section.items.map((resource, i) => (
              <div
                key={i}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">{resource.name}</h3>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 font-semibold block mb-2"
                >
                  {resource.url}
                </a>
                <p className="text-gray-600">{resource.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
