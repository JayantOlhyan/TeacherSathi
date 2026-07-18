import { supabase } from "./supabase";

// Interfaces
export interface Class {
  id: string;
  name: string;
  cover_image_url: string;
  is_active: boolean;
  is_archived: boolean;
  display_order: number;
}

export interface Subject {
  id: string;
  name: string;
  icon_url: string;
  color: string;
  is_active: boolean;
  is_archived: boolean;
  display_order: number;
  class_ids: string[]; // Assigned classes
}

export interface Book {
  id: string;
  title: string;
  cover_image_url: string;
  class_id: string;
  subject_id: string;
  edition: string;
  academic_year: string;
  pdf_url: string;
  is_active: boolean;
  is_archived: boolean;
}

export interface Chapter {
  id: string;
  book_id: string;
  chapter_number: number;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  learning_objectives: string;
  keywords: string;
  thumbnail_url: string;
  pdf_url: string;
  publication_status: "DRAFT" | "IN_REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED";
  is_locked: boolean;
  display_order: number;
}

export interface QuestionOption {
  id: string;
  option_text: string;
  is_correct: boolean;
}

export interface Question {
  id: string;
  chapter_id: string;
  question_type: string; // MCQ, Very Short Answer, Short Answer, Long Answer, True/False, etc.
  marks: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  competency_type: string;
  text_en: string;
  text_hi?: string;
  options?: QuestionOption[];
  explanation: string;
  source: string;
  tags: string[];
  status: "DRAFT" | "IN_REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED";
  is_archived: boolean;
}

