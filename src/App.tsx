import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const COLORS = {
  bg: "#0a0c0f",
  surface: "#111418",
  surface2: "#181c22",
  border: "#1e2530",
  accent: "#f59e0b",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#94a3b8",
  green: "#22c55e",
  red: "#ef4444",
  blue: "#3b82f6",
};

const users: any = {
  gip: { name: "Алишер Назаров", role: "ГИП", avatar: "АН", color: "#f59e0b" },
  lead1: {
    name: "Дмитрий Ким",
    role: "Рук. отдела КМ",
    avatar: "ДК",
    color: "#3b82f6",
  },
  lead2: {
    name: "Светлана Орлова",
    role: "Рук. отдела ЭМ",
    avatar: "СО",
    color: "#a855f7",
  },
  eng1: {
    name: "Алексей Петров",
    role: "Инженер",
    avatar: "АП",
    color: "#22c55e",
  },
  eng2: {
    name: "Мария Усова",
    role: "Инженер",
    avatar: "МУ",
    color: "#06b6d4",
  },
};

const Avatar = ({ uid, size = 32 }: any) => {
  const u = users[uid] || { avatar: "?", color: "#666" };
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: u.color + "22",
        border: `1.5px solid ${u.color}44`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 700,
        color: u.color,
        flexShrink: 0,
      }}
    >
      {u.avatar}
    </div>
  );
};

