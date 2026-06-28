"use client";

import { Sparkles, Image as ImageIcon, Video, Plus, Settings, Save, Clock, HelpCircle, EyeOff } from "lucide-react";

export default function AssessmentEditorPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">AI Quiz & Lesson Creator</h1>
          <p className="text-gray-300 mt-2 text-sm leading-relaxed max-w-2xl">
            Create customized NCERT practice quizzes, bilingual chapter assessments, and structured AI lesson plans tailored for your Indian classroom curriculum in seconds. (Physics - Light Reflection & Refraction)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">30 Mins</span>
          </div>
          <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-700">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors shadow-lg shadow-indigo-600/20">
            <Save className="w-4 h-4" /> Save Draft
          </button>
        </div>
      </div>

      <div className="flex gap-8 flex-1">
        {/* Main Editor Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm bg-indigo-400/10 px-3 py-1 rounded-full">
                <HelpCircle className="w-4 h-4" /> Question 1
              </div>
              <button className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors bg-amber-400/10 hover:bg-amber-400/20 px-3 py-1 rounded-full">
                <Sparkles className="w-4 h-4" /> Enhance with AI
              </button>
            </div>

            <textarea 
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] resize-y mb-4"
              placeholder="Type your question here... e.g. What is the angle of incidence?"
            ></textarea>

            <div className="flex gap-3 border-t border-gray-700 pt-4">
              <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors bg-gray-900 border border-gray-700 px-3 py-1.5 rounded-lg">
                <ImageIcon className="w-4 h-4" /> Add Image
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors bg-gray-900 border border-gray-700 px-3 py-1.5 rounded-lg">
                <Video className="w-4 h-4" /> Add Video
              </button>
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Options</h2>
            {['A', 'B', 'C', 'D'].map((opt, i) => (
              <div key={opt} className={`flex items-center gap-4 bg-gray-800 p-3 rounded-lg border ${i === 0 ? 'border-green-500/50 bg-green-500/5' : 'border-gray-700'}`}>
                <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                  {opt}
                </div>
                <input 
                  type="text" 
                  placeholder={`Option ${opt}`}
                  className="flex-1 bg-transparent text-white focus:outline-none"
                  defaultValue={i === 0 ? "The angle between the incident ray and the normal" : ""}
                />
                <button className="text-gray-500 hover:text-white p-1">
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium text-sm mt-4 transition-colors">
              <Plus className="w-4 h-4" /> Add Option (E)
            </button>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="w-72 space-y-6">
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="font-semibold text-white mb-4">Question Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-2">Marks</label>
                <input type="number" defaultValue={2} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-2">Question Type</label>
                <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none">
                  <option>Multiple Choice</option>
                  <option>True / False</option>
                  <option>Short Answer</option>
                  <option>Poll</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors flex items-center gap-2">
                    <EyeOff className="w-4 h-4" /> Hide Answer
                  </span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
