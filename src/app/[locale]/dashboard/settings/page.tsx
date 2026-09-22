"use client";

import { useState, useEffect } from "react";
import { User, Settings, Save, CheckCircle2, Monitor } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input } from "@/components/ui";

export default function SettingsPage() {
  const [name, setName] = useState("Teacher");
  const [schoolName, setSchoolName] = useState("Government Senior Secondary School");
  const [udiseCode, setUdiseCode] = useState("UDISE-060201");
  const [language, setLanguage] = useState("en");
  const [classroomTheme, setClassroomTheme] = useState("dark");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("last_sathi_teacher_name");
    const storedSchool = localStorage.getItem("last_sathi_school_name");
    const storedUdise = localStorage.getItem("last_sathi_school_code");
    const storedLang = localStorage.getItem("last_sathi_language");

    if (storedName) setName(storedName);
    if (storedSchool) setSchoolName(storedSchool);
    if (storedUdise) setUdiseCode(storedUdise);
    if (storedLang) setLanguage(storedLang);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("last_sathi_teacher_name", name);
    localStorage.setItem("last_sathi_school_name", schoolName);
    localStorage.setItem("last_sathi_school_code", udiseCode);
    localStorage.setItem("last_sathi_language", language);
    localStorage.setItem("classroom_display_theme", classroomTheme);

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="bg-gradient-to-br from-[#14532D] to-[#15803D] text-white p-8 rounded-3xl shadow-lg flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
            <Settings className="w-3.5 h-3.5 text-amber-300" />
            Educator Preferences
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif">Account &amp; Display Settings</h1>
          <p className="text-emerald-100 text-xs sm:text-sm font-medium">
            Configure your teaching profile, school affiliation, and 75-inch smartboard display options.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#0F5B38]" />
              Teacher Profile &amp; School
            </CardTitle>
            <CardDescription>
              Your profile information helps customize generated worksheets and lesson plans.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anjali Sharma"
              />
              <Input
                label="UDISE / School Code"
                value={udiseCode}
                onChange={(e) => setUdiseCode(e.target.value)}
                placeholder="e.g. UDISE-060201"
              />
            </div>
            <Input
              label="School Name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="e.g. Government Model Senior Secondary School"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-[#0F5B38]" />
              75-inch Classroom Display Preferences
            </CardTitle>
            <CardDescription>
              Adjust high-contrast settings to reduce glare in your school classroom.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Default Smartboard Theme
                </label>
                <select
                  value={classroomTheme}
                  onChange={(e) => setClassroomTheme(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                >
                  <option value="dark">Low-Glare Slate Dark (Recommended)</option>
                  <option value="light">High-Contrast Daylight Light</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Primary Teaching Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                >
                  <option value="en">English (Bilingual Notes)</option>
                  <option value="hi">हिंदी (Devanagari)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Settings saved successfully!
            </span>
          ) : (
            <span />
          )}

          <Button type="submit" size="default" icon={<Save className="w-4 h-4" />}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