const Badge = ({ status }: any) => {
  const map: any = {
    active: { label: "В работе", color: COLORS.green },
    review: { label: "На проверке", color: COLORS.accent },
    done: { label: "Готово", color: COLORS.textMuted },
    inprogress: { label: "В работе", color: COLORS.blue },
    todo: { label: "Ожидает", color: COLORS.textMuted },
  };
  const s = map[status] || map.todo;
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: s.color,
        background: s.color + "18",
        border: `1px solid ${s.color}33`,
        padding: "2px 8px",
        borderRadius: 4,
      }}
    >
      {s.label}
    </span>
  );
};

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [msgs, setMsgs] = useState<any[]>([]);
  const [activeProject, setActiveProject] = useState<any>(null);
  const [sideTab, setSideTab] = useState("tasks");
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (activeProject) {
      loadTasks(activeProject.id);
      loadMessages(activeProject.id);
    }
  }, [activeProject]);

  const loadProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("id");
    if (data) {
      setProjects(data);
      setActiveProject(data[0]);
    }
    setLoading(false);
  };

  const loadTasks = async (projectId: number) => {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId);
    if (data) setTasks(data);
  };

  const loadMessages = async (projectId: number) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at");
    if (data) setMsgs(data);
  };

  const sendMsg = async () => {
    if (!chatInput.trim() || !activeProject) return;
    await supabase.from("messages").insert({
      text: chatInput,
      user_id: "gip",
      project_id: activeProject.id,
      type: "text",
    });
    setChatInput("");
    loadMessages(activeProject.id);
  };

  const navItems = [
    { id: "dashboard", icon: "⬡", label: "Обзор" },
    { id: "project", icon: "◈", label: "Проект" },
    { id: "tasks", icon: "≡", label: "Задачи" },
    { id: "org", icon: "◎", label: "Команда" },
  ];

  if (loading)
    return (
      <div
        style={{
          background: COLORS.bg,
          color: COLORS.accent,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          fontSize: 16,
        }}
      >
        Загрузка EngHub...
      </div>
    );

  return (
    <div
      style={{
        fontFamily: "monospace",
        background: COLORS.bg,
        color: COLORS.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #2a3040; }`}</style>

      {/* Top bar */}
      <div
        style={{
          background: COLORS.surface,
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "0 20px",
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: COLORS.accent,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 900,
            }}
          >
            ⬡
          </div>
          <span
            style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.05em" }}
          >
            ENGHUB
          </span>
          {activeProject && (
            <span style={{ color: COLORS.textMuted, fontSize: 12 }}>
              | {activeProject.code}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: COLORS.green,
            }}
          />
          <span style={{ fontSize: 12, color: COLORS.textDim }}>
            {users.gip.name}
          </span>
          <Avatar uid="gip" size={28} />
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div
          style={{
            width: 56,
            background: COLORS.surface,
            borderRight: `1px solid ${COLORS.border}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "12px 0",
            gap: 4,
          }}
        >
          {navItems.map((n) => (
            <button
              key={n.id}
              title={n.label}
              onClick={() => setScreen(n.id)}
              style={{
                width: 40,
                height: 40,
                background:
                  screen === n.id ? COLORS.accent + "18" : "transparent",
                border: "none",
                borderLeft:
                  screen === n.id
                    ? `2px solid ${COLORS.accent}`
                    : "2px solid transparent",
                cursor: "pointer",
                color: screen === n.id ? COLORS.accent : COLORS.textMuted,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {n.icon}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          {/* DASHBOARD */}
          {screen === "dashboard" && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.textMuted,
                    letterSpacing: "0.1em",
                    marginBottom: 4,
                  }}
                >
                  РАБОЧИЙ СТОЛ
                </div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>
                  Добро пожаловать, Алишер
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                {[
                  {
                    label: "ПРОЕКТОВ",
                    value: projects.length,
                    color: COLORS.accent,
                  },
                  { label: "ЗАДАЧ", value: tasks.length, color: COLORS.blue },
                  { label: "ИНЖЕНЕРОВ", value: 18, color: COLORS.green },
                  { label: "ДОКУМЕНТОВ", value: 247, color: "#a855f7" },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: COLORS.surface,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 8,
                      padding: 16,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: COLORS.textMuted,
                        marginBottom: 8,
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{ fontSize: 28, fontWeight: 700, color: s.color }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: COLORS.textMuted,
                  marginBottom: 12,
                }}
              >
                ПРОЕКТЫ
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {projects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setActiveProject(p);
                      setScreen("project");
                    }}
                    style={{
                      background: COLORS.surface,
                      border: `1px solid ${
                        activeProject?.id === p.id
                          ? COLORS.accent + "55"
                          : COLORS.border
                      }`,
                      borderRadius: 8,
                      padding: "14px 18px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                        <span style={{ fontSize: 10, color: COLORS.textMuted }}>
                          {p.code}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: 11, color: COLORS.textMuted }}>
                          до {p.deadline}
                        </span>
                        <Badge status={p.status} />
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: 3,
                          background: COLORS.border,
                          borderRadius: 2,
                        }}
                      >
                        <div
                          style={{
                            width: `${p.progress}%`,
                            height: "100%",
                            background:
                              p.progress > 80 ? COLORS.green : COLORS.accent,
                            borderRadius: 2,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: COLORS.accent,
                        }}
                      >
                        {p.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECT */}
          {screen === "project" && activeProject && (
            <div>
              <div
                style={{
                  marginBottom: 20,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: COLORS.textMuted,
                      marginBottom: 4,
                    }}
                  >
                    ПРОЕКТ / {activeProject.code}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>
                    {activeProject.name}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["tasks", "chat"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSideTab(t)}
                      style={{
                        background:
                          sideTab === t
                            ? COLORS.accent + "22"
                            : COLORS.surface2,
                        border: `1px solid ${
                          sideTab === t ? COLORS.accent + "44" : COLORS.border
                        }`,
                        color: sideTab === t ? COLORS.accent : COLORS.textDim,
                        padding: "6px 14px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      {t === "tasks" ? "Задачи" : "Чат"}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>
                    Готовность
                  </span>
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: COLORS.accent,
                    }}
                  >
                    {activeProject.progress}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: COLORS.border,
                    borderRadius: 3,
                  }}
                >
                  <div
                    style={{
                      width: `${activeProject.progress}%`,
                      height: "100%",
                      background: `linear-gradient(90deg,${COLORS.accent},${COLORS.green})`,
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>

              {sideTab === "tasks" && (
                <div
                  style={{
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  {tasks.map((t, i) => (
                    <div
                      key={t.id}
                      style={{
                        padding: "13px 18px",
                        borderBottom:
                          i < tasks.length - 1
                            ? `1px solid ${COLORS.border}`
                            : "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background:
                            t.priority === "high"
                              ? COLORS.red
                              : t.priority === "medium"
                              ? COLORS.accent
                              : COLORS.textMuted,
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ flex: 1, fontSize: 13 }}>{t.name}</span>
                      <span
                        style={{
                          fontSize: 10,
                          color: COLORS.textMuted,
                          background: COLORS.surface2,
                          padding: "2px 6px",
                          borderRadius: 3,
                        }}
                      >
                        {t.dept}
                      </span>
                      <Badge status={t.status} />
                      <span style={{ fontSize: 11, color: COLORS.textMuted }}>
                        {t.deadline}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {sideTab === "chat" && (
                <div
                  style={{
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8,
                    display: "flex",
                    flexDirection: "column",
                    height: 400,
                  }}
                >
                  <div
                    style={{
                      padding: "10px 16px",
                      borderBottom: `1px solid ${COLORS.border}`,
                      fontSize: 11,
                      color: COLORS.textMuted,
                    }}
                  >
                    # {activeProject.name}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {msgs.map((m) => (
                      <div key={m.id} style={{ display: "flex", gap: 10 }}>
                        <Avatar uid={m.user_id} size={28} />
                        <div>
                          <div
                            style={{ display: "flex", gap: 8, marginBottom: 3 }}
                          >
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: users[m.user_id]?.color || "#888",
                              }}
                            >
                              {users[m.user_id]?.name || m.user_id}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, color: COLORS.textDim }}>
                            {m.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      padding: 12,
                      borderTop: `1px solid ${COLORS.border}`,
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                      placeholder="Написать сообщение..."
                      style={{
                        flex: 1,
                        background: COLORS.surface2,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 6,
                        padding: "8px 12px",
                        color: COLORS.text,
                        fontSize: 13,
                        outline: "none",
                        fontFamily: "inherit",
                      }}
                    />
                    <button
                      onClick={sendMsg}
                      style={{
                        background: COLORS.accent,
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 14px",
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                    >
                      ↑
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TASKS KANBAN */}
          {screen === "tasks" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.textMuted,
                    marginBottom: 4,
                  }}
                >
                  ЗАДАЧИ
                </div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>
                  Канбан-доска
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 12,
                }}
              >
                {["todo", "inprogress", "done"].map((col) => {
                  const colTasks = tasks.filter((t) => t.status === col);
                  const labels: any = {
                    todo: "ОЖИДАЕТ",
                    inprogress: "В РАБОТЕ",
                    done: "ГОТОВО",
                  };
                  const colors: any = {
                    todo: COLORS.textMuted,
                    inprogress: COLORS.blue,
                    done: COLORS.green,
                  };
                  return (
                    <div key={col}>
                      <div
                        style={{
                          fontSize: 10,
                          color: colors[col],
                          marginBottom: 10,
                        }}
                      >
                        {labels[col]} · {colTasks.length}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {colTasks.map((t) => (
                          <div
                            key={t.id}
                            style={{
                              background: COLORS.surface,
                              border: `1px solid ${COLORS.border}`,
                              borderRadius: 8,
                              padding: 14,
                            }}
                          >
                            <div style={{ fontSize: 13, marginBottom: 8 }}>
                              {t.name}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 10,
                                  color: COLORS.textMuted,
                                  background: COLORS.surface2,
                                  padding: "2px 6px",
                                  borderRadius: 3,
                                }}
                              >
                                {t.dept}
                              </span>
                              <span
                                style={{
                                  fontSize: 11,
                                  color: COLORS.textMuted,
                                }}
                              >
                                {t.deadline}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ORG */}
          {screen === "org" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.textMuted,
                    marginBottom: 4,
                  }}
                >
                  КОМАНДА
                </div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>
                  Иерархия проекта
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.accent}55`,
                    borderRadius: 10,
                    padding: "14px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Avatar uid="gip" size={40} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{users.gip.name}</div>
                    <div style={{ fontSize: 10, color: COLORS.accent }}>
                      {users.gip.role}
                    </div>
                  </div>
                </div>
                <div
                  style={{ width: 1, height: 20, background: COLORS.border }}
                />
                <div style={{ display: "flex", gap: 40 }}>
                  {["lead1", "lead2"].map((uid) => (
                    <div
                      key={uid}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 1,
                          height: 20,
                          background: COLORS.border,
                        }}
                      />
                      <div
                        style={{
                          background: COLORS.surface,
                          border: `1px solid ${users[uid].color}44`,
                          borderRadius: 10,
                          padding: "12px 20px",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Avatar uid={uid} size={34} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>
                            {users[uid].name}
                          </div>
                          <div
                            style={{ fontSize: 10, color: users[uid].color }}
                          >
                            {users[uid].role}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          width: 1,
                          height: 20,
                          background: COLORS.border,
                        }}
                      />
                      <div
                        style={{
                          background: COLORS.surface,
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: 8,
                          padding: "10px 14px",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Avatar
                          uid={uid === "lead1" ? "eng1" : "eng2"}
                          size={28}
                        />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>
                            {users[uid === "lead1" ? "eng1" : "eng2"].name}
                          </div>
                          <div
                            style={{ fontSize: 10, color: COLORS.textMuted }}
                          >
                            Инженер
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
