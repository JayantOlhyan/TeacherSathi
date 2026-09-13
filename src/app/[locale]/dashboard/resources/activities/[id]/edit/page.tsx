"use client";

import { useState, useEffect, useCallback, use } from "react";
import { Link } from "@/i18n/routing";
import { 
  ArrowLeft, 
  Save, 
  Users, 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle
} from "lucide-react";
import type { TeachingActivityContent, ActivityArchetype } from "@/lib/validations/resources";

interface PageProps {
  params: Promise<{ id: string }>;
}

const ARCHETYPES: Array<{ type: ActivityArchetype; label: string; desc: string }> = [
  { type: "THINK_PAIR_SHARE", label: "Think-Pair-Share", desc: "Individual reflection → partner discussion → class synthesis" },
  { type: "JIGSAW", label: "Jigsaw Collaborative", desc: "Expert groups research sub-topics, then teach their home groups" },
  { type: "GALLERY_WALK", label: "Gallery Walk", desc: "Students rotate around exhibits/charts to comment and evaluate" },
  { type: "FOUR_CORNERS", label: "Four Corners", desc: "Students move to corners representing positions on an issue" },
  { type: "ROLE_PLAY", label: "Role Play Simulation", desc: "Students act out scientific or historical scenarios" },
  { type: "CONCEPT_ATTAINMENT", label: "Concept Attainment", desc: "Inductive reasoning using yes/no examples to deduce rules" },
  { type: "FISHBOWL", label: "Fishbowl Discussion", desc: "Inner circle debates while outer circle observes and notes" },
  { type: "SOCRATIC_SEMINAR", label: "Socratic Seminar", desc: "Formal dialogue based on text and probing questions" },
  { type: "STATIONS", label: "Learning Stations", desc: "Timed rotations through distinct task-focused table stations" },
  { type: "PEER_INSTRUCTION", label: "Peer Instruction", desc: "Concept tests followed by peer convincing and re-voting" },
];

