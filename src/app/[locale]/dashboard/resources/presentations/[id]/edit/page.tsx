"use client";

import { useState, useEffect, useCallback, use } from "react";
import { Link } from "@/i18n/routing";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle 
} from "lucide-react";
import type { PresentationSlide, SlideType, PresentationContent } from "@/lib/validations/resources";
import { SmartboardSlideViewer } from "@/components/classroom/SmartboardSlideViewer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PresentationEditorPage({ params }: PageProps) {
  const { id } = use(params);
  const [title, setTitle] = useState("");
  const [slides, setSlides] = useState<PresentationSlide[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<"EDIT" | "PREVIEW">("EDIT");

  const loadPresentation = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/presentations/${id}`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        setTitle(data.title || "Untitled Presentation");
        const content = data.content as PresentationContent;
        if (content && content.slides && content.slides.length > 0) {
          setSlides(content.slides);
        } else {
          setSlides([
            {
              id: "slide-1",
              slide_number: 1,
              type: "TITLE",
              title: data.title || "Lesson Introduction",
              subtitle: "NCERT Curriculum Presentation",
              bullets: [],
              speaker_notes: "",
            },
          ]);
        }
      }
    } catch (err) {
      console.error("Failed to load presentation:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPresentation();
  }, [loadPresentation]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`/api/presentations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: {
            title,
            slides,
            theme: "LIGHT",
          },
          change_summary: `Edited presentation slides (${slides.length} slides)`,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const json = await res.json();
        alert(json.error || "Failed to save presentation.");
      }
    } catch {
      alert("Error saving presentation.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSlide = (type: SlideType = "CONTENT") => {
    const newSlide: PresentationSlide = {
      id: `slide-${Date.now()}`,
      slide_number: slides.length + 1,
      type,
      title: type === "TITLE" ? "Topic Title" : type === "QUESTION" ? "Formative Question" : "Concept Key Points",
      subtitle: type === "CONTENT" ? "Concept Explanation" : undefined,
      bullets: type === "CONTENT" || type === "SUMMARY" ? ["First core learning point", "Second core learning point"] : [],
      speaker_notes: "",
      question_text: type === "QUESTION" ? "Enter your multiple-choice question here" : undefined,
      question_options: type === "QUESTION" ? ["Option A", "Option B", "Option C", "Option D"] : undefined,
      correct_option_index: type === "QUESTION" ? 0 : undefined,
    };
    const updated = [...slides, newSlide];
    setSlides(updated);
    setActiveSlideIndex(updated.length - 1);
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) {
      alert("A presentation must have at least one slide.");
      return;
    }
    const updated = slides.filter((_, i) => i !== index);
    setSlides(updated);
    setActiveSlideIndex(Math.max(0, Math.min(index, updated.length - 1)));
  };

  const handleMoveSlide = (index: number, direction: "UP" | "DOWN") => {
    const targetIndex = direction === "UP" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSlides(updated);
    setActiveSlideIndex(targetIndex);
  };

  const updateActiveSlide = (field: keyof PresentationSlide, value: unknown) => {
    const updated = [...slides];
    updated[activeSlideIndex] = {
      ...updated[activeSlideIndex],
      [field]: value,
    };
    setSlides(updated);
  };

  const currentSlide = slides[activeSlideIndex] || slides[0];

  // Smartboard Readability Analysis
  const bulletsCount = currentSlide?.bullets?.length || 0;
  const wordCount = (
    (currentSlide?.title || "") + " " +
    (currentSlide?.subtitle || "") + " " +
    (currentSlide?.body || "") + " " +
    (currentSlide?.bullets || []).join(" ")
  ).trim().split(/\s+/).filter(Boolean).length;

  const isTooLong = wordCount > 60;
  const tooManyBullets = bulletsCount > 5;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loading Smartboard Editor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-gray-50">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/resources/${id}`}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-serif font-black text-lg text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-emerald-600 focus:outline-none px-1"
            />
            <span className="text-[11px] font-mono text-gray-400 block px-1">
              75&quot; Smartboard Interactive Canvas • {slides.length} Slides
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("EDIT")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "EDIT" ? "bg-white text-gray-900 shadow-2xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setViewMode("PREVIEW")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "PREVIEW" ? "bg-white text-gray-900 shadow-2xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Smartboard 75&quot; Preview
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            {isSaving ? "Saving..." : saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Draft
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Sidebar: Slide Thumbnails */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between overflow-y-auto flex-shrink-0">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-gray-500">
              <span>Slides List</span>
              <button
                onClick={() => handleAddSlide("CONTENT")}
                className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                title="Add new slide"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {slides.map((slide, idx) => {
                const isActive = idx === activeSlideIndex;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 group ${
                      isActive
                        ? "border-emerald-600 bg-emerald-50/50 shadow-2xs"
                        : "border-gray-200 hover:bg-gray-50 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold text-gray-400">
                        #{idx + 1}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        {slide.type}
                      </span>
                    </div>
                    <p className="font-bold text-xs text-gray-800 line-clamp-1">
                      {slide.title || "Untitled Slide"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => handleAddSlide("QUESTION")}
              className="w-full py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> + Add Quiz Slide
            </button>
          </div>
        </div>

        {/* Center / Right Canvas Area */}
        {viewMode === "PREVIEW" ? (
          <div className="flex-1 p-6 bg-gray-900 flex items-center justify-center overflow-hidden">
            <div className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <SmartboardSlideViewer
                slide={currentSlide}
                slideIndex={activeSlideIndex}
                totalSlides={slides.length}
                presentationTitle={title}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto space-y-6">
            {/* Slide Action Bar: Reordering & Deletion */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-gray-700">
                  Editing Slide {activeSlideIndex + 1} of {slides.length}
                </span>
                <select
                  value={currentSlide.type}
                  onChange={(e) => updateActiveSlide("type", e.target.value as SlideType)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 font-bold text-xs text-gray-700 focus:outline-none"
                >
                  <option value="TITLE">Title Slide</option>
                  <option value="CONTENT">Content & Bullets</option>
                  <option value="IMAGE">Image / Diagram</option>
                  <option value="DIAGRAM">Code / Flowchart</option>
                  <option value="QUESTION">Clicker Question</option>
                  <option value="ACTIVITY">Classroom Activity</option>
                  <option value="SUMMARY">Key Summary</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMoveSlide(activeSlideIndex, "UP")}
                  disabled={activeSlideIndex === 0}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-600"
                  title="Move slide up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveSlide(activeSlideIndex, "DOWN")}
                  disabled={activeSlideIndex === slides.length - 1}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-600"
                  title="Move slide down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSlide(activeSlideIndex)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors ml-2"
                  title="Delete slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Smartboard Readability Alert */}
            {(isTooLong || tooManyBullets) && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-amber-900">
                  <p className="font-bold">Smartboard 75&quot; Readability Alert</p>
                  <p>
                    {isTooLong && `Slide has ${wordCount} words (recommended: max 60 words for back-row visibility). `}
                    {tooManyBullets && `Slide has ${bulletsCount} bullets (recommended: max 5 bullets per slide).`}
                  </p>
                </div>
              </div>
            )}

            {/* Slide Editor Fields */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xs">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Slide Title *
                </label>
                <input
                  type="text"
                  value={currentSlide.title}
                  onChange={(e) => updateActiveSlide("title", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {currentSlide.type !== "QUESTION" && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Subtitle (Optional)
                  </label>
                  <input
                    type="text"
                    value={currentSlide.subtitle || ""}
                    onChange={(e) => updateActiveSlide("subtitle", e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              {/* Question Specific Fields */}
              {currentSlide.type === "QUESTION" && (
                <div className="space-y-4 p-5 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <div>
                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                      Question Prompt *
                    </label>
                    <textarea
                      rows={2}
                      value={currentSlide.question_text || ""}
                      onChange={(e) => updateActiveSlide("question_text", e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Options (Select the radio of correct option)
                    </label>
                    {(currentSlide.question_options || ["", "", "", ""]).map((opt, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="correct_option"
                          checked={currentSlide.correct_option_index === i}
                          onChange={() => updateActiveSlide("correct_option_index", i)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="font-bold text-xs text-amber-800 w-5">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...(currentSlide.question_options || ["", "", "", ""])];
                            newOptions[i] = e.target.value;
                            updateActiveSlide("question_options", newOptions);
                          }}
                          className="flex-1 px-3 py-1.5 bg-white border border-amber-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Diagram / Code Specific Field */}
              {currentSlide.type === "DIAGRAM" && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Diagram Code / Mermaid / Syntax Flow
                  </label>
                  <textarea
                    rows={6}
                    value={currentSlide.diagram_code || ""}
                    onChange={(e) => updateActiveSlide("diagram_code", e.target.value)}
                    className="w-full p-4 bg-gray-950 text-emerald-300 font-mono rounded-xl text-xs focus:outline-none"
                  />
                </div>
              )}

              {/* Activity Specific Field */}
              {currentSlide.type === "ACTIVITY" && (
                <div>
                  <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                    Activity Instructions & Prompt
                  </label>
                  <textarea
                    rows={3}
                    value={currentSlide.activity_prompt || ""}
                    onChange={(e) => updateActiveSlide("activity_prompt", e.target.value)}
                    className="w-full px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>
              )}

              {/* Bullets List */}
              {(currentSlide.type === "CONTENT" || currentSlide.type === "SUMMARY" || currentSlide.type === "ACTIVITY") && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Bullet Points ({bulletsCount}/5 recommended)
                    </label>
                    <button
                      onClick={() => {
                        const newBullets = [...(currentSlide.bullets || []), ""];
                        updateActiveSlide("bullets", newBullets);
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      + Add Bullet
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(currentSlide.bullets || []).map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const newBullets = [...(currentSlide.bullets || [])];
                            newBullets[bIdx] = e.target.value;
                            updateActiveSlide("bullets", newBullets);
                          }}
                          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          onClick={() => {
                            const newBullets = (currentSlide.bullets || []).filter((_, i) => i !== bIdx);
                            updateActiveSlide("bullets", newBullets);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Speaker Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Teacher Private Speaker Notes (Visible only on Controller Device)
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes, pedagogical pacing hints, or student misconception warnings..."
                  value={currentSlide.speaker_notes || ""}
                  onChange={(e) => updateActiveSlide("speaker_notes", e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
