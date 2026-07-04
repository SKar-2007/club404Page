import { motion } from "framer-motion";
import { useMystery } from "@/hooks/use-mystery";
import MysteryChallengePanel from "./MysteryChallenge";
import MysteryEditor from "./MysteryEditor";

export default function MysteryOutput() {
  const {
    challenges,
    currentChallenge,
    currentIndex,
    html,
    css,
    js,
    activeTab,
    isRunning,
    showHint,
    userPreview,
    targetPreview,
    setHtml,
    setCss,
    setJs,
    setActiveTab,
    runCode,
    resetCode,
    submitCode,
    selectChallenge,
    nextChallenge,
    prevChallenge,
    toggleHint,
  } = useMystery();

  if (!currentChallenge) return null;

  return (
    <section id="mystery" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-28 h-28 bg-cyber-blue/5 border-2 border-cyber-blue/20 transform rotate-12"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-neon-green/5 border-2 border-neon-green/20 transform -rotate-45"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-32 bg-electric/10 transform rotate-45"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-4xl md:text-6xl mb-4 text-foreground cursor-default">
              Mystery <span className="text-cyber-blue">Output</span>
            </h2>
            <div className="terminal-block mb-4 text-left max-w-2xl mx-auto">
              <div className="text-neon-green">$ club404.mystery.init()</div>
            </div>
            <div className="divider-brutal max-w-xs mx-auto"></div>
            <p className="font-mono text-sm text-muted-foreground mt-4 max-w-xl mx-auto">
              Replicate the target animation using HTML, CSS, and JavaScript.
              Match it as closely as you can!
            </p>
          </div>
        </motion.div>

        {/* Challenge Selector */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {challenges.map((ch, i) => (
            <button
              key={ch.id}
              onClick={() => selectChallenge(i)}
              className={`font-mono text-xs px-3 py-1.5 border-2 transition-colors ${
                i === currentIndex
                  ? "border-cyber-blue text-cyber-blue bg-cyber-blue/10"
                  : "border-foreground/20 text-muted-foreground hover:border-foreground/40"
              }`}
            >
              {ch.title}
            </button>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <MysteryChallengePanel
            challenge={currentChallenge}
            targetPreview={targetPreview}
            showHint={showHint}
            onToggleHint={toggleHint}
          />

          <MysteryEditor
            html={html}
            css={css}
            js={js}
            activeTab={activeTab}
            isRunning={isRunning}
            userPreview={userPreview}
            currentIndex={currentIndex}
            totalChallenges={challenges.length}
            onHtmlChange={setHtml}
            onCssChange={setCss}
            onJsChange={setJs}
            onTabChange={setActiveTab}
            onRun={runCode}
            onReset={resetCode}
            onSubmit={submitCode}
            onPrev={prevChallenge}
            onNext={nextChallenge}
          />
        </div>
      </div>
    </section>
  );
}
