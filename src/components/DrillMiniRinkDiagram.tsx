import type { Drill, DrillCategory } from '../types/models';

interface RouteStroke {
  d: string;
  stroke: 'red' | 'blue' | 'white';
  dashed?: boolean;
}

interface DrillMiniRinkDiagramProps {
  drill: Drill;
}

const DRILL_ROUTE_OVERRIDES: Partial<Record<Drill['id'], RouteStroke[]>> = {
  'drill-continuous-warmup-flow': [
    { d: 'M92 278 C170 228 198 178 258 104', stroke: 'blue' },
    { d: 'M258 104 C332 156 372 214 448 274', stroke: 'white', dashed: true },
    { d: 'M468 92 C416 150 382 192 332 266', stroke: 'red' },
  ],
  'drill-corner-battle-net-drive': [
    { d: 'M520 265 C465 242 422 236 356 234', stroke: 'red' },
    { d: 'M356 234 C284 230 246 206 186 156', stroke: 'blue' },
    { d: 'M186 156 C156 132 134 114 112 92', stroke: 'white', dashed: true },
  ],
  'drill-3-zone-passing-progression': [
    { d: 'M122 252 L232 176 L342 252 L452 176 L514 230', stroke: 'blue' },
    { d: 'M122 252 L514 230', stroke: 'white', dashed: true },
    { d: 'M342 252 L342 84', stroke: 'red', dashed: true },
  ],
  'drill-breakout-under-pressure': [
    { d: 'M96 286 L190 226 L266 162', stroke: 'blue' },
    { d: 'M266 162 L360 146 L504 92', stroke: 'white' },
    { d: 'M198 226 C228 198 244 164 246 122', stroke: 'red', dashed: true },
  ],
  'drill-small-area-2v2-support': [
    { d: 'M150 248 C230 214 268 186 310 136', stroke: 'blue' },
    { d: 'M310 136 C360 178 414 210 492 246', stroke: 'red' },
    { d: 'M166 168 L474 168', stroke: 'white', dashed: true },
  ],
  'drill-neutral-zone-regroup': [
    { d: 'M504 84 C444 124 402 156 356 202', stroke: 'blue' },
    { d: 'M356 202 C314 240 266 262 186 282', stroke: 'white' },
    { d: 'M186 282 C238 228 276 184 328 126', stroke: 'red', dashed: true },
  ],
  'drill-dzone-coverage-walkthrough': [
    { d: 'M120 110 C170 140 198 170 228 238', stroke: 'blue' },
    { d: 'M228 238 L320 238 L426 174', stroke: 'white' },
    { d: 'M426 174 C462 150 486 128 506 98', stroke: 'red', dashed: true },
  ],
  'drill-quick-release-shooting-lane': [
    { d: 'M130 250 C210 220 278 206 332 178', stroke: 'blue' },
    { d: 'M332 178 L446 178', stroke: 'red' },
    { d: 'M446 178 C468 198 486 228 500 258', stroke: 'white', dashed: true },
  ],
  'drill-retrieval-to-breakout': [
    { d: 'M92 284 C138 250 174 218 208 178', stroke: 'blue' },
    { d: 'M208 178 C260 152 314 144 398 152', stroke: 'white' },
    { d: 'M398 152 C442 146 476 126 510 94', stroke: 'red' },
  ],
  'drill-backcheck-pressure-race': [
    { d: 'M512 98 C466 136 430 172 388 226', stroke: 'red' },
    { d: 'M388 226 C334 242 284 240 232 214', stroke: 'blue' },
    { d: 'M232 214 C198 198 168 176 130 146', stroke: 'white', dashed: true },
  ],
  'drill-goalie-screen-tip': [
    { d: 'M124 248 C214 226 288 216 340 196', stroke: 'blue' },
    { d: 'M340 196 L448 196', stroke: 'white' },
    { d: 'M448 196 C468 214 486 234 506 262', stroke: 'red', dashed: true },
  ],
  'drill-full-ice-conditioning-relay': [
    { d: 'M98 278 C186 236 260 188 324 98', stroke: 'blue' },
    { d: 'M324 98 C378 186 448 230 516 272', stroke: 'red' },
    { d: 'M130 116 L512 116', stroke: 'white', dashed: true },
  ],
  'drill-power-play-half-wall-rotation': [
    { d: 'M500 102 C440 132 398 166 356 214', stroke: 'blue' },
    { d: 'M356 214 C326 246 292 254 238 252', stroke: 'white' },
    { d: 'M238 252 C286 214 330 166 378 112', stroke: 'red', dashed: true },
  ],
  'drill-cooldown-mobility-circle': [
    { d: 'M122 246 C198 230 264 230 330 246', stroke: 'white' },
    { d: 'M330 246 C394 230 458 230 520 246', stroke: 'blue' },
    { d: 'M164 118 C230 128 294 128 360 118', stroke: 'red', dashed: true },
  ],
};

