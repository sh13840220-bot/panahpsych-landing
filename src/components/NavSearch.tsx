import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  ArrowLeft,
  Brain,
  FileText,
  ClipboardCheck,
  Users,
  LayoutDashboard,
  BookOpen,
  Stethoscope,
  LogIn,
} from "lucide-react";

/* =========================================================
   TYPES
   ========================================================= */

interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: "آزمون‌ها" | "مقالات" | "خدمات" | "صفحات";
  path: string;
  tags?: string[];
}

/* =========================================================
   SEARCH INDEX
   ========================================================= */

export const SEARCH_INDEX: SearchItem[] = [
  {
    id: "dass-21",
    title: "تست افسردگی، اضطراب و استرس (DASS-21)",
    description: "سنجش سریع و معتبر ۳ بعد هیجانی اصلی روانشناختی",
    category: "آزمون‌ها",
    path: "/assessments/dass-21",
    tags: [
      "داس",
      "افسردگی",
      "اضطراب",
      "استرس",
      "تست",
      "روانشناسی",
    ],
  },

  {
    id: "gad-7",
    title: "غربالگری اضطراب فراگیر (GAD-7)",
    description:
      "ارزیابی میزان نگرانی، بی‌قراری و اضطراب تعمیم‌یافته",
    category: "آزمون‌ها",
    path: "/assessments/gad-7",
    tags: [
      "اضطراب",
      "نگرانی",
      "تست اضطراب",
      "روان سنجی",
    ],
  },

  {
    id: "bdi-ii",
    title: "ارزیابی افسردگی بک (BDI-II)",
    description:
      "سنجش دقیق و علمی شدت نشانه شناسی افسردگی",
    category: "آزمون‌ها",
    path: "/assessments/bdi-ii",
    tags: [
      "افسردگی",
      "بک",
      "تست افسردگی",
      "غم",
    ],
  },

  {
    id: "rosenberg",
    title: "مقیاس عزت نفس روزنبرگ (RSES)",
    description:
      "ارزیابی حس ارزشمندی، خودباوری و عزت نفس",
    category: "آزمون‌ها",
    path: "/assessments/rosenberg",
    tags: [
      "عزت نفس",
      "اعتماد به نفس",
      "ارزشمندی",
    ],
  },

  {
    id: "mbti",
    title: "شخصیت‌شناسی مایرز-بریگز (MBTI)",
    description:
      "شناخت ترجیحات شخصیتی و تیپ‌های ۱۶ گانه",
    category: "آزمون‌ها",
    path: "/assessments/mbti",
    tags: [
      "ام بی تی ای",
      "شخصیت",
      "تیپ شخصیتی",
      "mbti",
    ],
  },

  {
    id: "neo-ffi",
    title: "پنج عامل بزرگ شخصیت (NEO-FFI)",
    description:
      "تحلیل دقیق ابعاد ۵‌گانه روان‌رنجورخویی، برون‌گرایی و...",
    category: "آزمون‌ها",
    path: "/assessments/neo-ffi",
    tags: [
      "نئو",
      "پنج عامل",
      "شخصیت شناسی",
      "روان رنجوری",
    ],
  },

  {
    id: "article-cbt",
    title:
      "شناخت و درمان افکار منفی اتوماتیک (CBT)",
    description:
      "آشنایی با خطاهای شناختی و راهکارهای تغییر افکار ناکارآمد",
    category: "مقالات",
    path: "/articles-soon",
    tags: [
      "شناختی رفتاری",
      "cbt",
      "افکار منفی",
      "روانشناسی",
    ],
  },

  {
    id: "article-stress",
    title:
      "مدیریت استرس و تکنیک‌های آرام‌سازی",
    description:
      "راهکارهای عملی برای مواجهه با استرس روزمره و تنش روانی",
    category: "مقالات",
    path: "/articles-soon",
    tags: [
      "استرس",
      "آرام‌سازی",
      "مدیریت استرس",
      "ریلکسیشن",
    ],
  },

  {
    id: "article-mindfulness",
    title:
      "تکنیک‌های خودآگاهی و ذهن‌آگاهی (Mindfulness)",
    description:
      "تمرینات حضور در لحظه برای کاهش نوسانات خلقی و اضطراب",
    category: "مقالات",
    path: "/articles-soon",
    tags: [
      "مایندفولنس",
      "ذهن آگاهی",
      "خودآگاهی",
      "تمرکز",
    ],
  },

  {
    id: "article-self-esteem",
    title:
      "راهکارهای تقویت عزت‌نفس و شفقت به خود",
    description:
      "اصول خودباوری، پذیرش فردی و غلبه بر منتقد درونی",
    category: "مقالات",
    path: "/articles-soon",
    tags: [
      "عزت نفس",
      "اعتماد به نفس",
      "شفقت به خود",
    ],
  },

  {
    id: "all-assessments",
    title: "بانک آزمون‌های روانشناسی پناه",
    description:
      "مشاهده و شرکت در تمامی تست‌های معتبر روان‌سنجی آنلاین",
    category: "آزمون‌ها",
    path: "/assessments",
    tags: [
      "ارزیابی",
      "تست ها",
      "ازمون",
    ],
  },

  {
    id: "collaboration",
    title:
      "همکاری با ما (ویژه روانشناسان و متخصصان)",
    description:
      "فرصت‌های همکاری حرفه‌ای با پناه برای روانشناسان و مشاوران",
    category: "خدمات",
    path: "/collaboration",
    tags: [
      "همکاری",
      "روانشناس",
      "جذب",
      "مشاور",
      "رزومه",
    ],
  },

  {
    id: "psychologist-login",
    title: "ورود همکاران و روانشناسان",
    description:
      "ورود ویژه متخصصان و مشاوران به پنل اختصاصی",
    category: "خدمات",
    path: "/ravanshenas/login",
    tags: [
      "روانشناس",
      "پنل مشاور",
      "ورود همکاران",
    ],
  },

  {
    id: "auth",
    title: "ثبت‌نام و ورود کاربران",
    description:
      "ورود به حساب کاربری یا ایجاد حساب جدید در پناه",
    category: "صفحات",
    path: "/auth-soon",
    tags: [
      "ورود",
      "ثبت نام",
      "حساب کاربری",
      "لاگین",
    ],
  },

  {
    id: "articles",
    title: "بانک مقالات و مطالب آموزشی",
    description:
      "مطالعه جدیدترین مقالات روانشناسی، سلامت روان و خودشناسی",
    category: "صفحات",
    path: "/articles-soon",
    tags: [
      "مقاله",
      "بلاگ",
      "آموزش",
      "مطالب",
    ],
  },

  {
    id: "dashboard",
    title: "پنل کاربری و نتایج آزمون‌ها",
    description:
      "مشاهده سابقه ارزیابی‌ها و گزارش‌های تخصصی",
    category: "صفحات",
    path: "/dashboard",
    tags: [
      "پنل",
      "نتایج",
      "داشبورد",
    ],
  },
];

