import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Stars, Plus, X, MapPin, Clock, CheckCircle, RefreshCw } from "lucide-react";

type Stage = "proposal" | "captcha" | "booking" | "confirmed";

// ─── Captcha helpers ───────────────────────────────────────────────────────────
const EMOJI_POOL = ["🌸", "🍓", "🌈", "🦋", "⭐", "🍭", "🎀", "🌺", "🐝", "🍀", "🎵", "🌙"];
const CAPTCHA_CHALLENGES = [
  { target: "🦋", label: "butterflies" },
  { target: "⭐", label: "shooting stars" },
  { target: "🍭", label: "lollipops" },
  { target: "🎀", label: "cute bows" },
  { target: "🌸", label: "cherry blossoms" },
];

function makeCaptchaGrid(target: string) {
  const positions = new Set<number>();
  while (positions.size < 3) positions.add(Math.floor(Math.random() * 9));
  const others = EMOJI_POOL.filter((e) => e !== target);
  return Array.from({ length: 9 }, (_, i) =>
    positions.has(i) ? target : others[Math.floor(Math.random() * others.length)]
  );
}


// ─── Activities ────────────────────────────────────────────────────────────────
const PRESET_ACTIVITIES = [
  { id: "movie", label: "Movie Night", icon: "🎬" },
  { id: "dinner", label: "Dinner", icon: "🍽️" },
  { id: "coffee", label: "Coffee & Chat", icon: "☕" },
  { id: "park", label: "Park Walk", icon: "🌿" },
  { id: "amusement", label: "Amusement Park", icon: "🎡" },
  { id: "beach", label: "Beach Day", icon: "🏖️" },
  { id: "art", label: "Art Gallery", icon: "🎨" },
  { id: "karaoke", label: "Karaoke", icon: "🎤" },
  { id: "icecream", label: "Ice Cream", icon: "🍦" },
  { id: "bowling", label: "Bowling", icon: "🎳" },
  { id: "picnic", label: "Picnic", icon: "🧺" },
  { id: "stargazing", label: "Stargazing", icon: "🔭" },
];

