# TeacherSathi — Core User Journeys

> **Status**: Frozen Contract (Phase 0)  
> **Purpose**: Map step-by-step user interactions across the TeacherSathi ecosystem.

---

## Journey 1: Teacher Onboarding & First Kit Generation

1. **Discovery**: Teacher visits the landing page (`/`), views the hero headline, and tests the live simulation in `InteractiveHeroWorkspace.tsx`.
2. **Account Creation**: Teacher clicks *"Generate Free NCERT Lesson Kit Now"*, enters their email/password or selects Google OAuth on `/signup`.
3. **Role & School Selection**: Teacher selects the *Teacher* tab, inputs their name, and enters their school name (e.g. *Kendriya Vidyalaya No. 1, Jaipur*).
4. **Dashboard Landing**: The teacher is routed to `/dashboard`, greeted by name, and sees quick creation shortcuts.
5. **Chapter Kit Selection**:
   - Teacher selects Class (e.g. *Class 8*), Subject (*Science*), and Chapter (*Conservation of Plants and Animals*).
   - Routed to `/content/class-8/science/chapter-1`.
6. **Kit Generation**: Teacher clicks *"Generate Worksheet"* or *"Create Lesson Plan"*.
7. **Export & Print**: The formatted bilingual worksheet PDF is generated in 30 seconds, complete with a teacher answer key ready to print or project.

---

## Journey 2: Daily Classroom Routine (75" Smartboard QR Handshake)

1. **Entering Classroom**: The teacher arrives in the classroom where a 75-inch smart display is turned on and open to `/classroom`.
2. **QR Code Display**: The smart screen generates a fresh 2-minute expiring SVG QR code displaying `Session: sess_xxxxx (Board-001)`.
3. **Smartphone Scan**: The teacher opens their phone's native camera or browser and scans the screen QR code.
4. **Mobile Authorization**:
   - The phone opens `/auth/qr-confirm?session_id=...&board_id=...`.
   - The phone screen shows: *"Log In on Smartboard 75\"? Board-001 • Room 102"*.
   - Teacher taps **"Continue / Approve"**.
5. **Instant Screen Unlock**:
   - Within 1 second, the 75-inch display receives the handshake approval, displays *"Welcome, Educator!"*, and unlocks directly into the classroom presentation dashboard.
6. **Mobile Remote Active**: The phone transforms into a remote control with buttons to:
   - *Extend Period (+15m)*
   - *Push PDF File to Display*
   - *Transfer Session to Another Room*
   - *Lock Board & End Session*
7. **End of Period**: Upon leaving the room, the teacher taps **"Lock Board"** on their mobile phone, instantly terminating the session on the 75" display.

---

## Journey 3: Interactive Live Classroom Quiz & Assessment

1. **Preparation**: From the Chapter Hub (`/content/[grade]/[subject]/[chapter]`), the teacher clicks **"Create MCQ Quiz"** under the ASSESS column.
2. **Launch**: The quiz interface loads on the 75-inch display at `/content/[grade]/[subject]/[chapter]/quiz`.
3. **Class Participation**:
   - Question 1 appears in high-contrast text visible to all 50 students in the room.
   - The teacher poses the question to the room or prompts students to raise hands / vote.
4. **Immediate Diagnostic Feedback**:
   - The teacher taps the agreed option on screen.
   - If correct: The option glows green with celebratory feedback and sound.
   - If incorrect: The option highlights red, and the correct option is illuminated in emerald green.
   - A pedagogical explanation expands automatically below the question to clarify common misconceptions.
5. **Scoring & Review**: Live counters update correct and incorrect totals. At the final question, the teacher clicks *"Finish Quiz"* to review overall class accuracy.

---

## Journey 4: Digital Whiteboard Lecture

1. **Launch**: From the dashboard, the teacher clicks **"Interactive Whiteboard"** (`/dashboard/whiteboard`).
2. **Canvas Ready**: The Excalidraw canvas initializes in high-contrast mode with infinite pan and zoom.
3. **Tool Access**: The teacher opens the **Teacher's Toolkit** sidebar on the right to reference geometry tips, coordinate graphs, or mathematical formulas (Circle, Triangle Pythagoras, Sphere volume).
4. **Diagram Annotation**: The teacher sketches a ray diagram or math solution using a stylus or touchscreen finger input.
5. **Export**: The teacher exports the whiteboard session as an image or PDF to distribute to students who were absent.

---

## Journey 5: Admin Curriculum & Question Management

1. **Access**: Platform administrator logs in and navigates to `/admin/dashboard`.
2. **Syllabus Maintenance**: Admin navigates to `/admin/content/chapters`, selects Class 9 Science, and updates the chapter description or adds new learning objectives.
3. **Question Bank Curation**:
   - Admin opens `/admin/questions`.
   - Adds new Section A (2 marks), Section B (3 marks), or Section C (4 marks) competency-based questions with bilingual Devanagari Hindi and English text.
   - Sets difficulty (*EASY*, *MEDIUM*, *HARD*) and tags (*NCERT Activity*, *HOTS*).
4. **Publishing**: Admin sets status to `PUBLISHED`.
5. **Audit Trail**: Every modification is logged automatically to the system audit trail (`adminStore.logAction`).