/* =========================================================
   CATEGORY CONFIG
   ========================================================= */

const CATEGORIES = [
  "همه",
  "آزمون‌ها",
  "مقالات",
  "خدمات",
  "صفحات",
] as const;

/* =========================================================
   ICON HELPER
   ========================================================= */

function getItemIcon(item: SearchItem) {
  switch (item.id) {
    case "dass-21":
    case "gad-7":
    case "bdi-ii":
    case "rosenberg":
    case "mbti":
    case "neo-ffi":
    case "all-assessments":
      return ClipboardCheck;

    case "article-cbt":
      return Brain;

    case "article-stress":
    case "article-mindfulness":
    case "article-self-esteem":
    case "articles":
      return BookOpen;

    case "collaboration":
      return Users;

    case "psychologist-login":
      return Stethoscope;

    case "auth":
      return LogIn;

    case "dashboard":
      return LayoutDashboard;

    default:
      return FileText;
  }
}

/* =========================================================
   TEXT NORMALIZATION
   ========================================================= */

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[يی]/g, "ی")
    .replace(/[كک]/g, "ک")
    .replace(/[\u200B-\u200D\uFEFF]/g, " ")
    .replace(/[^\w\sآ-ی0-9]/g, " ")
    .trim();
}

/* =========================================================
   LEVENSHTEIN DISTANCE
   ========================================================= */

function levenshteinDistance(
  a: string,
  b: string
): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] =
          matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/* =========================================================
   FUZZY TOKEN SCORE
   ========================================================= */

function fuzzyTokenScore(
  qToken: string,
  iToken: string
): number {
  if (!qToken || !iToken) return 0;

  if (iToken.includes(qToken)) {
    return 100;
  }

  if (qToken.includes(iToken)) {
    return 80;
  }

  const dist = levenshteinDistance(
    qToken,
    iToken
  );

  const maxLen = Math.max(
    qToken.length,
    iToken.length
  );

  if (maxLen === 0) return 0;

  const maxAllowedDist =
    qToken.length <= 3
      ? 1
      : qToken.length <= 6
      ? 2
      : 3;

  if (dist <= maxAllowedDist) {
    return Math.max(
      10,
      Math.round(
        (1 - dist / maxLen) * 90
      )
    );
  }

  return 0;
}

