import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";

function Template2({ data }) {
  if (!data) return null;

  const { personal, objective, education, skills, languages, experience } = data;

  const getArray = (str) => {
    if (!str) return [];
    return str.split(",").map(item => item.trim()).filter(Boolean);
  };

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-black font-sans flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* LEFT COLUMN - Sidebar */}
      <div className="w-1/3 bg-slate-100 p-8 h-full border-r border-slate-200">
        
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-extrabold text-slate-800 leading-tight mb-2 tracking-tight">{personal.name || "Your Name"}</h1>
          <div className="w-12 h-1 bg-indigo-600 mb-6"></div>
          
          <div className="space-y-3 text-xs text-slate-600 font-medium">
            {personal.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-indigo-600" /> <span className="break-all">{personal.email}</span>
              </div>
            )}
            {personal.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-indigo-600" /> <span>{personal.phone}</span>
              </div>
            )}
            {personal.address && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-indigo-600" /> <span className="leading-snug">{personal.address}</span>
              </div>
            )}
            {personal.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin size={14} className="text-indigo-600" /> <span>{personal.linkedin}</span>
              </div>
            )}
            {personal.github && (
              <div className="flex items-center gap-2">
                <Github size={14} className="text-indigo-600" /> <span>{personal.github}</span>
              </div>
            )}
          </div>
        </div>

        {/* TECHNICAL COMPETENCIES */}
        {skills && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-300 pb-2 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {getArray(skills).map((skill, idx) => (
                <span key={idx} className="bg-white border border-slate-300 text-slate-700 px-2 py-1 text-[11px] font-bold rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* LANGUAGES */}
        {languages && (
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-300 pb-2 mb-3">Languages</h2>
            <ul className="text-xs text-slate-600 space-y-1">
              {getArray(languages).map((lang, idx) => (
                <li key={idx} className="font-semibold">{lang}</li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* RIGHT COLUMN - Main Content */}
      <div className="w-2/3 p-8">
        
        {/* CAREER OBJECTIVE */}
        {objective && (
          <section className="mb-8">
            <h2 className="text-[13px] font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-indigo-600"></span> Profile
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {objective}
            </p>
          </section>
        )}

        {/* PROFESSIONAL EXPERIENCE */}
        {experience && experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-[13px] font-bold text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-indigo-600"></span> Experience
            </h2>
            <div className="space-y-6 relative border-l-2 border-slate-100 pl-4 ml-2">
              {experience.map((exp, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-[23px] top-1 border-4 border-white"></div>
                  <h3 className="font-bold text-[15px] text-slate-800">{exp.title || "Job Title"}</h3>
                  <div className="flex justify-between items-center mb-2 mt-0.5">
                    <span className="text-sm font-semibold text-slate-500">{exp.company || "Company"}</span>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{exp.duration || "Duration"}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-[13px] font-bold text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-indigo-600"></span> Education
            </h2>
            <div className="space-y-4 relative border-l-2 border-slate-100 pl-4 ml-2">
              {education.map((edu, idx) => (
                <div key={idx} className="relative">
                   <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[23px] top-1 border-4 border-white"></div>
                  <h3 className="font-bold text-sm text-slate-800">{edu.degree || "Degree"}</h3>
                  <div className="flex justify-between items-center mt-0.5 mb-1">
                    <p className="text-xs font-semibold text-slate-500">{edu.school || "School"}</p>
                    <span className="text-xs font-bold text-slate-400">{edu.year || "Year"}</span>
                  </div>
                  <p className="text-xs text-slate-600">{edu.score || "Score"}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

export default Template2;
