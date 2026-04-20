import { useState, useEffect, useRef } from "react"
import Editor from "@monaco-editor/react"
import { useGame } from "../context/useGame"
import { runCode } from "../services/piston"
import BattleHUD from "../ui/BattleHUD"
import ConfirmModal from "../ui/ConfirmModal"
import VictoryScreen from "../ui/VictoryScreen"

const normalizeOutput = (value) => (value || "").replace(/\r\n/g, "\n").trim()

const getLastNonEmptyLine = (value) => {
  const lines = normalizeOutput(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  return lines.length ? lines[lines.length - 1] : ""
}

export default function BattleScene() {
  const { scene, completeNode, setScene, nodeDrafts, updateNodeDraft, selectedLanguage, setSelectedLanguage, getBattleProgress, recordQuestionVictory } = useGame()
  const node = scene.node
  const nodeId = node?.key
  const questionBank = node?.practiceQuestions?.length
    ? node.practiceQuestions
    : [{ key: `${node?.key || "node"}-q1`, title: node?.title, mission: node?.mission, challenge: node?.challenge }]
  const [questionIndex, setQuestionIndex] = useState(0)
  const activeQuestion = questionBank[Math.min(questionIndex, Math.max(questionBank.length - 1, 0))]
  const challenge = activeQuestion?.challenge?.[selectedLanguage] || activeQuestion?.challenge?.java
  const mission = activeQuestion?.mission
  const nodeDraftsRef = useRef(nodeDrafts)

  const [code, setCode] = useState("")
  const [hp, setHp] = useState(100)
  const [log, setLog] = useState("⚠️ Ready for input.")
  const [showConfirm, setShowConfirm] = useState(false)
  const [isAttacking, setIsAttacking] = useState(false)
  const [isCleared, setIsCleared] = useState(false)
  const [successOutput, setSuccessOutput] = useState("")
  const [showVictory, setShowVictory] = useState(false)
  const [lastSavedLength, setLastSavedLength] = useState(0)

  useEffect(() => {
    setQuestionIndex(0)
  }, [nodeId])

  useEffect(() => {
    nodeDraftsRef.current = nodeDrafts
  }, [nodeDrafts])

  useEffect(() => {
    if (!challenge || !nodeId) return

    const draftKey = `${nodeId}:${selectedLanguage}:q${questionIndex + 1}`
    const draft = nodeDraftsRef.current[draftKey]
    const initialCode = typeof draft === "string" ? draft : challenge.starterCode

    setCode(initialCode)
    setLastSavedLength(initialCode.length)
    setIsCleared(false)
    setSuccessOutput("")
    setShowVictory(false)
  }, [challenge, nodeId, selectedLanguage, questionIndex])

  useEffect(() => {
    if (!nodeId) return
    const battle = getBattleProgress(nodeId, questionBank.length)
    setHp(battle.hp)
    setIsCleared(battle.defeated)
  }, [nodeId, questionBank.length, getBattleProgress])

  useEffect(() => {
    if (!nodeId) return

    const timeout = setTimeout(() => {
      updateNodeDraft(`${nodeId}:${selectedLanguage}:q${questionIndex + 1}`, code)
    }, 700)

    return () => clearTimeout(timeout)
  }, [code, nodeId, selectedLanguage, questionIndex, updateNodeDraft])

  const handleCodeChange = (value) => {
    const nextCode = value ?? ""
    setCode(nextCode)

    if (!nodeId) return

    if (Math.abs(nextCode.length - lastSavedLength) >= 5) {
      updateNodeDraft(`${nodeId}:${selectedLanguage}:q${questionIndex + 1}`, nextCode)
      setLastSavedLength(nextCode.length)
    }
  }

  const buildSubmissionCode = (language, userCode, harness) => {
    const trimmedUserCode = userCode.trimEnd()

    if (language === "java") {
      return `import java.util.*;\n\npublic class Main {\n${trimmedUserCode}\n\n${harness}\n}`
    }

    return `${trimmedUserCode}\n\n${harness}`
  }

  if (!node || !challenge) {
    return (
      <div className="h-screen w-screen bg-black text-white font-mono flex items-center justify-center p-6">
        <div className="max-w-xl w-full border border-red-900/60 bg-red-950/20 p-6 rounded-xl text-center">
          <h1 className="text-xl font-black text-red-500 uppercase mb-3">Mission Data Missing</h1>
          <p className="text-slate-300 mb-6">No combat problem was found for this node.</p>
          <button
            onClick={() => setScene({ type: "map" })}
            className="bg-red-700 hover:bg-red-600 px-5 py-3 rounded-lg font-black"
          >
            RETURN_TO_MAP
          </button>
        </div>
      </div>
    )
  }

  const attack = async () => {
    if (isAttacking) return
    setIsAttacking(true)
    setLog("📡 Connecting to remote compiler...")

    try {
      const testCases = challenge?.testCases?.length
        ? challenge.testCases
        : [{ harness: challenge.harness, expected: challenge.expected }]

      for (let caseIndex = 0; caseIndex < testCases.length; caseIndex += 1) {
        const testCase = testCases[caseIndex]
        const fullCode = buildSubmissionCode(selectedLanguage, code, testCase.harness)

        const execution = await runCode({
          language: selectedLanguage,
          code: fullCode
        })

        const stdout = normalizeOutput(execution.stdout)
        const stderr = normalizeOutput(execution.stderr)
        const expected = normalizeOutput(testCase.expected)
        const lastLine = getLastNonEmptyLine(stdout)
        const isMatch = stdout === expected || lastLine === expected

        if (!isMatch && stderr && !stdout) {
          setLog(`❌ RUNTIME ERROR (Case ${caseIndex + 1}/${testCases.length}): ${stderr.slice(0, 220)}`)
          return
        }

        if (!isMatch) {
          const observed = stdout || stderr || "NULL"
          setLog(`❌ REJECTED (Case ${caseIndex + 1}/${testCases.length}): Expected "${expected}", got "${observed}"`)
          return
        }
      }

      const result = recordQuestionVictory(node, activeQuestion.key, questionBank.length)

      if (result.alreadySolved) {
        setLog(`✅ Already solved Question ${questionIndex + 1}. Enemy HP remains at ${result.hp}%.`)
        setHp(result.hp)
        return
      }

      setHp(result.hp)

      if (result.nodeDefeated) {
        setSuccessOutput(`Enemy defeated after clearing ${result.solvedCount}/${questionBank.length} questions`)
        setIsCleared(true)
        setShowVictory(true)
        setLog(`🏁 ENEMY DEFEATED: Cleared all ${questionBank.length} questions. Sector secured.`)
        completeNode(node)
      } else {
        const damage = Math.round(100 / Math.max(questionBank.length, 1))
        setSuccessOutput(`Passed ${testCases.length}/${testCases.length} test cases`)
        setShowVictory(true)
        setLog(`✅ HIT CONFIRMED: Question ${questionIndex + 1} cleared. Damage ${damage}% dealt. Enemy HP now ${result.hp}%.`)
      }
    } catch (error) {
      setLog(`🛑 CONNECTION FAILED: ${error.message}`)
      console.error("BattleScene Attack Error:", error)
    } finally {
      setIsAttacking(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-black text-white font-mono flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <div className="h-16 border-b border-red-900/50 flex items-center justify-between px-6 bg-red-950/20 shrink-0">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${isAttacking ? 'bg-yellow-500 animate-ping' : 'bg-red-600'}`} />
          <h1 className="text-xl font-black tracking-tighter uppercase italic text-red-500">
            Page_{node.pageId} • Node_{node.slot}: {activeQuestion?.title || node.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-black border border-white/20 text-xs px-3 py-2 rounded-md text-white outline-none"
          >
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
          <button
            onClick={() => (isCleared ? setScene({ type: "map" }) : setShowConfirm(true))}
            className="text-[10px] border border-white/20 px-4 py-2 hover:bg-red-900 transition-colors"
          >
            {isCleared ? "[ MOVE NEXT ]" : "[ ABORT ]"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-1/3 border-r border-white/5 p-6 flex flex-col gap-6 bg-linear-to-b from-transparent to-red-950/10 overflow-y-auto">
          <section>
            <label className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-2 block">Practice Set</label>
            <div className="rounded-md border border-cyan-400/30 bg-black/50 p-3">
              <div className="flex items-center justify-between text-xs text-slate-200">
                <button
                  onClick={() => setQuestionIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={questionIndex === 0}
                  className={`px-2 py-1 border rounded ${questionIndex === 0 ? "border-slate-700 text-slate-600" : "border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/10"}`}
                >
                  Prev
                </button>
                <span className="font-bold tracking-wide">Question {questionIndex + 1} / {questionBank.length}</span>
                <button
                  onClick={() => setQuestionIndex((prev) => Math.min(prev + 1, questionBank.length - 1))}
                  disabled={questionIndex >= questionBank.length - 1}
                  className={`px-2 py-1 border rounded ${questionIndex >= questionBank.length - 1 ? "border-slate-700 text-slate-600" : "border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/10"}`}
                >
                  Next
                </button>
              </div>
            </div>
          </section>

          <section>
            <label className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-2 block">Mission Objective</label>
            <div className="text-gray-300 text-sm leading-relaxed p-4 bg-white/5 border-l-2 border-red-600 space-y-4">
              <div>
                <div className="text-red-300 text-[11px] uppercase tracking-widest font-bold mb-1">Problem</div>
                <p>{mission?.statement || "Solve the coding challenge."}</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="bg-black/50 border border-white/10 rounded-md p-3">
                  <div className="text-cyan-300 text-[10px] uppercase tracking-widest font-bold mb-1">Example Input</div>
                  <pre className="whitespace-pre-wrap text-slate-200 text-xs">{mission?.exampleInput || "N/A"}</pre>
                </div>

                <div className="bg-black/50 border border-white/10 rounded-md p-3">
                  <div className="text-emerald-300 text-[10px] uppercase tracking-widest font-bold mb-1">Example Output</div>
                  <pre className="whitespace-pre-wrap text-slate-200 text-xs">{mission?.exampleOutput || "N/A"}</pre>
                </div>

                <div className="bg-black/50 border border-white/10 rounded-md p-3">
                  <div className="text-yellow-300 text-[10px] uppercase tracking-widest font-bold mb-1">Explanation</div>
                  <p className="text-slate-200 text-xs leading-relaxed">{mission?.exampleExplanation || "N/A"}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-black/80 border border-white/10 p-5 rounded-sm shadow-xl">
             <BattleHUD name={`${node.title} • ${node.difficulty || "Challenge"}`} hp={hp} color="bg-red-600" />
          </section>

          <section className="flex-1 flex flex-col min-h-0">
            <div className="text-blue-500 text-[10px] mb-2 font-black uppercase tracking-tighter">{">"} Diagnostics</div>
            <div className="flex-1 p-4 bg-black border border-blue-900/20 text-blue-400 rounded-sm text-xs font-mono overflow-y-auto scrollbar-hide">
              {log}
              {isAttacking && <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-2" />}
            </div>
          </section>
        </div>

        {/* RIGHT PANEL: Editor */}
        <div className="w-2/3 flex flex-col bg-[#1e1e1e]">
          <div className="flex-1 relative">
            <Editor
              height="100%"
              theme="vs-dark"
              language={selectedLanguage}
              value={code}
              onChange={handleCodeChange}
              options={{ 
                fontSize: 16, 
                minimap: { enabled: false }, 
                automaticLayout: true,
                padding: { top: 20 },
                lineNumbers: "on"
              }}
            />
          </div>

          <button
            onClick={attack}
            disabled={isAttacking}
            className={`h-24 transition-all border-t-4 shrink-0 font-black italic text-2xl flex items-center justify-center gap-4 ${
              isAttacking ? 'bg-gray-800 border-gray-900 cursor-not-allowed' : 'bg-red-700 hover:bg-red-600 border-red-900'
            }`}
          >
            {isAttacking ? "SIGNAL_UPLOADING..." : isCleared ? "RECHECK_LOGIC" : "EXECUTE_LETHAL_LOGIC"}
          </button>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal onConfirm={() => setScene({ type: "map" })} onCancel={() => setShowConfirm(false)} />
      )}

      {showVictory && (
        <VictoryScreen
          title={isCleared ? "Enemy Defeated" : "Direct Hit"}
          message={isCleared
            ? `You defeated this enemy. ${successOutput}.`
            : `Question ${questionIndex + 1} cleared. ${successOutput}. Keep fighting to drop enemy HP to 0%.`}
          buttonText={isCleared ? "RETURN TO MAP" : "CONTINUE FIGHT"}
          onContinue={() => {
            if (isCleared) setScene({ type: "map" })
            else {
              const solvedQuestionKeys = getBattleProgress(nodeId, questionBank.length).solvedQuestionKeys || []
              const solvedSet = new Set(solvedQuestionKeys)

              let nextIndex = -1
              for (let offset = 1; offset <= questionBank.length; offset += 1) {
                const candidateIndex = (questionIndex + offset) % questionBank.length
                const candidate = questionBank[candidateIndex]
                if (candidate && !solvedSet.has(candidate.key)) {
                  nextIndex = candidateIndex
                  break
                }
              }

              if (nextIndex >= 0 && nextIndex !== questionIndex) {
                setQuestionIndex(nextIndex)
              } else {
                setQuestionIndex((prev) => Math.min(prev + 1, questionBank.length - 1))
              }

              setShowVictory(false)
            }
          }}
          onClose={() => setShowVictory(false)}
        />
      )}
    </div>
  )
}