export interface MediaAsset {
  id: string;
  filename: string;
  display_name: string;
  storage_path: string;
  visibility: "PUBLIC" | "PRIVATE";
  mime_type: string;
  file_size: number;
  uploaded_by: string;
  upload_date: string;
  class_id?: string;
  subject_id?: string;
  chapter_id?: string;
  tags: string[];
  alt_text: string;
  description: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  chapter_id: string;
  duration: string;
  language: string;
  tags: string[];
  source_type: "YOUTUBE" | "STORAGE";
  storage_reference: string;
  publication_status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface Resource {
  id: string;
  title: string;
  type: string; // Worksheet, Presentation, Notes, Lesson Plan, etc.
  file_url: string;
  chapter_id: string;
  class_ids: string[];
  subject_ids: string[];
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  status: "ACTIVE" | "SUSPENDED";
  roles: string[];
  school_name?: string;
  last_active?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  cta: string;
  target: "EVERYONE" | "TEACHERS" | "STUDENTS" | "CLASS_8" | "CLASS_10";
  start_date: string;
  end_date: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface AuditLog {
  id: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  timestamp: string;
  metadata: string;
}

export interface ContentVersion {
  id: string;
  entity_type: string;
  entity_id: string;
  version_number: number;
  changed_by: string;
  changed_at: string;
  change_summary: string;
  data_snapshot: string;
}

// Initial Mock Data
const INITIAL_CLASSES: Class[] = [
  { id: "class-6", name: "Class 6", cover_image_url: "", is_active: true, is_archived: false, display_order: 1 },
  { id: "class-7", name: "Class 7", cover_image_url: "", is_active: true, is_archived: false, display_order: 2 },
  { id: "class-8", name: "Class 8", cover_image_url: "", is_active: true, is_archived: false, display_order: 3 },
  { id: "class-9", name: "Class 9", cover_image_url: "", is_active: true, is_archived: false, display_order: 4 },
  { id: "class-10", name: "Class 10", cover_image_url: "", is_active: true, is_archived: false, display_order: 5 }
];

const INITIAL_SUBJECTS: Subject[] = [
  { id: "maths", name: "Mathematics", icon_url: "", color: "#3B82F6", is_active: true, is_archived: false, display_order: 1, class_ids: ["class-6", "class-7", "class-8", "class-9", "class-10"] },
  { id: "science", name: "Science", icon_url: "", color: "#10B981", is_active: true, is_archived: false, display_order: 2, class_ids: ["class-6", "class-7", "class-8", "class-9", "class-10"] },
  { id: "social", name: "Social Science", icon_url: "", color: "#F59E0B", is_active: true, is_archived: false, display_order: 3, class_ids: ["class-8", "class-10"] },
  { id: "english", name: "English", icon_url: "", color: "#EC4899", is_active: true, is_archived: false, display_order: 4, class_ids: ["class-8"] },
  { id: "hindi", name: "Hindi", icon_url: "", color: "#EF4444", is_active: true, is_archived: false, display_order: 5, class_ids: ["class-8"] }
];

const INITIAL_BOOKS: Book[] = [
  { id: "book-c8-science", title: "Curiosity Science (NCERT)", cover_image_url: "", class_id: "class-8", subject_id: "science", edition: "2026 Edition", academic_year: "2026-27", pdf_url: "", is_active: true, is_archived: false },
  { id: "book-c8-maths", title: "Mathematics for Class 8", cover_image_url: "", class_id: "class-8", subject_id: "maths", edition: "2025 Edition", academic_year: "2025-26", pdf_url: "", is_active: true, is_archived: false },
  { id: "book-c10-science", title: "Science Class 10 Textbook", cover_image_url: "", class_id: "class-10", subject_id: "science", edition: "2026 Edition", academic_year: "2026-27", pdf_url: "", is_active: true, is_archived: false }
];

const INITIAL_CHAPTERS: Chapter[] = [
  {
    id: "ch-crop",
    book_id: "book-c8-science",
    chapter_number: 1,
    title_en: "Crop Production and Management",
    title_hi: "फसल उत्पादन एवं प्रबंध",
    description_en: "Learn about agricultural practices, traditional methods, and modern irrigation tools.",
    description_hi: "कृषि पद्धतियों, पारंपरिक तरीकों और आधुनिक सिंचाई उपकरणों के बारे में जानें।",
    learning_objectives: "Understand farming steps, irrigation, harvesting, and storage.",
    keywords: "Agriculture, Crops, Irrigation, Harvesting, Storage",
    thumbnail_url: "",
    pdf_url: "",
    publication_status: "PUBLISHED",
    is_locked: false,
    display_order: 1
  },
  {
    id: "ch-micro",
    book_id: "book-c8-science",
    chapter_number: 2,
    title_en: "Microorganisms: Friend and Foe",
    title_hi: "सूक्ष्मजीव: मित्र एवं शत्रु",
    description_en: "Explore the microscopic world, helpful microbes, and viral diseases.",
    description_hi: "सूक्ष्मदर्शीय दुनिया, सहायक सूक्ष्मजीवों और वायरल रोगों का पता लगाएं।",
    learning_objectives: "Understand type of microbes, vaccines, and food preservation.",
    keywords: "Bacteria, Virus, Fungi, Vaccine, Pasteurization",
    thumbnail_url: "",
    pdf_url: "",
    publication_status: "PUBLISHED",
    is_locked: false,
    display_order: 2
  },
  {
    id: "ch-light",
    book_id: "book-c10-science",
    chapter_number: 10,
    title_en: "Light — Reflection and Refraction",
    title_hi: "प्रकाश — परावर्तन तथा अपवर्तन",
    description_en: "Study plane/spherical mirrors, lens formula, and magnification calculations.",
    description_hi: "समतल/गोलीय दर्पणों, लेंस सूत्र और आवर्धन गणनाओं का अध्ययन करें।",
    learning_objectives: "Calculate focal length, identify lens types, trace ray diagrams.",
    keywords: "Reflection, Refraction, Concave, Convex, Lens",
    thumbnail_url: "",
    pdf_url: "",
    publication_status: "PUBLISHED",
    is_locked: false,
    display_order: 1
  }
];

const INITIAL_QUESTIONS: Question[] = [
  {
    id: "q-1",
    chapter_id: "ch-crop",
    question_type: "MCQ",
    marks: 1,
    difficulty: "EASY",
    competency_type: "Knowledge",
    text_en: "Which of the following is a Kharif crop?",
    text_hi: "निम्नलिखित में से कौन सी खरीफ की फसल है?",
    options: [
      { id: "o1", option_text: "Wheat (गेंहू)", is_correct: false },
      { id: "o2", option_text: "Paddy (धान)", is_correct: true },
      { id: "o3", option_text: "Gram (चना)", is_correct: false },
      { id: "o4", option_text: "Mustard (सरसों)", is_correct: false }
    ],
    explanation: "Paddy is sown in the rainy season, which makes it a Kharif crop.",
    source: "NCERT Class 8",
    tags: ["Kharif", "Crops"],
    status: "PUBLISHED",
    is_archived: false
  },
  {
    id: "q-2",
    chapter_id: "ch-crop",
    question_type: "Short Answer",
    marks: 3,
    difficulty: "MEDIUM",
    competency_type: "Application",
    text_en: "Explain how continuous plantation of crops in a field affects the soil.",
    text_hi: "स्पष्ट कीजिए कि किसी खेत में फसलों के निरंतर रोपण से मिट्टी पर क्या प्रभाव पड़ता है।",
    explanation: "Continuous cropping depletes soil nutrients, reducing crop yield. Crop rotation or fertilizers are needed to replenish nutrients.",
    source: "NCERT Class 8",
    tags: ["Soil Nutrients", "Fertilizers"],
    status: "PUBLISHED",
    is_archived: false
  }
];

const INITIAL_MEDIA: MediaAsset[] = [
  {
    id: "media-1",
    filename: "crop_practices.pdf",
    display_name: "Crop Production Guide",
    storage_path: "documents/pdfs/crop_practices.pdf",
    visibility: "PUBLIC",
    mime_type: "application/pdf",
    file_size: 1542000,
    uploaded_by: "founder@teachersathi.org",
    upload_date: "2026-07-15T12:00:00Z",
    class_id: "class-8",
    subject_id: "science",
    chapter_id: "ch-crop",
    tags: ["pdf", "syllabus", "guide"],
    alt_text: "PDF guide detailing agricultural production stages.",
    description: "Detailed PDF document describing steps of sowing and crop production."
  }
];

const INITIAL_VIDEOS: Video[] = [
  {
    id: "vid-1",
    title: "Understanding Microorganisms",
    description: "Visual animation demonstrating the different groups of micro-bacteria and viruses.",
    thumbnail_url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=300",
    chapter_id: "ch-micro",
    duration: "6m 12s",
    language: "HINDI",
    tags: ["Microbes", "Biology"],
    source_type: "YOUTUBE",
    storage_reference: "cB3H0KB3",
    publication_status: "PUBLISHED"
  }
];

const INITIAL_RESOURCES: Resource[] = [
  {
    id: "res-1",
    title: "Lesson Plan: Irrigation Methods",
    type: "Lesson Plan",
    file_url: "/resources/irrigation_lesson_plan.pdf",
    chapter_id: "ch-crop",
    class_ids: ["class-8"],
    subject_ids: ["science"]
  }
];

const INITIAL_USERS: User[] = [
  { id: "u-1", email: "founder@teachersathi.org", display_name: "Founder Admin", status: "ACTIVE", roles: ["SUPER_ADMIN"], school_name: "TeacherSathi HQ", last_active: "2026-07-18T21:40:00Z" },
  { id: "u-2", email: "manager@teachersathi.org", display_name: "Content Manager", status: "ACTIVE", roles: ["CONTENT_MANAGER"], school_name: "KV School", last_active: "2026-07-18T21:10:00Z" },
  { id: "u-3", email: "reviewer@teachersathi.org", display_name: "Primary Reviewer", status: "ACTIVE", roles: ["REVIEWER"], school_name: "Govt School 1", last_active: "2026-07-17T18:30:00Z" }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Admin Portal Launch!",
    message: "Welcome to the new TeacherSathi administration dashboard. You can now manage all classes, subjects, books, chapters, and resources dynamically.",
    cta: "/admin/dashboard",
    target: "EVERYONE",
    start_date: "2026-07-18",
    end_date: "2026-08-18",
    priority: "HIGH",
    status: "PUBLISHED"
  }
];

const INITIAL_SITE_CONTENT = {
  homepage_hero_title: "Empowering Government School Teachers in India",
  homepage_hero_subtitle: "Access high-quality NCERT/CBSE classroom content, smart tools, lessons plans, and quizzes instantly in Hindi and English.",
  support_email: "support@teachersathi.org",
  support_phone: "+91 98765 43210",
  faq_list: [
    { q: "Is TeacherSathi free for teachers?", a: "Yes, all standard NCERT lesson plans and worksheets are free to download and use." },
    { q: "Do you support offline teaching?", a: "Absolutely. You can download worksheets and PDFs to share with students directly." }
  ]
};

const INITIAL_AUDIT: AuditLog[] = [
  { id: "audit-1", admin_email: "founder@teachersathi.org", action: "SYSTEM_INIT", entity_type: "SYSTEM", entity_id: "SYS", timestamp: "2026-07-18T21:49:00Z", metadata: "Database storage preloaded with core NCERT syllabus data." }
];

// Helper to access data with LocalStorage fallback
const getStoreData = <T>(key: string, initialData: T): T => {
  if (typeof window === "undefined") return initialData;
  const item = localStorage.getItem(`ts_admin_${key}`);
  if (!item) {
    localStorage.setItem(`ts_admin_${key}`, JSON.stringify(initialData));
    return initialData;
  }
  try {
    return JSON.parse(item) as T;
  } catch {
    return initialData;
  }
};

const setStoreData = <T>(key: string, data: T) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`ts_admin_${key}`, JSON.stringify(data));
  }
};

