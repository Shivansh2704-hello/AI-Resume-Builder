import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github, GraduationCap, Briefcase, Code, Languages, User } from "lucide-react";

function Template1({ data }) {
  if (!data) return null;

  const { personal, objective, education, skills, languages, experience } = data;

  const getArray = (str) => {
    if (!str) return [];
    return str.split(",").map(item => item.trim()).filter(Boolean);
  };

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-black font-sans box-border" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER SECTION - DARK */}
      <div className="bg-black text-white p-8 pb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{personal.name || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-gray-300">
          {personal.email && (
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail size={14} /> <span>{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={14} /> <span>{personal.phone}</span>
            </div>
          )}
          {personal.address && (
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <MapPin size={14} /> <span>{personal.address}</span>
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Linkedin size={14} /> <span>{personal.linkedin}</span>
            </div>
          )}
          {personal.github && (
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Github size={14} /> <span>{personal.github}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 space-y-8">
        
        {/* CAREER OBJECTIVE */}
        {objective && (
          <section>
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3 flex items-center gap-2 uppercase">
              <User size={18} className="text-gray-700" /> Career Objective
            </h2>
            <p className="text-sm text-gray-800 leading-relaxed text-justify">
              {objective}
            </p>
          </section>
        )}

        {/* EDUCATION */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-4 flex items-center gap-2 uppercase">
              <GraduationCap size={18} className="text-gray-700" /> Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-black">{edu.degree || "Degree"} <span className="font-normal text-gray-600">, {edu.school || "School"}</span></h3>
                    <p className="text-xs text-gray-600 mt-0.5">{edu.score || "Score"}</p>
                  </div>
                  <div className="text-xs font-medium text-gray-600 whitespace-nowrap">
                    {edu.year || "Year"}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TECHNICAL COMPETENCIES */}
        {skills && (
          <section>
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-4 flex items-center gap-2 uppercase">
              <Code size={18} className="text-gray-700" /> Technical Competencies
            </h2>
            <ul className="text-sm text-gray-800 grid grid-cols-2 md:grid-cols-4 gap-y-2 list-none">
              {getArray(skills).map((skill, idx) => (
                <li key={idx} className="flex items-center gap-1.5 before:content-['•'] before:text-black before:font-bold">
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* LANGUAGES */}
        {languages && (
          <section>
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-4 flex items-center gap-2 uppercase">
              <Languages size={18} className="text-gray-700" /> Languages
            </h2>
            <ul className="text-sm text-gray-800 flex flex-wrap gap-x-8 gap-y-2 list-none">
              {getArray(languages).map((lang, idx) => (
                <li key={idx} className="flex items-center gap-1.5 before:content-['•'] before:text-black before:font-bold">
                  {lang}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* PROFESSIONAL EXPERIENCE */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-4 flex items-center gap-2 uppercase">
              <Briefcase size={18} className="text-gray-700" /> Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-[15px] text-black tracking-tight">{exp.title || "Job Title"}</h3>
                    <div className="text-xs font-bold text-gray-600 border border-gray-300 px-2 py-0.5 rounded whitespace-nowrap">
                      {exp.duration || "Duration"}
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 italic">{exp.company || "Company Name"}</h4>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

export default Template1;
