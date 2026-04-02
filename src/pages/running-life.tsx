import { type MouseEvent, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import useActivities from '@/hooks/useActivities';

type LifeMonth = {
  id: number;
  key: string;
  color: string;
  distanceKm: number;
  year: number;
  month: number;
  future: boolean;
};

type MonthDetail = {
  year: number;
  month: number;
  distanceKm: number;
  runCount: number;
  durationLabel: string;
  avgPaceLabel: string;
};

type ModalOrigin = {
  xPercent: number;
  yPercent: number;
};

const BIRTH_DATE = new Date(1989, 0, 13);
const GRID_COLS = 24;
const GRID_ROWS = 43;
const GRID_TOTAL = GRID_COLS * GRID_ROWS;
const CELL_SIZE = 8;
const CELL_GAP = 10;
const CELL_RADIUS = 2;

const COLORS = {
  future: '#18181b',
  noData: '#27272a',
  level1: '#334155',
  level2: '#94a3b8',
  level3: '#facc15',
  level4: '#ef4444',
};

const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const getFullMonthsElapsed = (start: Date, end: Date) => {
  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  if (end.getDate() < start.getDate()) {
    months -= 1;
  }

  return Math.max(0, months);
};

const parseDurationSeconds = (value: string) => {
  const [hours, minutes, seconds] = value.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

const formatPace = (secondsPerKm: number) => {
  if (!Number.isFinite(secondsPerKm) || secondsPerKm <= 0) {
    return '--';
  }

  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}'${String(seconds).padStart(2, '0')}"`;
};

const MetricIcon = ({
  type,
}: {
  type: 'distance' | 'runs' | 'time' | 'pace';
}) => {
  const commonProps = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (type === 'distance') {
    return (
      <svg {...commonProps}>
        <path d="M3 12h4l2-6 4 12 2-6h6" />
      </svg>
    );
  }

  if (type === 'runs') {
    return (
      <svg {...commonProps}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <circle cx="12" cy="13" r="7" />
      <path d="M12 13l3-2" />
      <path d="M9 3h6" />
    </svg>
  );
};

const RunningLifePage = () => {
  const { activities } = useActivities();
  const [selectedMonth, setSelectedMonth] = useState<MonthDetail | null>(null);
  const [modalOrigin, setModalOrigin] = useState<ModalOrigin | null>(null);

  const firstRunMonth = useMemo(() => {
    if (activities.length === 0) {
      return new Date();
    }

    const sorted = [...activities].sort((a, b) =>
      a.start_date_local.localeCompare(b.start_date_local)
    );
    const first = new Date(sorted[0].start_date_local.replace(' ', 'T'));
    return new Date(first.getFullYear(), first.getMonth(), 1);
  }, [activities]);

  const lifeStartMonth = useMemo(
    () => new Date(BIRTH_DATE.getFullYear(), BIRTH_DATE.getMonth(), 1),
    []
  );

  const currentMonth = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, []);

  const today = useMemo(() => new Date(), []);

  const monthlyStats = useMemo(() => {
    const map: Record<
      string,
      { distanceKm: number; runCount: number; durationSeconds: number }
    > = {};

    activities.forEach((activity) => {
      const date = new Date(activity.start_date_local.replace(' ', 'T'));
      const key = formatDateKey(date);
      if (!map[key]) {
        map[key] = { distanceKm: 0, runCount: 0, durationSeconds: 0 };
      }

      map[key].distanceKm += activity.distance / 1000;
      map[key].runCount += 1;
      map[key].durationSeconds += parseDurationSeconds(activity.moving_time);
    });

    return map;
  }, [activities]);

  const completedLifeMonths = useMemo(
    () => getFullMonthsElapsed(BIRTH_DATE, today),
    [today]
  );

  const currentLifeMonth = completedLifeMonths + 1;
  const progress = ((currentLifeMonth / GRID_TOTAL) * 100).toFixed(1);

  const months = useMemo<LifeMonth[]>(() => {
    const result: LifeMonth[] = [];
    const cursor = new Date(lifeStartMonth);

    for (let index = 0; index < GRID_TOTAL; index += 1) {
      const year = cursor.getFullYear();
      const month = cursor.getMonth() + 1;
      const key = formatDateKey(cursor);
      const stat = monthlyStats[key];
      const future = cursor > currentMonth;
      const distanceKm = stat?.distanceKm ?? 0;

      let color = COLORS.noData;
      if (future) {
        color = COLORS.future;
      } else if (cursor < firstRunMonth) {
        color = COLORS.noData;
      } else if (distanceKm > 0) {
        if (distanceKm < 100) color = COLORS.level1;
        else if (distanceKm < 200) color = COLORS.level2;
        else if (distanceKm < 300) color = COLORS.level3;
        else color = COLORS.level4;
      }

      result.push({
        id: index,
        key,
        color,
        distanceKm,
        year,
        month,
        future,
      });

      cursor.setMonth(cursor.getMonth() + 1);
    }

    return result;
  }, [currentMonth, firstRunMonth, lifeStartMonth, monthlyStats]);

  const handleMonthClick = (
    month: LifeMonth,
    target: HTMLButtonElement | null
  ) => {
    if (month.future || month.distanceKm <= 0) return;
    const stat = monthlyStats[month.key];
    if (!stat) return;

    if (target) {
      const rect = target.getBoundingClientRect();
      setModalOrigin({
        xPercent: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
        yPercent: ((rect.top + rect.height / 2) / window.innerHeight) * 100,
      });
    }

    const secondsPerKm = stat.durationSeconds / stat.distanceKm;
    setSelectedMonth({
      year: month.year,
      month: month.month,
      distanceKm: stat.distanceKm,
      runCount: stat.runCount,
      durationLabel: formatDuration(stat.durationSeconds),
      avgPaceLabel: formatPace(secondsPerKm),
    });
  };

  const gridWidth = GRID_COLS * CELL_SIZE + (GRID_COLS - 1) * CELL_GAP;
  const gridHeight = GRID_ROWS * CELL_SIZE + (GRID_ROWS - 1) * CELL_GAP;
  const modalCardClass =
    'rounded-[20px] border border-white/5 bg-[#131316] px-5 py-4';

  return (
    <>
      <Helmet>
        <title>Running Life</title>
        <style>{`
          @keyframes runningLifeFadeSlide {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes runningLifeScaleIn {
            from {
              opacity: 0;
              transform: scale(0.72);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes runningLifeModalIn {
            from {
              opacity: 0;
              transform: translateY(18px) scale(0.72);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes runningLifeOverlayIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </Helmet>

      <div
        className={`min-h-screen bg-zinc-950 px-4 py-10 text-white transition-[filter,opacity,transform] duration-300 ease-out md:px-8 md:py-14 ${
          selectedMonth ? 'scale-[0.985] blur-[8px] opacity-35' : ''
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
          <div className="w-full overflow-x-auto pb-6">
            <div
              className="relative mx-auto"
              style={{
                width: `${gridWidth}px`,
                height: `${gridHeight}px`,
              }}
            >
              <div
                className="pointer-events-none absolute left-0 z-10 flex w-full flex-col items-center px-4 text-center"
                style={{
                  top: `${Math.round(gridHeight * 0.25)}px`,
                  transform: 'translateY(-50%)',
                  opacity: 0,
                  animation:
                    'runningLifeFadeSlide 0.9s cubic-bezier(0.22,1,0.36,1) 1.05s forwards',
                }}
              >
                <h1 className="mb-2 text-center text-3xl font-black uppercase tracking-tighter text-white/90 drop-shadow-lg md:text-5xl">
                  RUNNING
                  <span className="text-red-600">.Life</span>
                </h1>
                <p className="font-mono text-sm text-zinc-400 drop-shadow-md">
                  {currentLifeMonth}/{GRID_TOTAL} months
                  <span className="mx-2 text-zinc-500">·</span>
                  {progress}%
                </p>
              </div>

              <div
                className="pointer-events-none absolute left-0 z-10 flex w-full justify-center px-4"
                style={{
                  top: `${Math.round(gridHeight * 0.82)}px`,
                  transform: 'translateY(-50%)',
                  opacity: 0,
                  animation:
                    'runningLifeFadeSlide 0.7s cubic-bezier(0.22,1,0.36,1) 1.55s forwards',
                }}
              >
                <div className="flex flex-nowrap items-center justify-center gap-3 rounded-full border border-white/5 bg-black/40 px-4 py-2 backdrop-blur-sm">
                  {[
                    { label: '< 100 km', color: COLORS.level1 },
                    { label: '100 - 200 km', color: COLORS.level2 },
                    { label: '200 - 300 km', color: COLORS.level3 },
                    { label: '> 300 km', color: COLORS.level4 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="whitespace-nowrap text-[10px] font-medium text-zinc-300">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
                  gap: `${CELL_GAP}px`,
                }}
              >
                {months.map((month) => (
                  <button
                    key={month.id}
                    type="button"
                    onClick={(event: MouseEvent<HTMLButtonElement>) =>
                      handleMonthClick(month, event.currentTarget)
                    }
                    className="transition-transform duration-200 hover:scale-110 hover:ring-2 hover:ring-white/40 disabled:cursor-default disabled:hover:scale-100 disabled:hover:ring-0"
                    disabled={month.future || month.distanceKm <= 0}
                    title={`${month.year}-${String(month.month).padStart(2, '0')}: ${month.distanceKm.toFixed(1)} km`}
                    style={{
                      width: `${CELL_SIZE}px`,
                      height: `${CELL_SIZE}px`,
                      borderRadius: `${CELL_RADIUS}px`,
                      backgroundColor: month.color,
                      opacity: 0,
                      cursor:
                        month.future || month.distanceKm <= 0
                          ? 'default'
                          : 'pointer',
                      animation:
                        'runningLifeScaleIn 0.36s cubic-bezier(0.22,1,0.36,1) forwards',
                      animationDelay: `${Math.min(
                        Math.floor(month.id / GRID_COLS) * 0.045,
                        1.45
                      )}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {selectedMonth ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/28 p-4 backdrop-blur-[3px]"
            style={{
              animation:
                'runningLifeOverlayIn 0.2s cubic-bezier(0.22,1,0.36,1) forwards',
            }}
            onClick={() => {
              setSelectedMonth(null);
              setModalOrigin(null);
            }}
          >
            <div
              className="border-white/8 relative w-full max-w-[420px] overflow-hidden rounded-[28px] border bg-[#1a1a1d] p-6 shadow-2xl shadow-black/60"
              style={{
                animation:
                  'runningLifeModalIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
                transformOrigin: modalOrigin
                  ? `${modalOrigin.xPercent}% ${modalOrigin.yPercent}%`
                  : '50% 50%',
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="pointer-events-none absolute right-[-54px] top-[-82px] h-52 w-52 rounded-full bg-white/[0.03]" />
              <button
                type="button"
                onClick={() => {
                  setSelectedMonth(null);
                  setModalOrigin(null);
                }}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white"
                aria-label="Close monthly summary"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Monthly Summary
                </div>
                <h2 className="mt-2 text-[44px] font-black leading-none tracking-tighter text-white">
                  {selectedMonth.year}
                  <span className="text-zinc-400">
                    .{String(selectedMonth.month).padStart(2, '0')}
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={modalCardClass}>
                  <div className="mb-4 flex items-center gap-2.5 text-zinc-400">
                    <MetricIcon type="distance" />
                    <span className="text-xs font-medium">Distance</span>
                  </div>
                  <div className="text-[28px] font-black leading-none text-white">
                    {selectedMonth.distanceKm.toFixed(1)}
                    <span className="ml-2 text-sm font-medium text-zinc-500">
                      km
                    </span>
                  </div>
                </div>

                <div className={modalCardClass}>
                  <div className="mb-4 flex items-center gap-2.5 text-zinc-400">
                    <MetricIcon type="runs" />
                    <span className="text-xs font-medium">Runs</span>
                  </div>
                  <div className="text-[28px] font-black leading-none text-white">
                    {selectedMonth.runCount}
                  </div>
                </div>

                <div className={modalCardClass}>
                  <div className="mb-4 flex items-center gap-2.5 text-zinc-400">
                    <MetricIcon type="time" />
                    <span className="text-xs font-medium">Time</span>
                  </div>
                  <div className="text-[28px] font-black leading-none text-white">
                    {selectedMonth.durationLabel}
                  </div>
                </div>

                <div className={modalCardClass}>
                  <div className="mb-4 flex items-center gap-2.5 text-zinc-400">
                    <MetricIcon type="pace" />
                    <span className="text-xs font-medium">Avg Pace</span>
                  </div>
                  <div className="text-[28px] font-black leading-none text-white">
                    {selectedMonth.avgPaceLabel}
                    <span className="ml-2 text-sm font-medium text-zinc-500">
                      /km
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default RunningLifePage;