export const adminStore = {
  // Config
  isSupabaseConfigured: () => !!supabase,

  // Audit Log Helper
  logAction: (action: string, entityType: string, entityId: string, metadata: string = "") => {
    const logs = getStoreData<AuditLog[]>("audit_logs", INITIAL_AUDIT);
    const userEmail = typeof window !== "undefined" ? localStorage.getItem("last_sathi_teacher_email") || "founder@teachersathi.org" : "founder@teachersathi.org";
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      admin_email: userEmail,
      action,
      entity_type: entityType,
      entity_id: entityId,
      timestamp: new Date().toISOString(),
      metadata
    };
    setStoreData("audit_logs", [newLog, ...logs]);
  },

  // Class Management
  getClasses: (): Class[] => getStoreData<Class[]>("classes", INITIAL_CLASSES),
  saveClass: (cls: Class) => {
    const classes = adminStore.getClasses();
    const index = classes.findIndex(c => c.id === cls.id);
    if (index >= 0) {
      classes[index] = cls;
      adminStore.logAction("UPDATE_CLASS", "CLASS", cls.id, `Updated class name to: ${cls.name}`);
    } else {
      classes.push(cls);
      adminStore.logAction("CREATE_CLASS", "CLASS", cls.id, `Created class: ${cls.name}`);
    }
    setStoreData("classes", classes);
  },
  archiveClass: (id: string) => {
    const classes = adminStore.getClasses();
    const updated = classes.map(c => c.id === id ? { ...c, is_archived: true } : c);
    setStoreData("classes", updated);
    adminStore.logAction("ARCHIVE_CLASS", "CLASS", id, "Archived class.");
  },
  reorderClasses: (orderedIds: string[]) => {
    const classes = adminStore.getClasses();
    const updated = classes.map(c => {
      const idx = orderedIds.indexOf(c.id);
      return { ...c, display_order: idx >= 0 ? idx + 1 : c.display_order };
    });
    setStoreData("classes", updated);
    adminStore.logAction("REORDER_CLASSES", "CLASS", "ALL", `Reordered classes sequence.`);
  },

  // Subject Management
  getSubjects: (): Subject[] => getStoreData<Subject[]>("subjects", INITIAL_SUBJECTS),
  saveSubject: (sub: Subject) => {
    const subjects = adminStore.getSubjects();
    const index = subjects.findIndex(s => s.id === sub.id);
    if (index >= 0) {
      subjects[index] = sub;
      adminStore.logAction("UPDATE_SUBJECT", "SUBJECT", sub.id, `Updated subject name to: ${sub.name}`);
    } else {
      subjects.push(sub);
      adminStore.logAction("CREATE_SUBJECT", "SUBJECT", sub.id, `Created subject: ${sub.name}`);
    }
    setStoreData("subjects", subjects);
  },
  archiveSubject: (id: string) => {
    const subjects = adminStore.getSubjects();
    const updated = subjects.map(s => s.id === id ? { ...s, is_archived: true } : s);
    setStoreData("subjects", updated);
    adminStore.logAction("ARCHIVE_SUBJECT", "SUBJECT", id, "Archived subject.");
  },
  reorderSubjects: (orderedIds: string[]) => {
    const subjects = adminStore.getSubjects();
    const updated = subjects.map(s => {
      const idx = orderedIds.indexOf(s.id);
      return { ...s, display_order: idx >= 0 ? idx + 1 : s.display_order };
    });
    setStoreData("subjects", updated);
    adminStore.logAction("REORDER_SUBJECTS", "SUBJECT", "ALL", `Reordered subjects sequence.`);
  },

  // Book Management
  getBooks: (): Book[] => getStoreData<Book[]>("books", INITIAL_BOOKS),
  saveBook: (bk: Book) => {
    const books = adminStore.getBooks();
    const index = books.findIndex(b => b.id === bk.id);
    if (index >= 0) {
      books[index] = bk;
      adminStore.logAction("UPDATE_BOOK", "BOOK", bk.id, `Updated book to: ${bk.title}`);
    } else {
      books.push(bk);
      adminStore.logAction("CREATE_BOOK", "BOOK", bk.id, `Created book: ${bk.title}`);
    }
    setStoreData("books", books);
  },
  archiveBook: (id: string) => {
    const books = adminStore.getBooks();
    const updated = books.map(b => b.id === id ? { ...b, is_archived: true } : b);
    setStoreData("books", updated);
    adminStore.logAction("ARCHIVE_BOOK", "BOOK", id, "Archived book.");
  },

  // Chapter Management
  getChapters: (): Chapter[] => getStoreData<Chapter[]>("chapters", INITIAL_CHAPTERS),
  saveChapter: (ch: Chapter) => {
    const chapters = adminStore.getChapters();
    const index = chapters.findIndex(c => c.id === ch.id);
    const userEmail = typeof window !== "undefined" ? localStorage.getItem("last_sathi_teacher_email") || "founder@teachersathi.org" : "founder@teachersathi.org";
    
    // Save version history snapshot before change
    if (index >= 0) {
      const previous = chapters[index];
      const versions = getStoreData<ContentVersion[]>("content_versions", []);
      const newVersion: ContentVersion = {
        id: `version-${Date.now()}`,
        entity_type: "CHAPTER",
        entity_id: ch.id,
        version_number: versions.filter(v => v.entity_id === ch.id).length + 1,
        changed_by: userEmail,
        changed_at: new Date().toISOString(),
        change_summary: `Modified fields: ${previous.title_en !== ch.title_en ? 'Title ' : ''}${previous.publication_status !== ch.publication_status ? 'Status ' : ''}`,
        data_snapshot: JSON.stringify(previous)
      };
      setStoreData("content_versions", [newVersion, ...versions]);

      chapters[index] = ch;
      adminStore.logAction("UPDATE_CHAPTER", "CHAPTER", ch.id, `Updated chapter: ${ch.title_en} (${ch.publication_status})`);
    } else {
      chapters.push(ch);
      adminStore.logAction("CREATE_CHAPTER", "CHAPTER", ch.id, `Created chapter: ${ch.title_en}`);
    }
    setStoreData("chapters", chapters);
  },
  archiveChapter: (id: string) => {
    const chapters = adminStore.getChapters();
    const updated = chapters.map(c => c.id === id ? { ...c, publication_status: "ARCHIVED" as const } : c);
    setStoreData("chapters", updated);
    adminStore.logAction("ARCHIVE_CHAPTER", "CHAPTER", id, "Archived chapter status.");
  },

  // Question Management
  getQuestions: (): Question[] => getStoreData<Question[]>("questions", INITIAL_QUESTIONS),
  saveQuestion: (q: Question) => {
    const questions = adminStore.getQuestions();
    const index = questions.findIndex(item => item.id === q.id);
    const userEmail = typeof window !== "undefined" ? localStorage.getItem("last_sathi_teacher_email") || "founder@teachersathi.org" : "founder@teachersathi.org";

    if (index >= 0) {
      const previous = questions[index];
      const versions = getStoreData<ContentVersion[]>("content_versions", []);
      const newVersion: ContentVersion = {
        id: `version-${Date.now()}`,
        entity_type: "QUESTION",
        entity_id: q.id,
        version_number: versions.filter(v => v.entity_id === q.id).length + 1,
        changed_by: userEmail,
        changed_at: new Date().toISOString(),
        change_summary: `Modified question text.`,
        data_snapshot: JSON.stringify(previous)
      };
      setStoreData("content_versions", [newVersion, ...versions]);

      questions[index] = q;
      adminStore.logAction("UPDATE_QUESTION", "QUESTION", q.id, `Updated question details.`);
    } else {
      questions.push(q);
      adminStore.logAction("CREATE_QUESTION", "QUESTION", q.id, `Created new question.`);
    }
    setStoreData("questions", questions);
  },
  deleteQuestion: (id: string) => {
    const questions = adminStore.getQuestions();
    const updated = questions.map(q => q.id === id ? { ...q, is_archived: true } : q);
    setStoreData("questions", updated);
    adminStore.logAction("ARCHIVE_QUESTION", "QUESTION", id, "Archived question.");
  },
  duplicateQuestion: (id: string) => {
    const questions = adminStore.getQuestions();
    const source = questions.find(q => q.id === id);
    if (source) {
      const duplicate: Question = {
        ...source,
        id: `q-${Date.now()}`,
        text_en: `${source.text_en} (Copy)`,
        status: "DRAFT"
      };
      questions.push(duplicate);
      setStoreData("questions", questions);
      adminStore.logAction("DUPLICATE_QUESTION", "QUESTION", duplicate.id, `Duplicated question from ${id}`);
    }
  },
  importQuestions: (list: Question[]) => {
    const questions = adminStore.getQuestions();
    const updated = [...questions, ...list];
    setStoreData("questions", updated);
    adminStore.logAction("BULK_IMPORT_QUESTIONS", "QUESTION", "MULTIPLE", `Imported ${list.length} questions in bulk.`);
  },

  // Media Library
  getMediaAssets: (): MediaAsset[] => getStoreData<MediaAsset[]>("media_assets", INITIAL_MEDIA),
  saveMediaAsset: (asset: MediaAsset) => {
    const assets = adminStore.getMediaAssets();
    assets.push(asset);
    setStoreData("media_assets", assets);
    adminStore.logAction("UPLOAD_MEDIA", "MEDIA", asset.id, `Uploaded asset: ${asset.filename}`);
  },
  deleteMediaAsset: (id: string) => {
    const assets = adminStore.getMediaAssets();
    const filtered = assets.filter(a => a.id !== id);
    setStoreData("media_assets", filtered);
    adminStore.logAction("DELETE_MEDIA", "MEDIA", id, `Removed media asset.`);
  },

  // Videos
  getVideos: (): Video[] => getStoreData<Video[]>("videos", INITIAL_VIDEOS),
  saveVideo: (vid: Video) => {
    const videos = adminStore.getVideos();
    const index = videos.findIndex(v => v.id === vid.id);
    if (index >= 0) {
      videos[index] = vid;
      adminStore.logAction("UPDATE_VIDEO", "VIDEO", vid.id, `Updated video metadata: ${vid.title}`);
    } else {
      videos.push(vid);
      adminStore.logAction("CREATE_VIDEO", "VIDEO", vid.id, `Linked video: ${vid.title}`);
    }
    setStoreData("videos", videos);
  },
  deleteVideo: (id: string) => {
    const videos = adminStore.getVideos();
    const filtered = videos.filter(v => v.id !== id);
    setStoreData("videos", filtered);
    adminStore.logAction("DELETE_VIDEO", "VIDEO", id, "Removed video linkage.");
  },

  // Resources
  getResources: (): Resource[] => getStoreData<Resource[]>("resources", INITIAL_RESOURCES),
  saveResource: (res: Resource) => {
    const resources = adminStore.getResources();
    const index = resources.findIndex(r => r.id === res.id);
    if (index >= 0) {
      resources[index] = res;
      adminStore.logAction("UPDATE_RESOURCE", "RESOURCE", res.id, `Updated resource file path.`);
    } else {
      resources.push(res);
      adminStore.logAction("CREATE_RESOURCE", "RESOURCE", res.id, `Linked resource file: ${res.title}`);
    }
    setStoreData("resources", resources);
  },
  deleteResource: (id: string) => {
    const resources = adminStore.getResources();
    const filtered = resources.filter(r => r.id !== id);
    setStoreData("resources", filtered);
    adminStore.logAction("DELETE_RESOURCE", "RESOURCE", id, "Removed resource asset.");
  },

  // Users
  getUsers: (): User[] => getStoreData<User[]>("users", INITIAL_USERS),
  updateUserRole: (id: string, roles: string[]) => {
    const users = adminStore.getUsers();
    const updated = users.map(u => u.id === id ? { ...u, roles } : u);
    setStoreData("users", updated);
    adminStore.logAction("UPDATE_USER_ROLES", "USER", id, `Modified user permissions to roles: ${roles.join(', ')}`);
  },
  toggleUserStatus: (id: string) => {
    const users = adminStore.getUsers();
    const updated = users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === "ACTIVE" ? "SUSPENDED" as const : "ACTIVE" as const;
        adminStore.logAction("TOGGLE_USER_STATUS", "USER", id, `Changed status to: ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setStoreData("users", updated);
  },

  // Announcements
  getAnnouncements: (): Announcement[] => getStoreData<Announcement[]>("announcements", INITIAL_ANNOUNCEMENTS),
  saveAnnouncement: (ann: Announcement) => {
    const announcements = adminStore.getAnnouncements();
    const index = announcements.findIndex(a => a.id === ann.id);
    if (index >= 0) {
      announcements[index] = ann;
      adminStore.logAction("UPDATE_ANNOUNCEMENT", "ANNOUNCEMENT", ann.id, `Updated announcement details.`);
    } else {
      announcements.push(ann);
      adminStore.logAction("CREATE_ANNOUNCEMENT", "ANNOUNCEMENT", ann.id, `Created platform announcement.`);
    }
    setStoreData("announcements", announcements);
  },
  deleteAnnouncement: (id: string) => {
    const announcements = adminStore.getAnnouncements();
    const filtered = announcements.filter(a => a.id !== id);
    setStoreData("announcements", filtered);
    adminStore.logAction("DELETE_ANNOUNCEMENT", "ANNOUNCEMENT", id, "Removed announcement.");
  },

  // Global Site Content
  getSiteContent: () => getStoreData<typeof INITIAL_SITE_CONTENT>("site_content", INITIAL_SITE_CONTENT),
  saveSiteContent: (content: typeof INITIAL_SITE_CONTENT) => {
    setStoreData("site_content", content);
    adminStore.logAction("UPDATE_SITE_CONTENT", "SITE", "ALL", "Modified platform support FAQ and homepage header texts.");
  },

  // Audit Logs
  getAuditLogs: (): AuditLog[] => getStoreData<AuditLog[]>("audit_logs", INITIAL_AUDIT),

  // Version History
  getContentVersions: (entityId: string): ContentVersion[] => {
    const versions = getStoreData<ContentVersion[]>("content_versions", []);
    return versions.filter(v => v.entity_id === entityId);
  }
};
