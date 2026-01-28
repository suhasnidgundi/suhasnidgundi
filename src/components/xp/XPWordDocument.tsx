import { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Save,
  Printer,
} from "lucide-react";
import MinimizeIcon from '@/assets/xp/icons/minimize_icon.png';
import MaximizeIcon from '@/assets/xp/icons/maximize_icon.png';
import ExitIcon from '@/assets/xp/icons/exit_icon.png';
import WordIcon from '@/assets/xp/icons/ms_word_logo_icon.png';

interface XPWordDocumentProps {
  onClose: () => void;
}

const XPWordDocument = ({ onClose }: XPWordDocumentProps) => {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-[100]" onClick={onClose} />

      {/* Word Window */}
      <div
        className={`fixed z-[101] flex flex-col bg-card shadow-lg transition-all duration-200 ${
          isMaximized
            ? "inset-2"
            : "top-[3%] left-1/2 -translate-x-1/2 w-[95vw] h-[92vh] max-w-[1200px]"
        }`}
        style={{
          border: "2px solid hsl(var(--primary) / 0.6)",
          borderRadius: isMaximized ? "0" : "8px 8px 0 0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="xp-title-bar h-[30px] flex items-center justify-between px-1 select-none">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <img src={WordIcon} alt="Word" className="w-4 h-4" />
            </div>
            <span className="text-primary-foreground font-bold text-[13px] drop-shadow-sm">
              Suhas_Nidgundi_About_Me.doc - Microsoft Word
            </span>
          </div>

          <div className="flex items-center gap-[2px]">
            <button
              onClick={(e) => e.stopPropagation()}
              className="xp-control-btn xp-minimize hover:brightness-110 transition-all"
              title="Minimize"
            >
              <img src={MinimizeIcon} alt="Minimize" className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMaximized(!isMaximized);
              }}
              className="xp-control-btn xp-maximize hover:brightness-110 transition-all"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              <img src={MaximizeIcon} alt={isMaximized ? "Restore" : "Maximize"} className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="xp-control-btn xp-close hover:brightness-110 transition-all"
              title="Close"
            >
              <img src={ExitIcon} alt="Close" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu Bar */}
        <div className="flex items-center gap-4 px-2 py-1 bg-[hsl(var(--xp-toolbar-bg))] border-b border-border text-[11px]">
          <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">
            File
          </span>
          <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">
            Edit
          </span>
          <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">
            View
          </span>
          <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">
            Insert
          </span>
          <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">
            Format
          </span>
          <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">
            Tools
          </span>
          <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">
            Table
          </span>
          <span className="hover:bg-primary/20 px-2 py-1 cursor-pointer rounded">
            Help
          </span>
        </div>

        {/* Toolbar Row 1 */}
        <div className="flex items-center gap-1 px-2 py-1 bg-[hsl(var(--xp-toolbar-bg))] border-b border-border">
          <button
            className="xp-button flex items-center gap-1 text-[10px]"
            title="Save"
          >
            <Save size={14} />
          </button>
          <button
            className="xp-button flex items-center gap-1 text-[10px]"
            title="Print"
          >
            <Printer size={14} />
          </button>
          <div className="w-px h-5 bg-border mx-1" />
          <select className="xp-button text-[11px] px-2 py-1">
            <option>Times New Roman</option>
            <option>Arial</option>
            <option>Calibri</option>
          </select>
          <select className="xp-button text-[11px] px-2 py-1 w-16">
            <option>11pt</option>
            <option>12pt</option>
            <option>14pt</option>
          </select>
        </div>

        {/* Toolbar Row 2 - Formatting */}
        <div className="flex items-center gap-1 px-2 py-1 bg-[hsl(var(--xp-toolbar-bg))] border-b border-border">
          <button className="xp-button p-1" title="Bold">
            <Bold size={14} />
          </button>
          <button className="xp-button p-1" title="Italic">
            <Italic size={14} />
          </button>
          <button className="xp-button p-1" title="Underline">
            <Underline size={14} />
          </button>
          <div className="w-px h-5 bg-border mx-1" />
          <button className="xp-button p-1" title="Align Left">
            <AlignLeft size={14} />
          </button>
          <button className="xp-button p-1" title="Align Center">
            <AlignCenter size={14} />
          </button>
          <button className="xp-button p-1" title="Align Right">
            <AlignRight size={14} />
          </button>
          <button className="xp-button p-1" title="Justify">
            <AlignJustify size={14} />
          </button>
        </div>

        {/* Ruler */}
        <div className="h-6 bg-card border-b border-border flex items-center px-4">
          <div className="flex-1 h-4 bg-muted/30 relative">
            {Array.from({ length: 17 }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-muted-foreground/30"
                style={{ left: `${(i / 16) * 100}%` }}
              >
                {i % 2 === 0 && (
                  <span className="absolute -top-3 -left-2 text-[8px] text-muted-foreground">
                    {i}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Document Content Area */}
        <div className="flex-1 bg-[#C0C0C0] p-4 overflow-y-auto flex justify-center">
          {/* Paper */}
          <div className="bg-white w-full max-w-[816px] min-h-[5400px] shadow-xl p-16 text-black">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-[36px] font-bold text-[#0066CC] mb-3">
                Suhas Nidgundi
              </h1>
              <p className="text-[14px] text-gray-600 mb-2">
                Final-year engineer building scalable systems, cloud-native
                services, and empowering developers through thoughtful
                engineering.
              </p>
              <p className="text-[11px] text-gray-500">
                📧 suhasnidgundi@gmail.com | 🔗 linkedin.com/in/suhasnidgundi |
                💻 github.com/suhasnidgundi
              </p>
              <hr className="mt-4 border-t-2 border-[#0066CC]" />
            </div>

            {/* Opening */}
            <div className="mb-10">
              <p className="text-[13px] leading-relaxed text-gray-800 mb-3">
                I've always been the kid who took things apart. Not to break
                them, but to understand them. Remote-controlled cars, old
                radios, plastic toys—if it had screws, it was fair game. My
                parents weren't exactly thrilled when birthday gifts ended up in
                pieces on the living room floor, but I was mesmerized by what
                was inside. Gears meshing, circuits connecting, batteries
                powering tiny motors. Everything worked together like a
                symphony.
              </p>
              <p className="text-[13px] leading-relaxed text-gray-800 mb-3">
                My father's Windows XP computer became my favorite puzzle. Sure,
                I played games, but what really captivated me was watching the
                system itself—antivirus scans running their patterns, the
                desktop evolving from XP's green hills to Windows 7's sleek
                glass, then Windows 10's flat design. I'd spend hours just
                exploring, clicking through system folders, trying to understand
                what made it all tick.
              </p>
              <p className="text-[13px] leading-relaxed text-gray-800 mb-3">
                Then one day in middle school, I stumbled upon HTML. I didn't
                know what I was doing—just copy-pasting snippets from websites,
                changing colors, breaking layouts, fixing them through sheer
                trial and error. By high school, I discovered Bootstrap, and
                suddenly web pages weren't magic anymore. They were code. Code I
                could understand, manipulate, and control.
              </p>
              <p className="text-[13px] leading-relaxed text-gray-800 italic font-semibold">
                That's when it clicked: engineering isn't about breaking things.
                It's about understanding how they work so you can build
                something better.
              </p>
            </div>

            {/* The Learning Years */}
            <section className="mb-10">
              <h2 className="text-[22px] font-bold text-[#0066CC] mb-5 pb-2 border-b-2 border-[#0066CC]/30">
                Learning to Build
              </h2>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                I pursued a Diploma in Information Technology, where the real
                learning happened through hands-on projects. Academic
                assignments taught me syntax and structure, but my fifth
                semester changed everything—I landed an internship at Sutradhar
                as a React Developer.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                This wasn't college coding anymore. Suddenly, I was working on
                applications that real users would interact with. I learned why
                component reusability matters when you're building at scale. Why
                Git workflows aren't bureaucracy—they're what keep teams from
                descending into chaos. Why code reviews aren't personal
                attacks—they're how we all get better together. Why writing
                maintainable code isn't optional—it's respect for the next
                person who'll touch your work.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-6">
                Sutradhar transformed me from someone who could make things work
                into someone who understood why they should work that way.
                There's a huge difference between writing code that runs and
                writing code that lasts.
              </p>

              <div className="bg-blue-50 p-5 rounded border-l-4 border-[#0066CC] mb-6">
                <p className="text-[12px] leading-relaxed text-gray-800 font-semibold mb-2">
                  The things I learned at Sutradhar:
                </p>
                <p className="text-[12px] leading-relaxed text-gray-700">
                  Design patterns aren't academic exercises—they're
                  battle-tested solutions to problems you'll definitely face.
                  Documentation isn't busywork—it's the difference between a
                  codebase people can work with and one they're afraid to touch.
                  And technical debt? It always comes due, usually at the worst
                  possible time.
                </p>
              </div>

              <p className="text-[13px] leading-relaxed text-gray-800">
                After my diploma, I continued into a Bachelor's in Computer
                Engineering at DYPCOEI, Pune. The degree years pushed me deeper
                into distributed systems, cloud architectures, and the kind of
                engineering that operates at scale. But theory only takes you so
                far. I needed to see it in action.
              </p>
            </section>

            {/* The Hospital Project */}
            <section className="mb-10">
              <h2 className="text-[22px] font-bold text-[#0066CC] mb-5 pb-2 border-b-2 border-[#0066CC]/30">
                Building for Real Impact
              </h2>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                My internship at ACE Hospital and Research Centre taught me
                something crucial: the best engineering happens when you truly
                understand the problem you're solving.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                I spent eight days just observing. Not coding. Not designing.
                Just watching. I shadowed receptionists as they manually filled
                registration forms for each patient—8 to 12 minutes per person
                during rush hours. I stood with nurses as they called out
                handwritten queue numbers. I followed lab technicians as they
                physically carried samples between departments because the
                digital system couldn't track them. I sat with doctors who
                dictated prescriptions to assistants because the software didn't
                have the medical terms they needed.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                The hospital was using Manorama Lifeline—a Windows Server-based
                system that worked, but barely. It was like watching a machine
                held together with duct tape and determination. Every
                bottleneck, every workaround, every frustrated sigh from staff
                told me where the system was failing.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                So I started mapping workflows. Patient registration.
                Appointment scheduling. Billing and concessions. Laboratory test
                management. Human resources. I drew flowcharts, documented
                integration points, cataloged pain points. By the end of
                observation week, I had a blueprint of how the hospital actually
                operated versus how the software assumed it operated.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-6">
                Then I started building. RESTful APIs connecting the hospital's
                SQL Server database to modern interfaces. A receptionist
                dashboard that automated patient entry and exit logging—crucial
                for NABH compliance audits. Concession approval workflows that
                eliminated the need for verbal approvals and physical
                signatures. Digital queue management that freed staff from
                writing numbers on slips of paper.
              </p>

              <div className="bg-gray-50 p-5 rounded mb-6">
                <p className="text-[12px] font-bold text-gray-800 mb-3">
                  What changed:
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-[#0066CC] font-bold">→</span>
                    <p className="text-[12px] text-gray-700">
                      Patient registration dropped from 10 minutes of
                      form-filling to under 4 minutes
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0066CC] font-bold">→</span>
                    <p className="text-[12px] text-gray-700">
                      Queue numbers went fully digital—no more hand-written
                      slips
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0066CC] font-bold">→</span>
                    <p className="text-[12px] text-gray-700">
                      Duplicate patient records fell from 5% to less than 1%
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0066CC] font-bold">→</span>
                    <p className="text-[12px] text-gray-700">
                      NABH audit compliance became automatic instead of manual
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[13px] leading-relaxed text-gray-800 italic">
                This project taught me that good engineering isn't about using
                the latest framework or the coolest tech stack. It's about
                understanding the people who'll use what you build and solving
                their actual problems, not the ones you assume they have.
              </p>
            </section>

            {/* Freelancing Years */}
            <section className="mb-10">
              <h2 className="text-[22px] font-bold text-[#0066CC] mb-5 pb-2 border-b-2 border-[#0066CC]/30">
                Freelancing: Learning by Doing
              </h2>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                Throughout 2022 and 2023, I took on freelance projects across
                different industries. Each one taught me something new about
                building software that people actually use.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                {" "}
                During this time, I worked on a mix of projects—everything from
                WordPress websites for schools and colleges to custom web
                applications like invoicing tools and internal dashboards. Each
                project came with different user needs, different deadlines, and
                different levels of complexity, which pushed me to understand
                how software actually gets used outside tutorials.{" "}
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                {" "}
                I built and maintained production systems such as an invoicing
                application for a banking client, where reliability and data
                accuracy were non-negotiable. I handled things like database
                structuring, optimising slow queries, setting up secure logins,
                and deploying updates without disrupting users. These
                experiences taught me the practical side of engineering—clean
                code matters, but stability and predictability matter even
                more.{" "}
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-6">
                {" "}
                Over time, many of these clients—schools, colleges, small
                businesses, and even a bank—continued to rely on the systems I
                built. Some still use the same websites and tools today. Hearing
                that the invoicing software or website I created was still
                running smoothly months later always felt like the best
                validation of my work.{" "}
              </p>

              <div className="bg-blue-50 p-5 rounded border-l-4 border-[#0066CC]">
                <p className="text-[12px] leading-relaxed text-gray-800 font-semibold">
                  "Technical excellence means nothing if it doesn't solve a real
                  problem for real people. The best code is code that gets
                  used."
                </p>
              </div>
            </section>

            {/* Community */}
            <section className="mb-10">
              <h2 className="text-[22px] font-bold text-[#0066CC] mb-5 pb-2 border-b-2 border-[#0066CC]/30">
                Teaching & Community
              </h2>
              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                I volunteer with AWS Community Pune, and all the contributions
                I’ve made here have helped me grow both technically and
                personally. From working on the website to supporting events,
                I’ve learned how much effort goes into building something that
                scales for hundreds of people.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                The community itself is full of energy — students,
                professionals, and enthusiasts all coming together to explore
                cloud technologies. Being part of this environment gave me
                exposure to real challenges, like handling bandwidth limits,
                migrating systems, and solving problems under pressure.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800">
                What I realized is that community isn’t just about attending
                events — it’s about contributing, sharing experiences, and
                learning from each other’s journeys. Every issue I faced and
                resolved became a story worth sharing, and those lessons
                continue to shape how I approach new projects today.
              </p>
            </section>

            {/* Tech Stack */}
            <section className="mb-10">
              <h2 className="text-[22px] font-bold text-[#0066CC] mb-5 pb-2 border-b-2 border-[#0066CC]/30">
                What I Work With
              </h2>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-5">
                Over the years, I've built production systems with React and
                TypeScript on the frontend. Node.js and Express on the backend.
                MySQL, and Supabase for databases. AWS for cloud
                infrastructure—EC2 for compute, S3 for storage, Lambda for
                serverless functions. Docker and Kubernetes for
                containerization. GitHub Actions for CI/CD pipelines. Vercel for
                deployments.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-5">
                But honestly? The tech stack is just tools. What matters more is
                knowing when to use them. When does serverless make sense versus
                traditional servers? When should you denormalize a database for
                performance? When is a monolith better than microservices? These
                aren't questions you answer with dogma—you answer them by
                understanding the problem you're solving and the constraints
                you're working within.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-[12px] font-bold text-gray-800 mb-2">
                    Frontend
                  </p>
                  <p className="text-[11px] text-gray-700">
                    React, TypeScript, Tailwind/Bootstrap CSS, Responsive Design
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-[12px] font-bold text-gray-800 mb-2">
                    Backend
                  </p>
                  <p className="text-[11px] text-gray-700">
                    Node.js, Express.js, RESTful APIs, Authentication
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-[12px] font-bold text-gray-800 mb-2">
                    Databases
                  </p>
                  <p className="text-[11px] text-gray-700">
                    {" "}
                    MySQL, SQL Server, Firebase, Query Optimization
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-[12px] font-bold text-gray-800 mb-2">
                    Cloud & DevOps
                  </p>
                  <p className="text-[11px] text-gray-700">
                    AWS, Docker, Kubernetes, GitHub Actions, CI/CD
                  </p>
                </div>
              </div>

              <p className="text-[13px] leading-relaxed text-gray-800">
                I'm comfortable working across the full stack, but I'm most
                excited about cloud-native architectures and systems that need
                to scale. There's something satisfying about designing
                infrastructure that gracefully handles 10x traffic without
                breaking a sweat.
              </p>
            </section>

            {/* Right Now */}
            <section className="mb-10">
              <h2 className="text-[22px] font-bold text-[#0066CC] mb-5 pb-2 border-b-2 border-[#0066CC]/30">
                What I'm Working On Now
              </h2>
              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                {" "}
                I'm in my final year at DYPCOEI, and most of my learning now
                comes from the work I'm doing on my final-year project,{" "}
                <span class="font-semibold">PromptGuard</span>. It's a
                multi-layer defense system designed to prevent prompt injection
                and detect PII leakage before text reaches an LLM. Right now, my
                focus is on building the core detection engine—regex-based
                scanning for structured PII, an NER layer for contextual
                entities, and a lightweight ML model for indirect identifiers.
                Bringing these layers together in a single pipeline has been one
                of the most challenging and rewarding parts of the project.{" "}
              </p>{" "}
              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                {" "}
                Alongside detection, I'm working on the anonymization and
                sanitization module, which automatically masks sensitive data
                while maintaining the meaning and structure of the original
                prompt. I’ve spent a lot of time testing how different
                sanitization strategies affect LLM responses, and fine-tuning
                the system so privacy protection doesn’t come at the cost of
                usability. We're also integrating the system into a middleware
                API so it can sit between any application and an LLM without
                requiring changes to existing workflows.{" "}
              </p>{" "}
              <p className="text-[13px] leading-relaxed text-gray-800 mb-6">
                {" "}
                Beyond the backend work, I’m contributing to the project’s
                dashboard—building a clean interface for policy controls, audit
                logs, and real-time detection events. It’s helped me understand
                not just the technical aspects of privacy and security, but also
                how to present complex detection logic in a way that’s
                understandable to non-technical users. Working on PromptGuard
                has pushed me into areas like architecture design, ML-based text
                analysis, and secure API development, all of which are shaping
                the engineer I’m becoming.{" "}
              </p>
              <div className="bg-gray-50 p-5 rounded">
                <p className="text-[12px] font-bold text-gray-800 mb-3">
                  In the next six months:
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-[#0066CC]">•</span>
                    <p className="text-[12px] text-gray-700">
                      Launch my recruiter-focused portfolio with case studies
                      and architectural breakdowns
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0066CC]">•</span>
                    <p className="text-[12px] text-gray-700">
                      Earn AWS Practitioner Certification
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0066CC]">•</span>
                    <p className="text-[12px] text-gray-700">
                      Contribute to three high-impact open-source projects
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0066CC]">•</span>
                    <p className="text-[12px] text-gray-700">
                      Publish technical articles on cloud architecture patterns
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Future Vision */}
            <section className="mb-10">
              <h2 className="text-[22px] font-bold text-[#0066CC] mb-5 pb-2 border-b-2 border-[#0066CC]/30">
                Where I'm Headed
              </h2>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                Five years from now, I want to be architecting large-scale
                distributed systems at a company where engineering excellence
                meets global impact. Microsoft. Google. Amazon. Places where the
                problems are hard and the solutions affect millions of people.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                But it's not just about the scale—it's about the impact. I want
                to build systems that make people's lives easier. APIs that
                developers love using. Platforms that just work. Infrastructure
                that scales gracefully under load. The kind of engineering that
                looks simple from the outside but is elegantly complex
                underneath.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                I also want to mentor. To help junior engineers grow into
                seniors who think deeply about architecture, scalability, and
                maintainability. To contribute to open-source tools that shape
                how we build software. To organize workshops and conferences
                that bring the community together.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 italic font-semibold">
                Ambition without a plan is just a dream. I'm building the
                skills, the network, and the portfolio to make this inevitable.
              </p>
            </section>

            {/* Beyond Code */}
            <section className="mb-10">
              <h2 className="text-[22px] font-bold text-[#0066CC] mb-5 pb-2 border-b-2 border-[#0066CC]/30">
                Life Beyond Code
              </h2>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                When I'm not staring at code, I play melodica and guitar.
                There's something about music that scratches the same itch as
                programming—patterns, rhythm, structure. Finding harmony in
                complexity.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                I follow creators like Fireship for rapid-fire tech insights,
                DIY Perks for ingenious hardware hacks, and NetworkChuck for
                networking deep-dives. Technology isn't just my career—it's how
                I see the world. Everything is a system. Every problem has a
                solution if you understand it deeply enough.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800">
                That kid who took apart remote-controlled cars is still here,
                just with better tools and bigger problems to solve.
              </p>
            </section>

            {/* Philosophy */}
            <section className="mb-8">
              <h2 className="text-[22px] font-bold text-[#0066CC] mb-5 pb-2 border-b-2 border-[#0066CC]/30">
                How I Think About Engineering
              </h2>

              <div className="bg-blue-50 p-6 rounded border-l-4 border-[#0066CC]">
                <p className="text-[13px] leading-relaxed text-gray-800 mb-3">
                  Write code that tells a story. Design systems that scale
                  gracefully. Build experiences that delight users. Document
                  everything as if you're teaching someone who's just getting
                  started.
                </p>
                <p className="text-[13px] leading-relaxed text-gray-800 mb-3">
                  Automate the boring work so you can focus on the creative
                  problems. Ship often, ship fast, ship with quality.
                </p>
                <p className="text-[13px] leading-relaxed text-gray-800 font-semibold">
                  Every commit is a promise to the next person who'll read your
                  code—including future you.
                </p>
              </div>
            </section>

            {/* Closing */}
            <section className="mb-6">
              <h2 className="text-[22px] font-bold text-[#0066CC] mb-5 pb-2 border-b-2 border-[#0066CC]/30">
                Let's Build Something
              </h2>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                I don't just write code—I solve problems. From taking apart toys
                as a kid to engineering healthcare systems that real people
                depend on, my journey has been driven by one constant: curiosity
                paired with discipline.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 mb-4">
                I bring technical skills that have been tested in production.
                Business impact that's been measured in saved time and happier
                users. Communication skills honed through mentoring and
                teaching. And most importantly, a mindset that sees every
                problem as a system waiting to be understood.
              </p>

              <p className="text-[13px] leading-relaxed text-gray-800 font-semibold">
                I'm ready to contribute from day one, learn voraciously, and
                grow into roles where I'm solving complex problems at scale.
                Let's build systems that matter.
              </p>
            </section>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center">
              <p className="text-[11px] text-gray-600 mb-1">
                📧 suhasnidgundi@gmail.com
              </p>
              <p className="text-[11px] text-gray-600 mb-2">
                🔗 github.com/suhasnidgundi • linkedin.com/in/suhasnidgundi
              </p>
              <p className="text-[10px] text-gray-500">
                Pune, India • Available for Full-Time Opportunities • January
                2026
              </p>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-2 py-1 bg-[hsl(var(--xp-toolbar-bg))] border-t border-border text-[11px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Page 1 of 3</span>
            <span>|</span>
            <span>Words: 2,134</span>
          </div>
          <div className="flex items-center gap-2">
            <span>English (India)</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default XPWordDocument;
