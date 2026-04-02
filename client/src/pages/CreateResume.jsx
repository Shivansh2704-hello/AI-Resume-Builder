import { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import { useReactToPrint } from "react-to-print";
import { Download, ChevronDown, ChevronUp, Plus, Trash2, LayoutTemplate, Cloud, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Template1 from "../components/templates/Template1";
import Template2 from "../components/templates/Template2";

const Accordion = ({ title, isOpen, onToggle, children }) => (
  <div className="border border-slate-200 dark:border-slate-700/50 rounded-xl mb-4 bg-white/50 dark:bg-[#0f172a]/60 overflow-hidden text-slate-800 dark:text-slate-200 transition-colors">
    <button
      className="w-full flex justify-between items-center p-4 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      onClick={onToggle}
    >
      {title}
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
    {isOpen && <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-[#1e293b]/30">{children}</div>}
  </div>
);

const InputField = ({ label, value, onChange, placeholder, isTextarea = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</label>
    {isTextarea ? (
      <textarea
        className="w-full bg-white dark:bg-[#020617] border border-slate-300 dark:border-slate-700/50 rounded-lg p-3 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-colors"
        rows="4" value={value} onChange={onChange} placeholder={placeholder}
      />
    ) : (
      <input
        type="text"
        className="w-full bg-white dark:bg-[#020617] border border-slate-300 dark:border-slate-700/50 rounded-lg p-3 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
        value={value} onChange={onChange} placeholder={placeholder}
      />
    )}
  </div>
);

function CreateResume() {
  const componentRef = useRef();
  const location = useLocation();

  // Dynamic initialization extracting React Router historical context if available natively
  const [template, setTemplate] = useState(() => location.state?.importedTemplate || "template1");
  const [resumeTitle, setResumeTitle] = useState("My Targeted Resume");
  const [isSaving, setIsSaving] = useState(false);
  
  // Accordion Toggles
  const [openSection, setOpenSection] = useState("personal");

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "My_Professional_Resume",
  });

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return "guest";
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload).id;
    } catch (e) {
        return "guest";
    }
  };

  const storageKey = `resumeData_${getUserIdFromToken()}`;

  const defaultData = {
    personal: { name: "Your Name", email: "your.email@example.com", phone: "+1 234 567 8900", address: "City, State, Country", linkedin: "linkedin.com/in/username", github: "github.com/username" },
    objective: "Motivated professional with a strong foundation in my field. Demonstrates leadership, teamwork, and a continuous drive for excellence.",
    education: [
      { id: Date.now(), degree: "Bachelors / Masters Degree", school: "University Name", year: "2019 - 2023", score: "GPA: 3.8 / 4.0" }
    ],
    skills: "React, Node.js, Project Management",
    languages: "English",
    experience: [
      { id: Date.now(), title: "Professional Role", company: "Company Name", duration: "Jan 2022 - Present", description: "Developed dynamic solutions. Solved complex architecture problems and drove team success." }
    ]
  };

  // Dynamic States reflecting realistic resume entries, cached securely or inherited implicitly from a history map
  const [resumeData, setResumeData] = useState(() => {
    if (location.state?.importedResume) return location.state.importedResume;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : defaultData;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(resumeData));
  }, [resumeData, storageKey]);

  const handleSaveCloud = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/resume/save`, {
        title: resumeTitle,
        template,
        resumeData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Resume securely saved to the cloud successfully! 🚀");
    } catch (error) {
      console.error(error);
      alert("Failed to save resume strictly to cloud.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (section, field, value) => {
    if (typeof resumeData[section] === "object" && !Array.isArray(resumeData[section])) {
      setResumeData({ ...resumeData, [section]: { ...resumeData[section], [field]: value } });
    } else {
      setResumeData({ ...resumeData, [section]: value });
    }
  };

  const addArrayItem = (section, defaultObj) => {
    setResumeData({ ...resumeData, [section]: [...resumeData[section], { id: Date.now(), ...defaultObj }] });
  };

  const updateArrayItem = (section, id, field, value) => {
    setResumeData({
      ...resumeData,
      [section]: resumeData[section].map((item) => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const removeArrayItem = (section, id) => {
    setResumeData({ ...resumeData, [section]: resumeData[section].filter(item => item.id !== id) });
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row h-full gap-6">
        
        {/* LEFT PANE: FORMS */}
        <div className="w-full lg:w-1/2 flex flex-col h-[85vh] overflow-y-auto pr-2 custom-scrollbar print:hidden">
          
          <div className="flex justify-between items-start mb-6 gap-2">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Resume Editor</h1>
              <input 
                type="text" 
                value={resumeTitle} 
                onChange={(e) => setResumeTitle(e.target.value)}
                className="bg-transparent border-b border-indigo-200 dark:border-indigo-800/50 focus:border-indigo-500 outline-none text-slate-600 dark:text-slate-400 font-semibold md:w-48 w-full transition-colors pb-1 text-sm"
                placeholder="Name your draft..."
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-end">
              <div className="relative">
                <select 
                  className="appearance-none bg-indigo-50 dark:bg-[#1e293b] text-indigo-600 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-500/30 pl-10 pr-8 py-2 rounded-lg cursor-pointer outline-none hover:bg-indigo-100 dark:hover:bg-[#334155] transition-colors h-full"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                >
                  <option value="template1">Template 1</option>
                  <option value="template2">Template 2</option>
                </select>
                <LayoutTemplate className="absolute left-3 top-2.5 text-indigo-500 dark:text-indigo-400" size={18} />
              </div>

              <button 
                onClick={handleSaveCloud}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg shadow hover:shadow-emerald-500/25 transition-all text-sm"
              >
                 {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Cloud size={18} />} Save
              </button>

              <button 
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow hover:shadow-indigo-500/25 transition-all text-sm"
              >
                <Download size={18} /> PDF
              </button>
            </div>
          </div>

          <div className="space-y-2 pb-10">
            {/* PERSONAL DETAILS */}
            <Accordion title="Personal Details" isOpen={openSection === "personal"} onToggle={() => setOpenSection(openSection === "personal" ? "" : "personal")}>
              <div className="grid grid-cols-2 gap-x-4">
                <InputField label="Full Name" value={resumeData.personal.name} onChange={(e) => handleChange("personal", "name", e.target.value)} />
                <InputField label="Email Address" value={resumeData.personal.email} onChange={(e) => handleChange("personal", "email", e.target.value)} />
                <InputField label="Phone Number" value={resumeData.personal.phone} onChange={(e) => handleChange("personal", "phone", e.target.value)} />
                <InputField label="Location / Address" value={resumeData.personal.address} onChange={(e) => handleChange("personal", "address", e.target.value)} />
                <InputField label="LinkedIn" value={resumeData.personal.linkedin} onChange={(e) => handleChange("personal", "linkedin", e.target.value)} />
                <InputField label="GitHub / Portfolio" value={resumeData.personal.github} onChange={(e) => handleChange("personal", "github", e.target.value)} />
              </div>
            </Accordion>

            {/* CAREER OBJECTIVE */}
            <Accordion title="Career Objective" isOpen={openSection === "objective"} onToggle={() => setOpenSection(openSection === "objective" ? "" : "objective")}>
              <InputField label="Professional Summary" isTextarea value={resumeData.objective} onChange={(e) => handleChange("objective", null, e.target.value)} />
            </Accordion>

            {/* EDUCATION */}
            <Accordion title="Education" isOpen={openSection === "education"} onToggle={() => setOpenSection(openSection === "education" ? "" : "education")}>
              {resumeData.education.map((edu, idx) => (
                <div key={edu.id} className="mb-6 p-4 bg-slate-50 dark:bg-[#020617] rounded-lg border border-slate-200 dark:border-slate-700 relative group transition-colors">
                  <button onClick={() => removeArrayItem("education", edu.id)} className="absolute top-2 right-2 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                  <InputField label="Degree / Course" value={edu.degree} onChange={(e) => updateArrayItem("education", edu.id, "degree", e.target.value)} />
                  <InputField label="School / University" value={edu.school} onChange={(e) => updateArrayItem("education", edu.id, "school", e.target.value)} />
                  <div className="grid grid-cols-2 gap-x-4">
                    <InputField label="Years (e.g. 2020 - 2024)" value={edu.year} onChange={(e) => updateArrayItem("education", edu.id, "year", e.target.value)} />
                    <InputField label="Score / Percentage" value={edu.score} onChange={(e) => updateArrayItem("education", edu.id, "score", e.target.value)} />
                  </div>
                </div>
              ))}
              <button onClick={() => addArrayItem("education", { degree: "", school: "", year: "", score: "" })} className="w-full py-3 flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 font-medium transition-colors">
                <Plus size={18} /> Add Education
              </button>
            </Accordion>

            {/* TECHNICAL COMPETENCIES */}
            <Accordion title="Technical Competencies" isOpen={openSection === "skills"} onToggle={() => setOpenSection(openSection === "skills" ? "" : "skills")}>
               <InputField label="Comma Separated Skills" isTextarea value={resumeData.skills} placeholder="React, Node.js, Python, AWS..." onChange={(e) => handleChange("skills", null, e.target.value)} />
            </Accordion>

            {/* LANGUAGES */}
            <Accordion title="Languages" isOpen={openSection === "languages"} onToggle={() => setOpenSection(openSection === "languages" ? "" : "languages")}>
               <InputField label="Comma Separated Languages" value={resumeData.languages} placeholder="English, Spanish..." onChange={(e) => handleChange("languages", null, e.target.value)} />
            </Accordion>

            {/* EXPERIENCE */}
            <Accordion title="Professional Experience" isOpen={openSection === "experience"} onToggle={() => setOpenSection(openSection === "experience" ? "" : "experience")}>
              {resumeData.experience.map((exp, idx) => (
                <div key={exp.id} className="mb-6 p-4 bg-slate-50 dark:bg-[#020617] rounded-lg border border-slate-200 dark:border-slate-700 relative group transition-colors">
                  <button onClick={() => removeArrayItem("experience", exp.id)} className="absolute top-2 right-2 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                  <InputField label="Job Title" value={exp.title} onChange={(e) => updateArrayItem("experience", exp.id, "title", e.target.value)} />
                  <InputField label="Company" value={exp.company} onChange={(e) => updateArrayItem("experience", exp.id, "company", e.target.value)} />
                  <InputField label="Duration" value={exp.duration} onChange={(e) => updateArrayItem("experience", exp.id, "duration", e.target.value)} />
                  <InputField label="Description / Responsibilities" isTextarea value={exp.description} onChange={(e) => updateArrayItem("experience", exp.id, "description", e.target.value)} />
                </div>
              ))}
              <button onClick={() => addArrayItem("experience", { title: "", company: "", duration: "", description: "" })} className="w-full py-3 flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 font-medium transition-colors">
                <Plus size={18} /> Add Experience
              </button>
            </Accordion>

          </div>
        </div>

        {/* RIGHT PANE: LIVE PREVIEW */}
        <div className="w-full lg:w-1/2 bg-slate-200/50 dark:bg-slate-200/5 rounded-xl border border-slate-300 dark:border-slate-700/50 flex justify-center overflow-y-auto custom-scrollbar pt-6 pb-20 print:border-none print:w-full print:block">
          {/* We wrap the target in a fixed max-width scaling container so it resembles A4 */}
          <div ref={componentRef} className="bg-white w-[210mm] max-w-full min-h-[297mm] shadow-2xl overflow-hidden print:shadow-none print:m-0 print:p-0">
             {template === "template1" ? <Template1 data={resumeData} /> : <Template2 data={resumeData} />}
          </div>
        </div>
        
      </div>
    </Layout>
  );
}

export default CreateResume;