export default function TeachingActivityEditorPage({ params }: PageProps) {
  const { id } = use(params);
  const [title, setTitle] = useState("");
  const [archetype, setArchetype] = useState<ActivityArchetype>("THINK_PAIR_SHARE");
  const [gradeLevel, setGradeLevel] = useState("Grade 8");
  const [subject, setSubject] = useState("Science");
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [learningObjectives, setLearningObjectives] = useState<string[]>([""]);
  const [materialsNeeded, setMaterialsNeeded] = useState<string[]>([""]);
  const [procedure, setProcedure] = useState<
    Array<{ phase: string; duration_minutes: number; teacher_instruction: string; student_action: string }>
  >([
    { phase: "THINK", duration_minutes: 3, teacher_instruction: "Pose discussion prompt", student_action: "Silent note-taking" },
    { phase: "PAIR", duration_minutes: 7, teacher_instruction: "Facilitate partner exchange", student_action: "Debate and refine points" },
    { phase: "SHARE", duration_minutes: 10, teacher_instruction: "Call on representative pairs", student_action: "Present consensus" },
  ]);
  const [assessmentStrategy, setAssessmentStrategy] = useState("");
  const [differentiation, setDifferentiation] = useState("");

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadActivity = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/activities/${id}`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        setTitle(data.title || "Classroom Activity");
        const content = data.content as TeachingActivityContent;
        if (content) {
          setArchetype(content.archetype || "THINK_PAIR_SHARE");
          setGradeLevel(content.grade_level || "Grade 8");
          setSubject(content.subject || "Science");
          setDurationMinutes(content.duration_minutes || 20);
          setLearningObjectives(content.learning_objectives?.length ? content.learning_objectives : [""]);
          setMaterialsNeeded(content.materials_needed?.length ? content.materials_needed : [""]);
          if (content.procedure?.length) {
            setProcedure(
              content.procedure.map((p, i) => ({
                phase: p.phase || `PHASE ${i + 1}`,
                duration_minutes: p.duration_minutes || p.duration_mins || 5,
                teacher_instruction: p.teacher_instruction || p.teacher_prompt || "",
                student_action: p.student_action || "",
              }))
            );
          }
          setAssessmentStrategy(content.assessment_strategy || "");
          setDifferentiation(content.differentiation || "");
        }
      }
    } catch (err) {
      console.error("Failed to load teaching activity:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: {
            archetype,
            grade_level: gradeLevel,
            subject,
            duration_minutes: Number(durationMinutes),
            learning_objectives: learningObjectives.filter((o) => o.trim().length > 0),
            materials_needed: materialsNeeded.filter((m) => m.trim().length > 0),
            procedure,
            assessment_strategy: assessmentStrategy || undefined,
            differentiation: differentiation || undefined,
          },
          change_summary: `Updated activity (${archetype}, ${procedure.length} steps)`,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const json = await res.json();
        alert(json.error || "Failed to save activity.");
      }
    } catch {
      alert("Error saving teaching activity.");
    } finally {
      setIsSaving(false);
    }
  };

  const totalProcedureMinutes = procedure.reduce((acc, step) => acc + (Number(step.duration_minutes) || 0), 0);
  const isTimeMismatch = totalProcedureMinutes !== Number(durationMinutes);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loading Teaching Activity Editor...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Navbar */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
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
              className="font-serif font-black text-xl text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-emerald-600 focus:outline-none px-1"
            />
            <span className="text-[11px] font-mono text-gray-400 block px-1">
              Active Pedagogical Design • {archetype.replace(/_/g, " ")} • {durationMinutes} Mins
            </span>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
        >
          {isSaving ? "Saving..." : saveSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Teaching Activity
            </>
          )}
        </button>
      </div>

      {/* Main Settings Form */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div>
          <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
            Pedagogical Archetype *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {ARCHETYPES.map((arch) => {
              const isSelected = archetype === arch.type;
              return (
                <div
                  key={arch.type}
                  onClick={() => setArchetype(arch.type)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? "border-amber-500 bg-amber-50/60 shadow-2xs"
                      : "border-gray-200 hover:bg-gray-50 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-900">{arch.label}</span>
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{arch.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Duration & Grade Level */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Grade Level
            </label>
            <input
              type="text"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Duration (Minutes, max 45)
            </label>
            <input
              type="number"
              min="5"
              max="45"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
            />
          </div>
        </div>

        {/* Step-by-Step Procedure */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-gray-900">Step-by-Step Classroom Procedure</h3>
              <span className="text-xs text-gray-500">
                Total Steps Time: {totalProcedureMinutes} min / Allocated: {durationMinutes} min
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setProcedure([
                  ...procedure,
                  {
                    phase: `PHASE ${procedure.length + 1}`,
                    duration_minutes: 5,
                    teacher_instruction: "",
                    student_action: "",
                  },
                ])
              }
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Phase
            </button>
          </div>

          {isTimeMismatch && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Sum of phase durations ({totalProcedureMinutes}m) differs from overall duration ({durationMinutes}m).
              </span>
            </div>
          )}

          <div className="space-y-3">
            {procedure.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-gray-400">#{idx + 1}</span>
                    <input
                      type="text"
                      placeholder="Phase Name (e.g. Think / Pair)"
                      value={step.phase}
                      onChange={(e) => {
                        const updated = [...procedure];
                        updated[idx].phase = e.target.value;
                        setProcedure(updated);
                      }}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-600">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={step.duration_minutes}
                        onChange={(e) => {
                          const updated = [...procedure];
                          updated[idx].duration_minutes = Number(e.target.value);
                          setProcedure(updated);
                        }}
                        className="w-12 px-1.5 py-1 bg-white border border-gray-200 rounded-lg text-xs text-center font-bold"
                      />
                      <span>mins</span>
                    </div>
                    {procedure.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setProcedure(procedure.filter((_, i) => i !== idx))}
                        className="p-1 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-lg transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Teacher Instruction
                    </label>
                    <textarea
                      rows={2}
                      placeholder="What the teacher says or organizes..."
                      value={step.teacher_instruction}
                      onChange={(e) => {
                        const updated = [...procedure];
                        updated[idx].teacher_instruction = e.target.value;
                        setProcedure(updated);
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Student Action
                    </label>
                    <textarea
                      rows={2}
                      placeholder="What students do (pairs, individual notes)..."
                      value={step.student_action}
                      onChange={(e) => {
                        const updated = [...procedure];
                        updated[idx].student_action = e.target.value;
                        setProcedure(updated);
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Differentiation & Assessment Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Assessment Strategy
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Exit ticket check, verbal rubric, observation checklist..."
              value={assessmentStrategy}
              onChange={(e) => setAssessmentStrategy(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Differentiation / Inclusion Guidance
            </label>
            <textarea
              rows={2}
              placeholder="Support for diverse learners or accelerated challenges..."
              value={differentiation}
              onChange={(e) => setDifferentiation(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
