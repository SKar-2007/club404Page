import { useState, useId, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Plus,
  Trash2,
  Calendar,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  ScheduledChallenge,
  TestCase,
  getISTDateString,
  getISTDateOffset,
  midnightIST,
  loadScheduledChallenges,
  saveScheduledChallenges,
} from "@/lib/code-golf";

interface ModChallengePanelProps {
  onChallengesUpdated: () => void;
}

export default function ModChallengePanel({
  onChallengesUpdated,
}: ModChallengePanelProps) {
  const { isAuthenticated, isRoleOrAbove } = useAuth();
  const canManage = isAuthenticated && isRoleOrAbove("moderator");

  const componentId = useId();
  const idCounterRef = useRef(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getISTDateOffset(1));

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [starterCode, setStarterCode] = useState("");
  const [testInput, setTestInput] = useState("");
  const [testExpected, setTestExpected] = useState("");
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  const allScheduled = loadScheduledChallenges();
  const todayStr = getISTDateString();

  const todayChallenges = allScheduled.filter(
    (c) => c.scheduledDate === todayStr
  );
  const upcomingChallenges = allScheduled.filter(
    (c) => c.scheduledDate > todayStr
  );

  const addTestCase = () => {
    if (testInput || testExpected) {
      setTestCases([
        ...testCases,
        { input: testInput, expectedOutput: testExpected, description: "" },
      ]);
      setTestInput("");
      setTestExpected("");
    }
  };

  const removeTestCase = (idx: number) => {
    setTestCases(testCases.filter((_, i) => i !== idx));
  };

  const handleAddChallenge = () => {
    if (!title.trim() || !description.trim() || testCases.length === 0) return;

    const newChallenge: ScheduledChallenge = {
      id: `golf-mod-${componentId}-${++idCounterRef.current}`,
      title: title.trim(),
      description: description.trim(),
      difficulty,
      testCases,
      starterCode: starterCode.trim() || "// Your code here",
      language: "javascript",
      createdAt: new Date().toISOString(),
      publishAt: midnightIST(selectedDate),
      expiresAt: midnightIST(getISTDateOffset(1)),
      scheduledDate: selectedDate,
      published: false,
    };

    const updated = [...allScheduled, newChallenge];
    saveScheduledChallenges(updated);
    onChallengesUpdated();

    // Reset form
    setTitle("");
    setDescription("");
    setStarterCode("");
    setTestCases([]);
    setTestInput("");
    setTestExpected("");
  };

  const handleDelete = (id: string) => {
    const updated = allScheduled.filter((c) => c.id !== id);
    saveScheduledChallenges(updated);
    onChallengesUpdated();
  };

  if (!canManage) {
    return (
      <div className="card-brutal border-yellow-400/30 p-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 w-full text-left"
        >
          <Shield className="w-4 h-4 text-yellow-400" />
          <span className="font-mono text-xs text-yellow-400 uppercase tracking-wider">
            Mod Panel
          </span>
          <ChevronDown
            className={`w-3 h-3 text-muted-foreground ml-auto transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="font-mono text-xs text-muted-foreground mt-3">
                {isAuthenticated
                  ? "You need Moderator access to manage challenges."
                  : "Sign in as Moderator or above to manage challenges."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="card-brutal border-yellow-400/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full text-left p-3"
      >
        <Shield className="w-4 h-4 text-yellow-400" />
        <span className="font-mono text-xs text-yellow-400 uppercase tracking-wider">
          Mod Panel
        </span>
        <span className="font-mono text-[10px] text-muted-foreground ml-auto">
          {todayChallenges.length} today / {upcomingChallenges.length} upcoming
        </span>
        <ChevronDown
          className={`w-3 h-3 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-4 border-t-2 border-foreground/10 pt-3">
              {/* Schedule date selector */}
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-mono text-xs text-muted-foreground">
                  Schedule for:
                </span>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-7 px-2 bg-background border-2 border-foreground/30 font-mono text-xs focus:border-electric outline-none"
                >
                  <option value={todayStr}>
                    Today ({todayStr})
                  </option>
                  {[1, 2, 3, 4, 5, 6, 7].map((offset) => {
                    const d = getISTDateOffset(offset);
                    return (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Add challenge form */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Challenge title"
                  className="w-full h-8 px-2 bg-background border-2 border-foreground/30 font-mono text-xs focus:border-electric outline-none"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="w-full px-2 py-1.5 bg-background border-2 border-foreground/30 font-mono text-xs focus:border-electric outline-none resize-none"
                />
                <div className="flex gap-2">
                  <select
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(e.target.value as "easy" | "medium" | "hard")
                    }
                    className="h-8 px-2 bg-background border-2 border-foreground/30 font-mono text-xs focus:border-electric outline-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <input
                    type="text"
                    value={starterCode}
                    onChange={(e) => setStarterCode(e.target.value)}
                    placeholder="Starter code (optional)"
                    className="flex-1 h-8 px-2 bg-background border-2 border-foreground/30 font-mono text-xs focus:border-electric outline-none"
                  />
                </div>

                {/* Test cases builder */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                    Test Cases:
                  </span>
                  {testCases.map((tc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1 font-mono text-xs"
                    >
                      <span className="text-neon-green">&#10003;</span>
                      <span className="text-muted-foreground">
                        {tc.input || "(empty)"} &rarr; {tc.expectedOutput}
                      </span>
                      <button
                        onClick={() => removeTestCase(i)}
                        className="ml-auto text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Input"
                      className="flex-1 h-7 px-2 bg-background border-2 border-foreground/30 font-mono text-[10px] focus:border-electric outline-none"
                    />
                    <span className="text-muted-foreground font-mono text-[10px]">
                      &rarr;
                    </span>
                    <input
                      type="text"
                      value={testExpected}
                      onChange={(e) => setTestExpected(e.target.value)}
                      placeholder="Expected"
                      className="flex-1 h-7 px-2 bg-background border-2 border-foreground/30 font-mono text-[10px] focus:border-electric outline-none"
                    />
                    <Button
                      onClick={addTestCase}
                      variant="outline"
                      className="h-7 px-2 font-mono text-[10px] border-2 border-foreground bg-transparent"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleAddChallenge}
                  disabled={!title.trim() || !description.trim() || testCases.length === 0}
                  className="btn-brutal text-xs w-full"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Challenge for {selectedDate}
                </Button>
              </div>

              {/* Existing challenges list */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                  Today&apos;s Challenges ({todayChallenges.length}):
                </span>
                {todayChallenges.length === 0 && (
                  <p className="font-mono text-xs text-muted-foreground/50">
                    No challenges for today
                  </p>
                )}
                {todayChallenges.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 p-2 border-2 border-foreground/10 bg-card/50"
                  >
                    <span
                      className={`text-[10px] font-mono font-bold uppercase ${
                        c.difficulty === "easy"
                          ? "text-neon-green"
                          : c.difficulty === "medium"
                          ? "text-electric"
                          : "text-red-400"
                      }`}
                    >
                      {c.difficulty}
                    </span>
                    <span className="font-mono text-xs text-foreground truncate flex-1">
                      {c.title}
                    </span>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {upcomingChallenges.length > 0 && (
                  <>
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                      Upcoming ({upcomingChallenges.length}):
                    </span>
                    {upcomingChallenges.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-2 p-2 border-2 border-foreground/10 bg-card/50"
                      >
                        <EyeOff className="w-3 h-3 text-muted-foreground/50" />
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {c.scheduledDate}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold uppercase ${
                            c.difficulty === "easy"
                              ? "text-neon-green"
                              : c.difficulty === "medium"
                              ? "text-electric"
                              : "text-red-400"
                          }`}
                        >
                          {c.difficulty}
                        </span>
                        <span className="font-mono text-xs text-foreground truncate flex-1">
                          {c.title}
                        </span>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
