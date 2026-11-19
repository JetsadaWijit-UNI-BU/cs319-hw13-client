import React from "react";
import soraditImg from "../img/soradit.jpg";
import warisImg from "../img/waris.jpg";

const techStack = [
  "React 19",
  "Vite",
  "TypeScript",
  "React Router v7",
  "TanStack Query",
  "Zustand",
  "DaisyUI",
];

const members = [
  {
    name: "ศรดิษฐ์ เขียวป้อ",
    nickname: "โอ๊ค",
    id: "1660701366",
    role: "Frontend & UI Layout",
    img: soraditImg,
  },
  {
    name: "วริศ ศรีสุข",
    nickname: "แฮม",
    id: "1660700665",
    role: "About & Shopping List Page",
    img: warisImg,
  },
  {
    name: "เจษฎา วิจิตร",
    nickname: "โอเว่น",
    id: "1640705339",
    role: "Routing & Client State",
    img: "https://avatars.githubusercontent.com/u/56456776?v=4",
  },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto my-6 px-4">
      <div className="card bg-base-100 shadow-xl border border-base-300 p-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-base-content">
            รายละเอียดเกี่ยวกับเรา
          </h1>
          <p className="text-sm text-left indent-8">
            ทุกวันนี้เราหาสูตรอาหารได้ทั้งจาก YouTube และเว็บไซต์ต่างๆ
            แต่มักเจอปัญหาเดิมๆ คือสูตรยาวเกินไป หรืออ่านยาก
            ทำให้การหาสูตรกลายเป็นเรื่องน่าเบื่อ
          </p>
          <p className="text-sm text-left">
            <b> Gusto (Recipe Hub) </b>จึงเกิดขึ้นจากแนวคิดเรียบง่าย
            รวบรวมสูตรอาหารในระบบฐานข้อมูลของเราเอง (Backend + Prisma ORM +
            PostgreSQL) มาจัดรูปแบบการแสดงผลใหม่ให้สั้น กระชับ ดูง่าย
            เห็นทั้งส่วนผสมและวิธีทำได้ทันทีโดยไม่ต้องเลื่อนหาให้เหนื่อย
            และถ้าเจอสูตรที่ถูกใจ ก็กดเซฟเก็บไว้ใน My Collection
            เพื่อกลับมาดูทีหลังได้ทุกเมื่อ
          </p>

          <dl className="text-sm border-t border-base-200 pt-2">
            <div className="flex justify-between py-2 border-b border-base-200">
              <dt>เว็บแอปพลิเคชัน</dt>
              <dd className="font-semibold text-primary">Gusto (Recipe Hub)</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-base-200">
              <dt>วิชา</dt>
              <dd className="font-semibold">CS319 Internet Programming I</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-base-200">
              <dt>สถาปัตยกรรม</dt>
              <dd className="font-semibold">Modern Decoupled SPA</dd>
            </div>
          </dl>

          <div>
            <h2 className="font-bold mb-3">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {techStack.map((t) => (
                <span key={t} className="badge badge-outline text-xs">
                  {t}
                </span>
              ))}
            </div>

            <hr className="my-6 border-base-200" />

            <div>
              <h2 className="font-bold">API Link</h2>
              <p className="text-sm">
                Backend RESTful API (Prisma + PostgreSQL) running locally at
                <code className="font-mono text-xs bg-base-200 px-2">http://localhost:3000/api</code>
              </p>
            </div>
          </div>
        </div>

        <aside className="bg-base-200 rounded-2xl p-5 space-y-5 self-start border border-base-300">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-4">
              {m.img ? (
                <img
                  src={m.img}
                  alt={m.name}
                  className="w-16 h-16 shrink-0 rounded-2xl object-cover bg-base-100 border border-base-300"
                />
              ) : (
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-base-300" />
              )}
              <div className="min-w-0">
                <div className="text-sm font-semibold">
                  {m.name} ({m.nickname})
                </div>
                <div className="text-sm font-mono text-base-content/70">
                  {m.id}
                </div>
                <div className="text-xs text-base-content/80">
                  หน้าที่: {m.role}
                </div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
};
