"use client";

import React, { useState, useMemo } from "react";
import { 
  X, 
  MessageCircle, 
  Copy, 
  Check, 
  Send, 
  ExternalLink
} from "lucide-react";

export interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceTitle: string;
  resourceType?: string;
  grade?: string;
  subject?: string;
  chapter?: string;
  shareUrl?: string;
}

export function WhatsAppShareModal({
  isOpen,
  onClose,
  resourceTitle,
  resourceType = "Material",
  grade = "Class 8",
  subject = "Science",
  chapter = "Chapter 1",
  shareUrl,
}: WhatsAppShareModalProps) {
  const [templateType, setTemplateType] = useState<"hinglish" | "english" | "hindi">("hinglish");
  const [copied, setCopied] = useState(false);
  const [customDeadline, setCustomDeadline] = useState("Tomorrow by 5:00 PM");
  const [teacherSignature, setTeacherSignature] = useState("Your Subject Teacher");

  const effectiveUrl = useMemo(() => {
    if (shareUrl) return shareUrl;
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "https://teachersathi.in";
  }, [shareUrl]);

  // Generate localized pre-filled text
  const messageText = useMemo(() => {
    const cleanGrade = grade.replace("class-", "Class ");
    const cleanSub = subject.charAt(0).toUpperCase() + subject.slice(1);
    const typeLabel = resourceType ? ` [${resourceType.replace("-", " ").toUpperCase()}]` : "";

    if (templateType === "hinglish") {
      return `📚 *TeacherSathi Class Update*\n\n` +
        `नमस्ते अभिभावक एवं प्यारे बच्चों! 🙏\n\n` +
        `आज *${cleanGrade} (${cleanSub})* में हमने *${resourceTitle}*${typeLabel} का अध्ययन किया है।\n\n` +
        `📝 *आज का कार्य / स्टडी लिंक:*\n${effectiveUrl}\n\n` +
        `⏰ *जमा करने का समय:* ${customDeadline}\n` +
        `सभी विद्यार्थी लिंक खोलकर अभ्यास पूरा करें।\n\n` +
        `धन्यवाद,\n*${teacherSignature}*`;
    }

    if (templateType === "hindi") {
      return `📚 *शिक्षक साथी — कक्षा सूचना*\n\n` +
        `प्रिय अभिभावक एवं प्रिय छात्र,\n\n` +
        `कक्षा *${cleanGrade}* के विषय *${cleanSub}* में आज का पाठ:\n*${resourceTitle}*\n\n` +
        `🔗 *अभ्यास व अध्ययन सामग्री लिंक:*\n${effectiveUrl}\n\n` +
        `📅 *अंतिम तिथि:* ${customDeadline}\n` +
        `कृपया समय पर अध्ययन सामग्री का अवलोकन कर गृहकार्य पूर्ण करें।\n\n` +
        `सादर,\n*${teacherSignature}*`;
    }

    // Default: Formal English
    return `📚 *Classroom Notice — ${cleanGrade} ${cleanSub}*\n\n` +
      `Dear Students & Parents,\n\n` +
      `Study material and practice resources for *${resourceTitle}* (${chapter}) have been published.\n\n` +
      `🔗 *Access Material Here:*\n${effectiveUrl}\n\n` +
      `⏱️ *Submission Deadline:* ${customDeadline}\n` +
      `Please ensure this is reviewed and completed on time.\n\n` +
      `Best regards,\n*${teacherSignature}*`;
  }, [templateType, grade, subject, resourceTitle, resourceType, chapter, effectiveUrl, customDeadline, teacherSignature]);

  const [editableMessage, setEditableMessage] = useState(messageText);

  // Sync when template changes
  React.useEffect(() => {
    setEditableMessage(messageText);
  }, [messageText]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(editableMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(editableMessage);
    const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenWhatsAppWeb = () => {
    const encoded = encodeURIComponent(editableMessage);
    const waWebUrl = `https://web.whatsapp.com/send?text=${encoded}`;
    window.open(waWebUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                Share on WhatsApp
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  1-Tap Send
                </span>
              </h3>
              <p className="text-xs text-gray-500">
                Share homework &amp; slides directly to student or parent class groups
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-200/80 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Template Selector Pills */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              Select Message Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemplateType("hinglish")}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  templateType === "hinglish"
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Hinglish Friendly
              </button>
              <button
                type="button"
                onClick={() => setTemplateType("hindi")}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  templateType === "hindi"
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                शुद्ध हिंदी
              </button>
              <button
                type="button"
                onClick={() => setTemplateType("english")}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                  templateType === "english"
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Formal English
              </button>
            </div>
          </div>

          {/* Quick Customization Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1">
                Deadline / Time
              </label>
              <input
                type="text"
                value={customDeadline}
                onChange={(e) => setCustomDeadline(e.target.value)}
                placeholder="e.g. Tomorrow 5 PM"
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1">
                Teacher Name / Signature
              </label>
              <input
                type="text"
                value={teacherSignature}
                onChange={(e) => setTeacherSignature(e.target.value)}
                placeholder="e.g. Sharma Sir / Subject Teacher"
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Editable WhatsApp Preview Bubble */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2 flex items-center justify-between">
              <span>Message Preview (Editable)</span>
              <span className="text-[10px] text-emerald-700 font-semibold lowercase">
                Tap inside to edit before sending
              </span>
            </label>
            <div className="relative rounded-2xl bg-[#EFEAE2] p-4 border border-[#DAD3C8]">
              {/* WhatsApp message bubble styling */}
              <div className="bg-white rounded-xl p-3 shadow-xs border border-gray-100">
                <textarea
                  value={editableMessage}
                  onChange={(e) => setEditableMessage(e.target.value)}
                  rows={9}
                  className="w-full text-xs sm:text-sm text-gray-800 bg-transparent resize-none focus:outline-hidden leading-relaxed font-sans"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-white text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-500" />
                <span>Copy Message</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleOpenWhatsAppWeb}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Open in WhatsApp Web browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>WhatsApp Web</span>
            </button>
            <button
              onClick={handleOpenWhatsApp}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              <span>Send via WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
