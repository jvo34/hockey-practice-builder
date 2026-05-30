import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { usePracticePlanner } from '../context/PracticePlannerContext';
import { formatDate } from '../utils/date';
import { getDurationDelta } from '../utils/practice';

const THEME_STORAGE_KEY = 'hockey-practice-builder.theme.v1';

const HOCKEY_VISUAL_ASSETS = {
  decorationSticks:
    'https://upload.wikimedia.org/wikipedia/commons/d/df/Canada_vs._Switzerland_ice_hockey_game_in_St_Moritz%2C_1928_or_1929_photo.jpg',
  decorationGoalie:
    'https://upload.wikimedia.org/wikipedia/commons/b/bd/Alaska_Anchorage_Seawolves_at_Wisconsin_Badgers_men%27s_ice_hockey_game_at_Kohl_Center_in_Madison%2C_Wisconsin_%28November_30%2C_2024%29_5135.jpg',
} as const;

type ThemeMode = 'ice' | 'arena' | 'heritage' | 'chalkboard';

const THEME_OPTIONS: Array<{ mode: ThemeMode; label: string; hint: string }> = [
  {
    mode: 'ice',
    label: 'Ice',
    hint: 'Bright rink daylight',
  },
  {
    mode: 'arena',
    label: 'Arena',
    hint: 'Dark scoreboard vibe',
  },
  {
    mode: 'heritage',
    label: 'Heritage',
    hint: 'Classic old-barn tones',
  },
  {
    mode: 'chalkboard',
    label: 'Chalkboard',
    hint: 'Coach whiteboard energy',
  },
];

function isThemeMode(value: string | null): value is ThemeMode {
  return THEME_OPTIONS.some((option) => option.mode === value);
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'ice';
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (isThemeMode(storedTheme)) {
    return storedTheme;
  }

  return 'ice';
}

function linkClassName({ isActive }: { isActive: boolean }) {
  return isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link';
}

export function AppLayout() {
  const { plans, drills } = usePracticePlanner();
  const location = useLocation();
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const selectedTheme = THEME_OPTIONS.find((option) => option.mode === theme) ?? THEME_OPTIONS[0];

  const onTargetPlans = plans.filter((plan) => getDurationDelta(plan) === 0).length;
  const overTargetPlans = plans.filter((plan) => getDurationDelta(plan) > 0).length;
  const underTargetPlans = plans.filter((plan) => getDurationDelta(plan) < 0).length;
  const totalScheduledDrills = plans.reduce((sum, plan) => sum + plan.drills.length, 0);

  const nextPractice = [...plans]
    .filter((plan) => !!plan.date)
    .sort((first, second) => first.date.localeCompare(second.date))[0];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <div className="site-decorations" aria-hidden="true">
        <img
          src={HOCKEY_VISUAL_ASSETS.decorationSticks}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/images/hockey-sticks.svg';
          }}
          className="site-decorations__asset site-decorations__asset--sticks"
        />
        <img
          src={HOCKEY_VISUAL_ASSETS.decorationGoalie}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/images/goalie-crease.svg';
          }}
          className="site-decorations__asset site-decorations__asset--crease"
        />
      </div>

      <header className="app-header">
        <div className="app-header__inner container">
          <div className="app-header__topline">
            <div className="app-header__intro">
              <p className="app-header__eyebrow">Hockey Practice Builder</p>
              <h1>Build Better Ice Sessions, Faster</h1>
              <p className="app-header__subhead">
                Plan every rep from warmup to cooldown with a coach-ready workflow.
              </p>
            </div>

            <div className="app-header__theme">
              <div className="theme-switcher" role="group" aria-label="Theme selector">
                <span className="theme-switcher__label">Themes</span>
                {THEME_OPTIONS.map((option) => (
                  <button
                    key={option.mode}
                    type="button"
                    className={`theme-chip theme-chip--${option.mode} ${theme === option.mode ? 'theme-chip--active' : ''}`}
                    onClick={() => setTheme(option.mode)}
                    aria-pressed={theme === option.mode}
                  >
                    {option.label}
                  </button>
                ))}
                <span className="theme-switcher__hint">{selectedTheme.hint}</span>
              </div>
            </div>
          </div>

          <div className="app-header__stats" aria-label="App summary">
            <div>
              <strong>{plans.length}</strong>
              <span>Saved plans</span>
            </div>
            <div>
              <strong>{drills.length}</strong>
              <span>Library drills</span>
            </div>
          </div>

          <div className="app-header__intel" aria-label="Practice readiness">
            <div>
              <strong>{onTargetPlans}</strong>
              <span>On target</span>
            </div>
            <div>
              <strong>{overTargetPlans}</strong>
              <span>Over schedule</span>
            </div>
            <div>
              <strong>{underTargetPlans}</strong>
              <span>Under schedule</span>
            </div>
            <div>
              <strong>{totalScheduledDrills}</strong>
              <span>Total scheduled drills</span>
            </div>
          </div>

          <p className="app-header__next">
            {nextPractice
              ? `Next skate: ${formatDate(nextPractice.date)} with ${nextPractice.team} (${nextPractice.focus}).`
              : 'No upcoming practice date set yet. Create your first session plan to get rolling.'}
          </p>

          <div className="app-header__controls">
            <nav className="app-nav" aria-label="Primary">
              <NavLink to="/" end className={linkClassName}>
                Dashboard
              </NavLink>
              <NavLink to="/library" className={linkClassName}>
                Drill Library
              </NavLink>
              <NavLink to="/smart-generator" className={linkClassName}>
                Smart Planner
              </NavLink>
              <NavLink to="/plans/new" className={linkClassName}>
                New Practice
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      <main className="container app-main">
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