/* =========================================================
   ITEM FUZZY SCORE
   ========================================================= */

function getItemFuzzyScore(
  item: SearchItem,
  query: string
): number {
  const normQuery = normalizeText(
    query
  );

  if (!normQuery) return 0;

  const normTitle = normalizeText(
    item.title
  );

  const normDesc = normalizeText(
    item.description
  );

  const normTags = item.tags
    ? item.tags
        .map(normalizeText)
        .join(" ")
    : "";

  const fullText =
    `${normTitle} ${normDesc} ${normTags}`;

  /* Exact title match */
  if (normTitle.includes(normQuery)) {
    return 300;
  }

  /* Description / tags match */
  if (
    normDesc.includes(normQuery) ||
    normTags.includes(normQuery)
  ) {
    return 200;
  }

  const qTokens = normQuery
    .split(/\s+/)
    .filter(Boolean);

  const iTokens = fullText
    .split(/\s+/)
    .filter(Boolean);

  let totalScore = 0;
  let matchedTokens = 0;

  for (const qTok of qTokens) {
    let bestScore = 0;

    for (const iTok of iTokens) {
      const score = fuzzyTokenScore(
        qTok,
        iTok
      );

      if (score > bestScore) {
        bestScore = score;
      }
    }

    if (bestScore > 0) {
      matchedTokens++;
      totalScore += bestScore;
    }
  }

  if (
    matchedTokens >= qTokens.length
  ) {
    return totalScore;
  }

  return 0;
}

/* =========================================================
   RESULT LIST
   ========================================================= */

interface SearchResultsListProps {
  results: SearchItem[];
  selectedIndex: number;
  query: string;
  onSelectResult: (path: string) => void;
  onHoverResult: (index: number) => void;
}

export const SearchResultsList: React.FC<
  SearchResultsListProps
> = ({
  results,
  selectedIndex,
  query,
  onSelectResult,
  onHoverResult,
}) => {
  /* -------------------------------------------------------
     NO RESULTS
     ------------------------------------------------------- */

  if (results.length === 0) {
    return (
      <div
        className="
          px-6 py-10
          text-center
        "
      >
        <div
          className="
            mx-auto mb-4
            flex h-11 w-11
            items-center justify-center
            rounded-2xl
            border
          "
          style={{
            backgroundColor:
              "var(--icon-bg)",
            borderColor:
              "var(--border-glass)",
            color:
              "var(--color-primary)",
          }}
        >
          <Search
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        </div>

        <p
          className="
            text-sm font-semibold
          "
          style={{
            color:
              "var(--text-primary)",
          }}
        >
          نتیجه‌ای برای «{query}» پیدا نشد.
        </p>

        <p
          className="
            mt-1.5
            text-xs
          "
          style={{
            color:
              "var(--text-secondary)",
          }}
        >
          عبارت دیگری را امتحان کنید.
        </p>
      </div>
    );
  }

  /* -------------------------------------------------------
     RESULTS
     ------------------------------------------------------- */

  return (
    <div
      role="list"
      aria-label="نتایج جستجو"
      className="
        max-h-[360px]
        overflow-y-auto
        px-2.5
        py-2
      "
    >
      <div className="space-y-1">
        {results.map(
          (item, index) => {
            const isSelected =
              index === selectedIndex;

            const Icon =
              getItemIcon(item);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onSelectResult(
                    item.path
                  )
                }
                onMouseEnter={() =>
                  onHoverResult(index)
                }
                className="
                  group
                  flex w-full
                  items-center
                  gap-3
                  rounded-2xl
                  px-3 py-3
                  text-right
                  transition-all
                  duration-200
                  cursor-pointer
                "
                style={{
                  backgroundColor:
                    isSelected
                      ? "var(--icon-bg)"
                      : "transparent",
                }}
              >
                {/* ICON */}

                <div
                  className="
                    flex h-10 w-10
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    border
                    transition-all
                    duration-200
                  "
                  style={{
                    backgroundColor:
                      isSelected
                        ? "var(--color-primary)"
                        : "var(--icon-bg)",

                    borderColor:
                      "var(--border-glass)",

                    color:
                      isSelected
                        ? "var(--bg-main)"
                        : "var(--color-primary)",
                  }}
                >
                  <Icon
                    className="h-[18px] w-[18px]"
                    strokeWidth={1.8}
                  />
                </div>

                {/* TEXT */}

                <div className="min-w-0 flex-1">
                  <div
                    className="
                      truncate
                      text-[13px]
                      font-semibold
                    "
                    style={{
                      color:
                        "var(--text-primary)",
                    }}
                  >
                    {item.title}
                  </div>

                  <div
                    className="
                      mt-1
                      truncate
                      text-[11px]
                    "
                    style={{
                      color:
                        "var(--text-secondary)",
                    }}
                  >
                    {item.description}
                  </div>

                  <div
                    className="
                      mt-1.5
                      text-[10px]
                      font-medium
                    "
                    style={{
                      color:
                        "var(--color-accent-dark)",
                    }}
                  >
                    {item.category}
                  </div>
                </div>

                {/* ARROW */}

                <ArrowLeft
                  className={`
                    h-4 w-4
                    shrink-0
                    transition-all
                    duration-200
                    ${
                      isSelected
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                    }
                  `}
                  strokeWidth={1.8}
                  style={{
                    color:
                      "var(--color-accent-dark)",
                  }}
                />
              </button>
            );
          }
        )}
      </div>
    </div>
  );
};

