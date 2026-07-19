"use client";

import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, CheckCircle2, XCircle, 
  ArrowUp, ArrowDown, Search, AlertTriangle 
} from "lucide-react";
import { adminStore, Subject, Class } from "@/lib/adminStore";

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals / forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [subjectName, setSubjectName] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [color, setColor] = useState("#10B981");
  const [isActive, setIsActive] = useState(true);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);

  // Deletion dependency warnings
  const [dependencyWarning, setDependencyWarning] = useState<string | null>(null);
  const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSubjects(
      adminStore.getSubjects()
        .filter(s => !s.is_archived)
        .sort((a, b) => a.display_order - b.display_order)
    );
    setClasses(adminStore.getClasses().filter(c => !c.is_archived));
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setSubjectName("");
    setIconUrl("");
    setColor("#10B981");
    setIsActive(true);
    setSelectedClassIds([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub: Subject) => {
    setEditId(sub.id);
    setSubjectName(sub.name);
    setIconUrl(sub.icon_url);
    setColor(sub.color);
    setIsActive(sub.is_active);
    setSelectedClassIds(sub.class_ids || []);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;

    const id = editId || `sub-${subjectName.toLowerCase().replace(/\s+/g, "-")}`;
    const display_order = editId 
      ? (subjects.find(s => s.id === editId)?.display_order || 1)
      : subjects.length + 1;

    const updatedSub: Subject = {
      id,
      name: subjectName,
      icon_url: iconUrl,
      color,
      is_active: isActive,
      is_archived: false,
      display_order,
      class_ids: selectedClassIds
    };

    adminStore.saveSubject(updatedSub);
    loadData();
    setIsModalOpen(false);
  };

  const handleToggleStatus = (sub: Subject) => {
    const updated = { ...sub, is_active: !sub.is_active };
    adminStore.saveSubject(updated);
    loadData();
  };

  const handleRequestDelete = (id: string) => {
    const relatedBooks = adminStore.getBooks().filter(b => b.subject_id === id && !b.is_archived);
    if (relatedBooks.length > 0) {
      setDependencyWarning(
        `This subject is currently mapped to ${relatedBooks.length} educational books (e.g., "${relatedBooks[0].title}"). Archiving it will hide all textbooks and chapters belonging to this subject.`
      );
      setTargetDeleteId(id);
    } else {
      adminStore.archiveSubject(id);
      loadData();
    }
  };

  const handleConfirmDelete = () => {
    if (targetDeleteId) {
      adminStore.archiveSubject(targetDeleteId);
      loadData();
      setDependencyWarning(null);
      setTargetDeleteId(null);
    }
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= subjects.length) return;

    const reordered = [...subjects];
    const temp = reordered[index];
    reordered[index] = reordered[nextIndex];
    reordered[nextIndex] = temp;

    const orderedIds = reordered.map(s => s.id);
    adminStore.reorderSubjects(orderedIds);
    loadData();
  };

  const handleToggleClass = (classId: string) => {
    if (selectedClassIds.includes(classId)) {
      setSelectedClassIds(selectedClassIds.filter(id => id !== classId));
    } else {
      setSelectedClassIds([...selectedClassIds, classId]);
    }
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Subject Mapping Panel</h2>
          <p className="text-xs text-slate-400 mt-1">
            Register academic courses, set display branding colors, and map subjects to target classes.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors border border-emerald-500 shadow-md shadow-emerald-950/20 w-max"
        >
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {/* Control bar */}
      <div className="bg-[#0F1424] border border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-colors"
          />
        </div>
      </div>

      {/* Dependency Warning dialog */}
      {dependencyWarning && (
        <div className="bg-amber-950/30 border border-amber-900/60 p-4 rounded-xl flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-amber-400">Subject Dependency Warning</h4>
            <p className="text-[11px] text-amber-300 mt-1 leading-relaxed">{dependencyWarning}</p>
            <div className="flex items-center gap-3 mt-3">
              <button 
                onClick={handleConfirmDelete}
                className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-colors"
              >
                Archive Subject
              </button>
              <button 
                onClick={() => setDependencyWarning(null)}
                className="text-slate-400 hover:text-slate-200 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subjects Table */}
      <div className="bg-[#0F1424] border border-slate-800/80 rounded-xl overflow-hidden shadow-lg shadow-slate-950/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-900/40 border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Order</th>
                <th className="p-4">Subject Node ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Color</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned Classes</th>
                <th className="p-4 text-center">Move Order</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-medium">
              {filteredSubjects.map((sub, idx) => (
                <tr key={sub.id} className="hover:bg-slate-900/10">
                  <td className="p-4 pl-6">
                    <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 text-[10px] font-mono font-bold">
                      {sub.display_order}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-400">{sub.id}</td>
                  <td className="p-4 text-slate-200 font-bold flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                    {sub.name}
                  </td>
                  <td className="p-4 font-mono text-slate-400">{sub.color}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleStatus(sub)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors ${sub.is_active ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900/60' : 'bg-slate-950 text-slate-500 border-slate-800'}`}
                    >
                      {sub.is_active ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-slate-500" /> Disabled
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-slate-300">
                    <div className="flex flex-wrap gap-1 max-w-[250px]">
                      {(sub.class_ids || []).map(cid => (
                        <span key={cid} className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-400 font-bold font-mono">
                          {cid.replace("class-", "C-")}
                        </span>
                      ))}
                      {(!sub.class_ids || sub.class_ids.length === 0) && (
                        <span className="text-slate-500 italic">No classes assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex gap-1">
                      <button 
                        onClick={() => handleMoveOrder(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleMoveOrder(idx, 'down')}
                        disabled={idx === filteredSubjects.length - 1}
                        className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button 
                      onClick={() => handleOpenEdit(sub)}
                      className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-slate-300 hover:text-white transition-colors inline-flex"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleRequestDelete(sub.id)}
                      className="p-1.5 bg-rose-950/20 hover:bg-rose-900/30 rounded border border-rose-900/30 text-rose-400 hover:text-rose-300 transition-colors inline-flex"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSubjects.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-bold uppercase tracking-wider">
                    No subjects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0F1424] border border-slate-800 rounded-xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              {editId ? "Modify Subject Mapping" : "Register Subject Node"}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subject Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Science"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subject Display Branding Color</label>
                <div className="flex gap-2.5">
                  <input 
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-[38px] bg-slate-950 border border-slate-800 rounded-lg cursor-pointer"
                  />
                  <input 
                    type="text"
                    placeholder="#10B981"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Upload Icon Path / Identifier</label>
                <input 
                  type="text"
                  placeholder="e.g. icons/subjects/science.svg"
                  value={iconUrl}
                  onChange={(e) => setIconUrl(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Assign to Class Nodes</label>
                <div className="grid grid-cols-2 gap-2 mt-1.5 max-h-[120px] overflow-y-auto bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  {classes.map(cls => {
                    const isChecked = selectedClassIds.includes(cls.id);
                    return (
                      <div key={cls.id} className="flex items-center gap-2">
                        <input 
                          type="checkbox"
                          id={`chk-${cls.id}`}
                          checked={isChecked}
                          onChange={() => handleToggleClass(cls.id)}
                          className="rounded border-slate-800 bg-slate-950 text-emerald-600 focus:ring-0"
                        />
                        <label htmlFor={`chk-${cls.id}`} className="text-xs text-slate-300 font-semibold cursor-pointer">
                          {cls.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="modalIsActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-emerald-600 focus:ring-0"
                />
                <label htmlFor="modalIsActive" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Mark active on initial load
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-200 text-xs font-bold uppercase tracking-wider py-2 px-4"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-lg border border-emerald-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