// ─── Main component ────────────────────────────────────────────────────────────
export default function DateProposal() {
  const [stage, setStage] = useState<Stage>("proposal");
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const noPhrases = [
    "No 😔", "Not here!", "Catch me if you can!", "Please reconsider 🥺",
    "Last chance!", "I'm outta here!", "You're too slow!", "Nope!",
  ];

  const handleNoInteraction = () => {
    if (noCount >= 7) return;
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setNoPosition({
        x: (Math.random() - 0.5) * width * 0.6,
        y: (Math.random() - 0.5) * height * 0.6,
      });
      setNoCount((p) => p + 1);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #FFF0F3 0%, #FFE4E8 50%, #FFF0F3 100%)", backgroundSize: "200% 200%", animation: "gradient-shift 15s ease infinite" }}
    >
      <AmbientParticles />

      <AnimatePresence mode="wait">
        {stage === "proposal" && (
          <ProposalScene
            key="proposal"
            noCount={noCount}
            noPosition={noPosition}
            noPhrases={noPhrases}
            onYes={() => setStage("captcha")}
            onNo={handleNoInteraction}
          />
        )}
        {stage === "captcha" && (
          <CaptchaScene key="captcha" onPass={() => setStage("booking")} />
        )}
        {stage === "booking" && (
          <BookingScene key="booking" onConfirm={() => setStage("confirmed")} />
        )}
        {stage === "confirmed" && (
          <ConfirmedScene key="confirmed" />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Proposal scene ────────────────────────────────────────────────────────────
function ProposalScene({ noCount, noPosition, noPhrases, onYes, onNo }: {
  noCount: number;
  noPosition: { x: number; y: number };
  noPhrases: string[];
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="text-6xl md:text-8xl mb-6 select-none"
      >
        🐻
      </motion.div>
      <motion.h1
        className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-12 drop-shadow-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Date e Jaba?
      </motion.h1>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full h-[200px]">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <Button
            onClick={onYes}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-2xl px-12 py-8 rounded-full shadow-lg shadow-primary/30 animate-pulse border-none cursor-pointer"
            data-testid="button-yes"
          >
            Yes 🥰
          </Button>
        </motion.div>
        {noCount < 7 && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: noPosition.x, y: noPosition.y, opacity: 1, scale: Math.max(0.4, 1 - noCount * 0.1) }}
            transition={{ type: "spring", stiffness: 300, damping: 20, opacity: { delay: 0.8 } }}
            onHoverStart={onNo}
            onClick={onNo}
            className="absolute sm:relative"
            style={noCount > 0 ? { position: "absolute" } : {}}
          >
            <Button
              variant="secondary"
              size="lg"
              className="text-xl px-8 py-6 rounded-full shadow-md bg-secondary text-secondary-foreground hover:bg-secondary/80 border-none cursor-pointer"
              data-testid="button-no"
            >
              {noPhrases[Math.min(noCount, noPhrases.length - 1)]}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Captcha scene ─────────────────────────────────────────────────────────────
function CaptchaScene({ onPass }: { onPass: () => void }) {
  const challengeIndex = useRef(Math.floor(Math.random() * CAPTCHA_CHALLENGES.length));
  const challenge = CAPTCHA_CHALLENGES[challengeIndex.current];
  const [grid, setGrid] = useState(() => makeCaptchaGrid(challenge.target));
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [showHint, setShowHint] = useState(false);

  const refresh = () => {
    setGrid(makeCaptchaGrid(challenge.target));
    setSelected(new Set());
    setErrorMsg("");
  };

  const toggle = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const verify = () => {
    const correctPositions = grid.reduce<number[]>((acc, e, i) => {
      if (e === challenge.target) acc.push(i);
      return acc;
    }, []);
    const isCorrect =
      correctPositions.length === selected.size &&
      correctPositions.every((p) => selected.has(p));

    if (isCorrect) {
      onPass();
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= 2) {
      // Auto-pass with humour after 2 fails
      setTimeout(() => onPass(), 1800);
      setErrorMsg("Hmm... close enough! You're adorable anyway 🥺💕");
      return;
    }

    const msgs = [
      "Oops! Look more carefully 👀",
      "Not quite! You can do it 💪",
    ];
    setErrorMsg(msgs[Math.min(newAttempts - 1, msgs.length - 1)]);
    setShake(true);
    setTimeout(() => {
      setShake(false);
      refresh();
    }, 600);
    setShowHint(newAttempts >= 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 flex flex-col items-center text-center max-w-md w-full"
    >
      {/* Header */}
      <motion.div animate={{ rotate: [0, -5, 5, -5, 0] }} transition={{ delay: 0.5, duration: 0.6 }} className="text-5xl mb-4">
        🛡️
      </motion.div>
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-1">
        One quick thing...
      </h2>
      <p className="text-muted-foreground text-lg mb-6">
        Prove you're date-worthy! Select all the <strong>{challenge.label} {challenge.target}</strong>
      </p>
      {showHint && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-primary mb-3 italic">
          Hint: there are exactly 3 of them hiding in there!
        </motion.p>
      )}

      {/* Grid */}
      <motion.div
        animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-3 gap-3 mb-4"
      >
        {grid.map((emoji, i) => (
          <motion.button
            key={i}
            data-testid={`captcha-tile-${i}`}
            onClick={() => toggle(i)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            animate={selected.has(i) ? { scale: [1, 1.15, 1] } : {}}
            className={`w-20 h-20 text-4xl rounded-2xl border-2 transition-all duration-200 select-none flex items-center justify-center shadow-sm ${
              selected.has(i)
                ? "border-primary bg-primary/20 shadow-primary/30 shadow-md"
                : "border-border bg-white/70 hover:border-primary/50"
            }`}
          >
            {emoji}
          </motion.button>
        ))}
      </motion.div>

      {/* Error message */}
      <AnimatePresence mode="wait">
        {errorMsg && (
          <motion.p
            key={errorMsg}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-primary font-medium mb-3 text-sm"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={refresh}
          className="text-muted-foreground gap-1 rounded-full"
          data-testid="captcha-refresh"
        >
          <RefreshCw className="w-4 h-4" /> New puzzle
        </Button>
        <Button
          onClick={verify}
          className="bg-primary text-primary-foreground rounded-full px-8 shadow-md shadow-primary/30"
          data-testid="captcha-verify"
        >
          Verify 💝
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Booking scene ─────────────────────────────────────────────────────────────
function BookingScene({ onConfirm }: { onConfirm: () => void }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [placeQuery, setPlaceQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingPlace, setLoadingPlace] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set());
  const [customActivity, setCustomActivity] = useState("");
  const [customActivities, setCustomActivities] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Nominatim place search
  useEffect(() => {
    if (placeQuery.length < 3) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      setLoadingPlace(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeQuery)}&format=json&limit=6&addressdetails=1`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        setSuggestions(
          data.map((item: { display_name: string }) => {
            // Shorten long display names
            const parts = item.display_name.split(",");
            return parts.slice(0, 3).join(",").trim();
          })
        );
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingPlace(false);
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [placeQuery]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleActivity = useCallback((id: string) => {
    setSelectedActivities((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const addCustomActivity = () => {
    const trimmed = customActivity.trim();
    if (trimmed && !customActivities.includes(trimmed)) {
      setCustomActivities((prev) => [...prev, trimmed]);
      setSelectedActivities((prev) => new Set([...prev, `custom:${trimmed}`]));
      setCustomActivity("");
    }
  };

  const removeCustomActivity = (label: string) => {
    setCustomActivities((prev) => prev.filter((a) => a !== label));
    setSelectedActivities((prev) => {
      const next = new Set(prev);
      next.delete(`custom:${label}`);
      return next;
    });
  };

  const handleSubmit = () => {
    const errs: string[] = [];
    if (!selectedDate) errs.push("Pick a date for our date!");
    if (!selectedTime) errs.push("Pick a time for our date!");
    if (!selectedPlace) errs.push("Tell me where we're going!");
    if (selectedActivities.size === 0) errs.push("Choose at least one fun activity!");
    setErrors(errs);
    if (errs.length === 0) onConfirm();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 w-full max-w-lg"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="text-5xl mb-3">🗓️</motion.div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Plan Our Perfect Date</h2>
        <p className="text-muted-foreground mt-1">Let's make it unforgettable ✨</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-primary/10 border border-border p-6 space-y-6">

        {/* DATE & TIME */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
            <Clock className="w-4 h-4 text-primary" /> When are we going?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium pl-1">📅 Date</span>
              <input
                type="date"
                data-testid="input-date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary cursor-pointer [color-scheme:light]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium pl-1">🕐 Time</span>
              <input
                type="time"
                data-testid="input-time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary cursor-pointer [color-scheme:light]"
              />
            </div>
          </div>
        </motion.div>

        {/* PLACE */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="relative" ref={suggestionsRef}>
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
            <MapPin className="w-4 h-4 text-primary" /> Where are we going?
          </label>
          <div className="relative">
            <input
              type="text"
              data-testid="input-place"
              placeholder="Search a café, park, restaurant..."
              value={selectedPlace || placeQuery}
              onChange={(e) => {
                setSelectedPlace("");
                setPlaceQuery(e.target.value);
              }}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm pr-10"
            />
            {loadingPlace && (
              <div className="absolute right-3 top-3.5">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
            {selectedPlace && (
              <button
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                onClick={() => { setSelectedPlace(""); setPlaceQuery(""); setSuggestions([]); }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && !selectedPlace && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-border shadow-lg overflow-hidden"
              >
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    data-testid={`suggestion-${i}`}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-0 flex items-start gap-2"
                    onClick={() => { setSelectedPlace(s); setPlaceQuery(s); setShowSuggestions(false); }}
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{s}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ACTIVITIES */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
            <Sparkles className="w-4 h-4 text-primary" /> What should we do?
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_ACTIVITIES.map((act) => (
              <button
                key={act.id}
                data-testid={`activity-${act.id}`}
                onClick={() => toggleActivity(act.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  selectedActivities.has(act.id)
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-secondary/40 border-border hover:border-primary/50 hover:bg-secondary/60"
                }`}
              >
                <span>{act.icon}</span> {act.label}
              </button>
            ))}
            {customActivities.map((label) => (
              <button
                key={`custom:${label}`}
                data-testid={`activity-custom-${label}`}
                onClick={() => toggleActivity(`custom:${label}`)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  selectedActivities.has(`custom:${label}`)
                    ? "bg-accent text-accent-foreground border-accent/80 shadow-sm"
                    : "bg-secondary/40 border-border hover:border-accent/50"
                }`}
              >
                ✨ {label}
                <span
                  role="button"
                  className="ml-1 hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); removeCustomActivity(label); }}
                >
                  <X className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
          {/* Custom activity input */}
          <div className="flex gap-2">
            <input
              type="text"
              data-testid="input-custom-activity"
              placeholder="Add your own activity..."
              value={customActivity}
              onChange={(e) => setCustomActivity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomActivity()}
              className="flex-1 px-3 py-2 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
            <Button
              size="sm"
              onClick={addCustomActivity}
              disabled={!customActivity.trim()}
              className="rounded-xl bg-primary text-primary-foreground px-3"
              data-testid="button-add-activity"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* ERRORS */}
        <AnimatePresence>
          {errors.length > 0 && (
            <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-1">
              {errors.map((e) => (
                <li key={e} className="text-sm text-destructive flex items-center gap-1.5">
                  <span>•</span> {e}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* SUBMIT */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            className="w-full bg-primary text-primary-foreground rounded-2xl py-6 text-lg font-bold shadow-lg shadow-primary/30"
            onClick={handleSubmit}
            data-testid="button-book-date"
          >
            Book Our Date! 💌
          </Button>
        </motion.div>
      </div>
      <div className="mt-8 rounded-xl border border-pink-300/30 bg-white/10 p-4 text-center backdrop-blur-sm">
         <p className="text-sm italic text-pink-100">
          <span className="font-semibold not-italic">P.S.</span> I didn't get around
            to making the backend... I was a little too busy daydreaming about you. 💕
            So send me a screenshot of this page instead—I promise I'll pay attention to
            every little detail.
        </p>
      </div>
    </motion.div>

  );
}

// ─── Confirmed scene ───────────────────────────────────────────────────────────
function ConfirmedScene() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", type: "spring" }}
      className="relative z-10 flex flex-col items-center text-center max-w-lg w-full"
    >
      <Confetti />
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="text-7xl mb-6 select-none"
      >
        🎉
      </motion.div>
      <motion.h1
        className="font-serif text-4xl md:text-6xl font-bold text-primary mb-4 drop-shadow-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Yaayy cholo, It's a date! 💕
      </motion.h1>
      <motion.p
        className="text-xl md:text-2xl text-foreground/80 font-medium mb-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Get ready for the best date ever!
      </motion.p>
      <motion.p
        className="text-lg text-muted-foreground"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        I can't wait to spend this special time with you pookie 🐻❤️
      </motion.p>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 flex gap-3 text-5xl"
      >
        {["❤️", "🌸", "✨", "🌸", "❤️"].map((e, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
          >
            {e}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Ambient particles ─────────────────────────────────────────────────────────
function AmbientParticles() {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; size: number; delay: number; duration: number; type: number }>
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        delay: Math.random() * 8,
        duration: Math.random() * 10 + 15,
        type: Math.floor(Math.random() * 3),
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => {
        const Icon = p.type === 0 ? Heart : p.type === 1 ? Sparkles : Stars;
        return (
          <motion.div
            key={p.id}
            className="absolute text-primary/25"
            initial={{ x: `${p.x}vw`, y: "110vh", opacity: 0, rotate: 0, scale: p.size }}
            animate={{ y: "-10vh", opacity: [0, 1, 1, 0], rotate: 360 }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
          >
            <Icon className="w-7 h-7 fill-current" />
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Confetti ──────────────────────────────────────────────────────────────────
function Confetti() {
  const [pieces, setPieces] = useState<Array<{ id: number; x: number; color: string; delay: number; shape: number }>>([]);

  useEffect(() => {
    const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#9D4EDD", "#FF8FAB", "#FFB347"];
    setPieces(
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        shape: Math.floor(Math.random() * 3),
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
      {pieces.map((c) => (
        <motion.div
          key={c.id}
          className={c.shape === 0 ? "absolute w-3 h-3 rounded-full" : c.shape === 1 ? "absolute w-2 h-4 rounded-sm" : "absolute w-3 h-3 rotate-45"}
          style={{ backgroundColor: c.color, left: `${c.x}vw` }}
          initial={{ y: -20, opacity: 1, scale: 0 }}
          animate={{ y: "105vh", x: `${(Math.random() * 20 - 10)}vw`, opacity: [1, 1, 0], scale: [0, 1, 1], rotate: 720 }}
          transition={{ duration: Math.random() * 2 + 2, delay: c.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