/* =========================================================
   MAIN SEARCH COMPONENT
   ========================================================= */

export const NavSearch: React.FC = () => {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    activeCategory,
    setActiveCategory,
  ] = useState<string>("همه");

  const [
    selectedIndex,
    setSelectedIndex,
  ] = useState(0);

  const navigate = useNavigate();

  const inputRef =
    useRef<HTMLInputElement>(null);

  /* =======================================================
     GLOBAL KEYBOARD SHORTCUT
     ======================================================= */

  useEffect(() => {
    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      if (
        (e.metaKey ||
          e.ctrlKey) &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();

        setIsOpen((prev) => !prev);
      }

      if (
        e.key === "Escape" &&
        isOpen
      ) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen]);

  /* =======================================================
     OPEN / CLOSE EFFECTS
     ======================================================= */

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow =
        "hidden";

      const timeout =
        window.setTimeout(() => {
          inputRef.current?.focus();
        }, 80);

      return () => {
        window.clearTimeout(timeout);
      };
    }

    document.body.style.overflow = "";

    setQuery("");
    setActiveCategory("همه");
    setSelectedIndex(0);
  }, [isOpen]);

  /* =======================================================
     FILTER + FUZZY SEARCH
     ======================================================= */

  const filteredResults =
    useMemo(() => {
      if (!query.trim()) {
        return [];
      }

      return SEARCH_INDEX.map(
        (item) => {
          const matchesCategory =
            activeCategory === "همه" ||
            item.category ===
              activeCategory;

          if (!matchesCategory) {
            return {
              item,
              score: 0,
            };
          }

          return {
            item,
            score:
              getItemFuzzyScore(
                item,
                query
              ),
          };
        }
      )
        .filter(
          ({ score }) =>
            score > 0
        )
        .sort(
          (a, b) =>
            b.score - a.score
        )
        .map(
          ({ item }) => item
        );
    }, [
      query,
      activeCategory,
    ]);

  /* =======================================================
     SELECT RESULT
     ======================================================= */

  const handleSelectResult =
    useCallback(
      (path: string) => {
        setIsOpen(false);
        navigate(path);
      },
      [navigate]
    );

  /* =======================================================
     KEYBOARD NAVIGATION INSIDE SEARCH
     ======================================================= */

  const handleInputKeyDown = (
    e: React.KeyboardEvent
  ) => {
    if (!query.trim()) {
      return;
    }

    if (
      e.key === "ArrowDown"
    ) {
      e.preventDefault();

      setSelectedIndex(
        (prev) =>
          prev <
          filteredResults.length - 1
            ? prev + 1
            : 0
      );
    }

    if (
      e.key === "ArrowUp"
    ) {
      e.preventDefault();

      setSelectedIndex(
        (prev) =>
          prev > 0
            ? prev - 1
            : filteredResults.length -
              1
      );
    }

    if (
      e.key === "Enter" &&
      filteredResults[
        selectedIndex
      ]
    ) {
      e.preventDefault();

      handleSelectResult(
        filteredResults[
          selectedIndex
        ].path
      );
    }
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <>
      {/* ===================================================
          NAVBAR SEARCH BUTTON
          =================================================== */}

      <button
        type="button"
        onClick={() =>
          setIsOpen(true)
        }
        aria-label="جستجو در سایت"
        title="جستجو در سایت (Ctrl+K)"
        className="
          nav-search-btn
          group
          flex h-10 w-10
          shrink-0
          items-center justify-center
          rounded-full
          border
          bg-transparent
          transition-all
          duration-200
          cursor-pointer
        "
        style={{
          borderColor:
            "var(--border-glass)",
          color:
            "var(--text-primary)",
        }}
      >
        <Search
          className="
            h-[18px] w-[18px]
            transition-transform
            duration-200
            group-hover:scale-105
          "
          strokeWidth={1.8}
        />
      </button>

      {/* ===================================================
          SEARCH MODAL
          =================================================== */}

      {isOpen && (
        <div
          className="
            fixed inset-0
            z-[9999]
            flex items-start
            justify-center
            px-4
            pt-20
            sm:pt-28
          "
        >
          {/* =================================================
              BACKDROP
              ================================================= */}

          <button
            type="button"
            aria-label="بستن جستجو"
            onClick={() =>
              setIsOpen(false)
            }
            className="
              fixed inset-0
              cursor-default
              bg-black/35
              backdrop-blur-[6px]
            "
          />

          {/* =================================================
              SEARCH PANEL
              ================================================= */}

          <div
            dir="rtl"
            className="
              relative
              z-10
              w-full
              max-w-2xl
              overflow-hidden
              rounded-[24px]
              border
              shadow-[0_24px_80px_rgba(0,0,0,0.28)]
            "
            style={{
              backgroundColor:
                "var(--bg-card)",

              borderColor:
                "var(--border-glass)",

              color:
                "var(--text-primary)",
            }}
          >
            {/* =================================================
                INPUT ROW
                ================================================= */}

            <div
              className="
                flex
                items-center
                gap-3
                px-5
                py-4
              "
              style={{
                backgroundColor: "#E2E4DD",
              }}
            >
              {/* SEARCH ICON */}

              <div
                className="
                  flex
                  h-10 w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                "
                style={{
                  backgroundColor:
                    "var(--icon-bg)",

                  borderColor:
                    "var(--border-glass)",

                  color:
                    "var(--color-primary)",
                }}
              >
                <Search
                  className="h-5 w-5"
                  strokeWidth={1.8}
                />
              </div>

              {/* INPUT */}

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(
                    e.target.value
                  );

                  setSelectedIndex(0);
                }}
                onKeyDown={
                  handleInputKeyDown
                }
                autoComplete="off"
                spellCheck={false}
                placeholder="در پناه جستجو کنید..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-[15px]
                  font-medium
                  outline-none
                "
                style={{
                  color:
                    "var(--text-primary)",
                }}
              />

              {/* CLEAR */}

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSelectedIndex(0);

                    inputRef.current?.focus();
                  }}
                  aria-label="پاک کردن جستجو"
                  className="
                    flex
                    h-8 w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    transition-colors
                    cursor-pointer
                  "
                  style={{
                    color:
                      "var(--text-secondary)",
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* CLOSE */}

              <button
                type="button"
                onClick={() =>
                  setIsOpen(false)
                }
                aria-label="بستن"
                className="
                  flex
                  h-8 w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  transition-colors
                  cursor-pointer
                "
                style={{
                  borderColor:
                    "var(--border-glass)",

                  color:
                    "var(--text-secondary)",
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* =================================================
                ONLY SHOW THIS AREA WHEN USER HAS TYPED
                ================================================= */}

            {query.trim() && (
              <>
                {/* =================================================
                    CATEGORY FILTERS
                    ================================================= */}

                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    overflow-x-auto
                    border-t
                    px-4
                    py-2.5
                  "
                  style={{
                    borderColor:
                      "var(--border-glass)",
                  }}
                >
                  {CATEGORIES.map(
                    (category) => {
                      const isActive =
                        activeCategory ===
                        category;

                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            setActiveCategory(
                              category
                            );

                            setSelectedIndex(
                              0
                            );
                          }}
                          className="
                            shrink-0
                            rounded-full
                            px-3
                            py-1.5
                            text-[11px]
                            font-medium
                            transition-all
                            cursor-pointer
                          "
                          style={{
                            backgroundColor:
                              isActive
                                ? "var(--color-primary)"
                                : "transparent",

                            color:
                              isActive
                                ? "var(--bg-main)"
                                : "var(--text-secondary)",
                          }}
                        >
                          {category}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* =================================================
                    RESULTS
                    ================================================= */}

                <div
                  className="
                    border-t
                  "
                  style={{
                    borderColor:
                      "var(--border-glass)",
                  }}
                >
                  <SearchResultsList
                    results={
                      filteredResults
                    }
                    selectedIndex={
                      selectedIndex
                    }
                    query={query}
                    onSelectResult={
                      handleSelectResult
                    }
                    onHoverResult={(
                      index
                    ) =>
                      setSelectedIndex(
                        index
                      )
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};