function routesForCategory(category: DrillCategory): RouteStroke[] {
  switch (category) {
    case 'Warmup':
    case 'Skating':
      return [
        { d: 'M90 280 C170 220 185 165 265 104', stroke: 'blue' },
        { d: 'M270 105 C335 170 365 216 445 272', stroke: 'white' },
        { d: 'M470 90 C408 145 375 182 320 265', stroke: 'red', dashed: true },
      ];

    case 'Passing':
      return [
        { d: 'M120 255 L300 150 L500 245', stroke: 'blue' },
        { d: 'M120 255 L500 245', stroke: 'white', dashed: true },
        { d: 'M300 150 L300 70', stroke: 'red', dashed: true },
      ];

    case 'Shooting':
      return [
        { d: 'M130 252 C210 224 280 210 330 180', stroke: 'blue' },
        { d: 'M330 180 L450 180', stroke: 'red' },
        { d: 'M450 180 C470 200 485 225 500 258', stroke: 'white', dashed: true },
      ];

    case 'Breakout':
      return [
        { d: 'M88 285 L180 210 L265 162', stroke: 'blue' },
        { d: 'M264 162 L370 145 L505 86', stroke: 'white' },
        { d: 'M186 210 L230 96', stroke: 'red', dashed: true },
      ];

    case 'Forecheck':
    case 'Battle Drills':
      return [
        { d: 'M520 95 C440 135 380 175 330 248', stroke: 'red' },
        { d: 'M520 250 C455 235 395 220 328 248', stroke: 'blue' },
        { d: 'M120 210 C180 205 240 208 330 248', stroke: 'white', dashed: true },
      ];

    case 'Defensive Zone':
      return [
        { d: 'M120 95 C170 130 190 168 220 245', stroke: 'blue' },
        { d: 'M220 245 L320 245 L430 172', stroke: 'white' },
        { d: 'M430 172 C466 150 487 125 508 98', stroke: 'red', dashed: true },
      ];

    case 'Small Area Games':
    case 'Conditioning':
      return [
        { d: 'M135 245 C215 205 260 160 305 96', stroke: 'blue' },
        { d: 'M305 96 C365 164 425 205 505 246', stroke: 'red' },
        { d: 'M155 160 L465 160', stroke: 'white', dashed: true },
      ];

    case 'Goalie':
    case 'Power Play / Penalty Kill':
      return [
        { d: 'M110 262 C190 230 255 202 305 162', stroke: 'blue' },
        { d: 'M306 162 L454 162', stroke: 'white' },
        { d: 'M454 162 C478 182 495 215 508 252', stroke: 'red' },
      ];

    case 'Cooldown':
      return [
        { d: 'M112 250 C188 230 258 230 322 250', stroke: 'white' },
        { d: 'M322 250 C392 230 462 230 520 250', stroke: 'blue' },
        { d: 'M158 110 C230 125 286 125 355 110', stroke: 'red', dashed: true },
      ];

    default:
      return [
        { d: 'M90 270 L250 180 L430 180 L520 95', stroke: 'blue' },
        { d: 'M140 120 L300 185 L520 260', stroke: 'red', dashed: true },
      ];
  }
}

function markerId(stroke: RouteStroke['stroke']): string {
  return `diagram-arrow-${stroke}`;
}

function routesForDrill(drill: Drill): RouteStroke[] {
  const drillSpecificRoutes = DRILL_ROUTE_OVERRIDES[drill.id];
  if (drillSpecificRoutes) {
    return drillSpecificRoutes;
  }

  return routesForCategory(drill.category);
}

export function DrillMiniRinkDiagram({ drill }: DrillMiniRinkDiagramProps) {
  const routes = routesForDrill(drill);

  return (
    <figure className="drill-diagram">
      <svg viewBox="0 0 640 360" role="img" aria-label={`${drill.name} chalkboard diagram`}>
        <defs>
          <marker
            id="diagram-arrow-red"
            markerWidth="10"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L0,8 L8,4 z" fill="#dd6b6b" />
          </marker>
          <marker
            id="diagram-arrow-blue"
            markerWidth="10"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L0,8 L8,4 z" fill="#4a8acb" />
          </marker>
          <marker
            id="diagram-arrow-white"
            markerWidth="10"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L0,8 L8,4 z" fill="#eef5ff" />
          </marker>
        </defs>

        <rect x="8" y="8" width="624" height="344" rx="144" className="drill-diagram__rink" />
        <line x1="320" y1="20" x2="320" y2="340" className="drill-diagram__center-line" />
        <line x1="212" y1="20" x2="212" y2="340" className="drill-diagram__blue-line" />
        <line x1="428" y1="20" x2="428" y2="340" className="drill-diagram__blue-line" />
        <circle cx="320" cy="180" r="36" className="drill-diagram__center-circle" />
        <circle cx="160" cy="118" r="24" className="drill-diagram__faceoff-circle" />
        <circle cx="160" cy="242" r="24" className="drill-diagram__faceoff-circle" />
        <circle cx="480" cy="118" r="24" className="drill-diagram__faceoff-circle" />
        <circle cx="480" cy="242" r="24" className="drill-diagram__faceoff-circle" />

        {routes.map((route) => (
          <path
            key={route.d}
            d={route.d}
            className={`drill-diagram__route drill-diagram__route--${route.stroke}`}
            markerEnd={`url(#${markerId(route.stroke)})`}
            strokeDasharray={route.dashed ? '8 6' : undefined}
          />
        ))}
      </svg>

      <figcaption className="drill-diagram__caption">
        <span>Blue:</span> puck support route
        <span>Red:</span> pressure route
        <span>White:</span> timing/support lane
      </figcaption>
    </figure>
  );
}
