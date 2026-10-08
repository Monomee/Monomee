/**
 * SVG Card Generator for GitHub Profile
 * Retro Terminal / Game HUD / Pixel Cyber Aesthetic
 */

const PALETTE = {
  bg: "#0c0e12",
  panel: "#11161c",
  panelBorder: "#26313b",
  borderLight: "#354452",
  cyan: "#00e5ff",
  green: "#00ff9f",
  yellow: "#ffd166",
  red: "#ff6b6b",
  text: "#e8edf2",
  muted: "#7d8995",
  dim: "#495763",
  codeBg: "#090d12",
  codeBorder: "#1a2430",
};

/**
 * Common SVG Defs (filters, scanlines, clip-paths)
 */
function getSvgDefs() {
  return `
  <defs>
    <!-- Scanline pattern -->
    <pattern id="scanlines" width="100" height="4" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="100" y2="0" stroke="#000000" stroke-width="1.2" opacity="0.32" />
    </pattern>

    <!-- Subtle Dot Grid -->
    <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="0.75" fill="#26313b" opacity="0.5" />
    </pattern>

    <!-- Cyan Glow Filter -->
    <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Green Glow Filter -->
    <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Avatar Rounded Clip -->
    <clipPath id="avatar-clip">
      <rect x="36" y="72" width="128" height="128" rx="6" />
    </clipPath>
  </defs>
  `;
}

/**
 * Common Terminal Window Header
 */
function renderHeader(title, subtitle, statusText = "● ONLINE", statusColor = PALETTE.green) {
  return `
  <!-- Window Header Bar -->
  <path d="M 1 1 H 819 V 42 H 1 Z" fill="${PALETTE.panel}" />
  <line x1="1" y1="42" x2="819" y2="42" stroke="${PALETTE.panelBorder}" stroke-width="1" />

  <!-- Terminal Control Buttons -->
  <circle cx="28" cy="21" r="5" fill="${PALETTE.red}" />
  <circle cx="44" cy="21" r="5" fill="${PALETTE.yellow}" />
  <circle cx="60" cy="21" r="5" fill="${PALETTE.green}" />

  <!-- Title Text -->
  <text x="82" y="25" fill="${PALETTE.muted}" font-family="ui-monospace, 'Cascadia Code', monospace" font-size="12" font-weight="600" letter-spacing="1">${title}</text>
  ${subtitle ? `<text x="210" y="25" fill="${PALETTE.dim}" font-family="ui-monospace, monospace" font-size="11">${subtitle}</text>` : ""}

  <!-- Right Status Indicator -->
  <rect x="684" y="10" width="112" height="22" rx="4" fill="#091410" stroke="${statusColor}" stroke-width="0.8" />
  <circle cx="698" cy="21" r="4" fill="${statusColor}" filter="url(#glow-green)" />
  <text x="709" y="25" fill="${statusColor}" font-family="ui-monospace, monospace" font-size="11" font-weight="700" letter-spacing="0.8">${statusText}</text>
  `;
}

/**
 * Corner Tech Brackets (Game HUD Accent)
 */
function renderCornerBrackets(width, height) {
  return `
  <g stroke="${PALETTE.cyan}" stroke-width="1.5" fill="none" opacity="0.75">
    <path d="M 10 20 L 10 10 L 20 10" />
    <path d="M ${width - 20} 10 L ${width - 10} 10 L ${width - 10} 20" />
    <path d="M 10 ${height - 20} L 10 ${height - 10} L 20 ${height - 10}" />
    <path d="M ${width - 20} ${height - 10} L ${width - 10} ${height - 10} L ${width - 10} ${height - 20}" />
  </g>
  `;
}

/**
 * 1. HERO PROFILE CARD
 */
function renderHeroCard(data = {}) {
  const width = 820;
  const height = 360;

  const avatar = data.avatarBase64
    ? `<image href="${data.avatarBase64}" x="36" y="72" width="128" height="128" clip-path="url(#avatar-clip)" preserveAspectRatio="xMidYMid slice" />`
    : `
      <!-- Pixel Fallback Avatar HUD -->
      <rect x="36" y="72" width="128" height="128" rx="6" fill="#131c26" />
      <circle cx="100" cy="116" r="28" fill="${PALETTE.cyan}" fill-opacity="0.3" stroke="${PALETTE.cyan}" stroke-width="1.5" />
      <path d="M 64 182 C 64 152 136 152 136 182 Z" fill="${PALETTE.cyan}" fill-opacity="0.25" stroke="${PALETTE.cyan}" stroke-width="1.5" />
      <text x="100" y="122" text-anchor="middle" fill="${PALETTE.cyan}" font-family="monospace" font-size="16" font-weight="bold">MN</text>
    `;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="${height}" role="img" aria-label="Nguyen Viet Hoang Game Developer Profile">
  ${getSvgDefs()}

  <!-- Card Background -->
  <rect width="${width}" height="${height}" rx="8" fill="${PALETTE.bg}" stroke="${PALETTE.panelBorder}" stroke-width="1.2" />
  
  <!-- Subtle Grid Background -->
  <rect width="${width}" height="${height}" rx="8" fill="url(#dot-grid)" pointer-events="none" />

  ${renderHeader("MONOME.exe", "// DEV_PROFILE_INITIALIZED", "● ONLINE", PALETTE.green)}

  <!-- Left: Avatar Viewfinder Frame -->
  <g id="avatar-frame">
    <rect x="28" y="64" width="144" height="144" rx="6" fill="${PALETTE.panel}" stroke="${PALETTE.panelBorder}" stroke-width="1.2" />
    
    <!-- Viewfinder Tech Corners -->
    <path d="M 32 74 L 32 68 L 38 68" stroke="${PALETTE.cyan}" stroke-width="2" fill="none" />
    <path d="M 168 74 L 168 68 L 162 68" stroke="${PALETTE.cyan}" stroke-width="2" fill="none" />
    <path d="M 32 198 L 32 204 L 38 204" stroke="${PALETTE.cyan}" stroke-width="2" fill="none" />
    <path d="M 168 198 L 168 204 L 162 204" stroke="${PALETTE.cyan}" stroke-width="2" fill="none" />

    ${avatar}

    <!-- ID Tag under avatar -->
    <rect x="28" y="218" width="144" height="26" rx="4" fill="${PALETTE.codeBg}" stroke="${PALETTE.codeBorder}" stroke-width="1" />
    <text x="100" y="235" text-anchor="middle" fill="${PALETTE.cyan}" font-family="ui-monospace, monospace" font-size="11" font-weight="700" letter-spacing="1">ID: MONOME // 08</text>

    <!-- Metadata lines -->
    <text x="100" y="262" text-anchor="middle" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="10">PIPELINE: ACTIVE</text>
    <text x="100" y="280" text-anchor="middle" fill="${PALETTE.dim}" font-family="ui-monospace, monospace" font-size="10">LOC: VIETNAM (UTC+7)</text>
    <text x="100" y="322" text-anchor="middle" fill="${PALETTE.yellow}" font-family="ui-monospace, monospace" font-size="11" font-weight="600">[ READY ]</text>
  </g>

  <!-- Right: Identity & Readout -->
  <g id="identity">
    <!-- Full Name -->
    <text x="194" y="92" fill="${PALETTE.text}" font-family="ui-monospace, 'Cascadia Code', monospace" font-size="25" font-weight="800" letter-spacing="1.2">NGUYEN VIET HOANG</text>

    <!-- Role and Core Stack Badges -->
    <rect x="194" y="104" width="148" height="22" rx="3" fill="${PALETTE.cyan}" fill-opacity="0.12" stroke="${PALETTE.cyan}" stroke-width="0.8" />
    <text x="202" y="119" fill="${PALETTE.cyan}" font-family="ui-monospace, monospace" font-size="11" font-weight="700" letter-spacing="1">GAME DEVELOPER</text>
    <text x="354" y="119" fill="${PALETTE.yellow}" font-family="ui-monospace, monospace" font-size="12" font-weight="600">◆ UNITY · C#</text>
    <text x="466" y="119" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="12">// GAMEPLAY &amp; SYSTEMS</text>

    <!-- Terminal Console Log Box -->
    <rect x="194" y="136" width="598" height="88" rx="4" fill="${PALETTE.codeBg}" stroke="${PALETTE.codeBorder}" stroke-width="1" />
    <text x="210" y="158" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="11.5">&gt; initializing developer_profile...</text>
    <text x="456" y="158" fill="${PALETTE.green}" font-family="ui-monospace, monospace" font-size="11" font-weight="700">[OK]</text>

    <text x="210" y="179" fill="${PALETTE.text}" font-family="ui-monospace, monospace" font-size="11.5">&gt; mission: Building gameplay systems, performance &amp; engaging experiences</text>
    
    <text x="210" y="200" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="11.5">&gt; telemetry: GitHub connected · Unity 6.x pipeline · systems stable</text>
    <!-- Tech Cursor -->
    <rect x="664" y="189" width="7" height="13" fill="${PALETTE.cyan}" opacity="0.85" />

    <!-- Game HUD Attributes Grid (4 chips) -->
    <!-- Chip 1: CLASS -->
    <g transform="translate(194, 236)">
      <rect width="142" height="56" rx="4" fill="${PALETTE.panel}" stroke="${PALETTE.panelBorder}" stroke-width="1" />
      <text x="14" y="20" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="10" font-weight="600" letter-spacing="1">CLASS</text>
      <text x="14" y="42" fill="${PALETTE.text}" font-family="ui-monospace, monospace" font-size="12" font-weight="700">GAMEPLAY ENG</text>
    </g>

    <!-- Chip 2: ENGINE -->
    <g transform="translate(346, 236)">
      <rect width="142" height="56" rx="4" fill="${PALETTE.panel}" stroke="${PALETTE.panelBorder}" stroke-width="1" />
      <text x="14" y="20" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="10" font-weight="600" letter-spacing="1">ENGINE</text>
      <text x="14" y="42" fill="${PALETTE.cyan}" font-family="ui-monospace, monospace" font-size="12" font-weight="700">UNITY (2D/3D)</text>
    </g>

    <!-- Chip 3: CORE LANGUAGE -->
    <g transform="translate(498, 236)">
      <rect width="142" height="56" rx="4" fill="${PALETTE.panel}" stroke="${PALETTE.panelBorder}" stroke-width="1" />
      <text x="14" y="20" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="10" font-weight="600" letter-spacing="1">LANGUAGE</text>
      <text x="14" y="42" fill="${PALETTE.yellow}" font-family="ui-monospace, monospace" font-size="12" font-weight="700">C# (.NET)</text>
    </g>

    <!-- Chip 4: STATUS -->
    <g transform="translate(650, 236)">
      <rect width="142" height="56" rx="4" fill="${PALETTE.panel}" stroke="${PALETTE.panelBorder}" stroke-width="1" />
      <text x="14" y="20" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="10" font-weight="600" letter-spacing="1">STATUS</text>
      <text x="14" y="42" fill="${PALETTE.green}" font-family="ui-monospace, monospace" font-size="12" font-weight="700">BUILDING</text>
    </g>

    <!-- Bottom Status Line -->
    <line x1="194" y1="308" x2="792" y2="308" stroke="${PALETTE.codeBorder}" stroke-dasharray="3 3" />
    <text x="194" y="328" fill="${PALETTE.dim}" font-family="ui-monospace, monospace" font-size="10.5">CORE: GAMEPLAY ARCHITECTURE · OPTIMIZATION · SHADERS · TOOLS</text>
    <text x="792" y="328" text-anchor="end" fill="${PALETTE.cyan}" font-family="ui-monospace, monospace" font-size="10.5">[ READY_TO_DEPLOY ]</text>
  </g>

  <!-- CRT Scanlines Overlay -->
  <rect width="${width}" height="${height}" rx="8" fill="url(#scanlines)" pointer-events="none" />

  ${renderCornerBrackets(width, height)}
</svg>`;
}

/**
 * 2. GITHUB TELEMETRY CARD
 */
function renderTelemetryCard(data = {}) {
  const width = 820;
  const height = 240;

  const publicRepos = data.publicRepos ?? 33;
  const stars = data.stars ?? 4;
  const followers = data.followers ?? 2;
  const eventsCount = data.recentEventsCount ?? 14;

  // Generate 26 visual telemetry blocks
  const blockCount = 26;
  const blockWidth = 26;
  const blockHeight = 15;
  const blockGap = 3.5;
  const startX = 44;
  const startY = 168;

  let blocksSvg = "";
  for (let i = 0; i < blockCount; i++) {
    const x = startX + i * (blockWidth + blockGap);
    // Determine block intensity
    let color = PALETTE.codeBorder;
    let opacity = 0.45;
    if (i < 18) {
      if (i % 5 === 0) {
        color = PALETTE.cyan;
        opacity = 0.9;
      } else if (i % 3 === 0) {
        color = PALETTE.green;
        opacity = 0.95;
      } else if (i === 14) {
        color = PALETTE.yellow;
        opacity = 0.9;
      } else {
        color = PALETTE.green;
        opacity = 0.65;
      }
    } else if (i < 22) {
      color = PALETTE.cyan;
      opacity = 0.5;
    }
    blocksSvg += `<rect x="${x.toFixed(1)}" y="${startY}" width="${blockWidth}" height="${blockHeight}" rx="2" fill="${color}" fill-opacity="${opacity}" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="${height}" role="img" aria-label="GitHub Telemetry and Statistics">
  ${getSvgDefs()}

  <!-- Card Background -->
  <rect width="${width}" height="${height}" rx="8" fill="${PALETTE.bg}" stroke="${PALETTE.panelBorder}" stroke-width="1.2" />
  <rect width="${width}" height="${height}" rx="8" fill="url(#dot-grid)" pointer-events="none" />

  ${renderHeader("TERMINAL://GITHUB_TELEMETRY.sys", "// LIVE_TELEMETRY", "● LIVE DATA", PALETTE.green)}

  <!-- Metrics Row (4 modules) -->
  <!-- Box 1: Repositories -->
  <g transform="translate(28, 56)">
    <rect width="180" height="66" rx="4" fill="${PALETTE.panel}" stroke="${PALETTE.panelBorder}" stroke-width="1" />
    <text x="16" y="22" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="10" font-weight="600" letter-spacing="1">REPOSITORIES</text>
    <text x="16" y="49" fill="${PALETTE.cyan}" font-family="ui-monospace, monospace" font-size="24" font-weight="800">${publicRepos}</text>
    <text x="74" y="47" fill="${PALETTE.dim}" font-family="ui-monospace, monospace" font-size="10">PUBLIC REPOS</text>
  </g>

  <!-- Box 2: Total Stars -->
  <g transform="translate(222, 56)">
    <rect width="180" height="66" rx="4" fill="${PALETTE.panel}" stroke="${PALETTE.panelBorder}" stroke-width="1" />
    <text x="16" y="22" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="10" font-weight="600" letter-spacing="1">TOTAL STARS</text>
    <text x="16" y="49" fill="${PALETTE.yellow}" font-family="ui-monospace, monospace" font-size="24" font-weight="800">${stars}</text>
    <text x="74" y="47" fill="${PALETTE.dim}" font-family="ui-monospace, monospace" font-size="10">STARS EARNED</text>
  </g>

  <!-- Box 3: Followers -->
  <g transform="translate(416, 56)">
    <rect width="180" height="66" rx="4" fill="${PALETTE.panel}" stroke="${PALETTE.panelBorder}" stroke-width="1" />
    <text x="16" y="22" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="10" font-weight="600" letter-spacing="1">FOLLOWERS</text>
    <text x="16" y="49" fill="${PALETTE.green}" font-family="ui-monospace, monospace" font-size="24" font-weight="800">${followers}</text>
    <text x="74" y="47" fill="${PALETTE.dim}" font-family="ui-monospace, monospace" font-size="10">DEV NETWORK</text>
  </g>

  <!-- Box 4: Stack Focus -->
  <g transform="translate(610, 56)">
    <rect width="182" height="66" rx="4" fill="${PALETTE.panel}" stroke="${PALETTE.panelBorder}" stroke-width="1" />
    <text x="16" y="22" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="10" font-weight="600" letter-spacing="1">PRIMARY TECH</text>
    <text x="16" y="49" fill="${PALETTE.text}" font-family="ui-monospace, monospace" font-size="19" font-weight="800">C# / UNITY</text>
    <text x="122" y="47" fill="${PALETTE.dim}" font-family="ui-monospace, monospace" font-size="10">CORE</text>
  </g>

  <!-- Activity Telemetry Readout Box -->
  <g id="activity-telemetry">
    <rect x="28" y="134" width="764" height="88" rx="4" fill="${PALETTE.codeBg}" stroke="${PALETTE.codeBorder}" stroke-width="1" />
    
    <!-- Title Line -->
    <text x="44" y="154" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="10.5" font-weight="700" letter-spacing="1">ACTIVITY MATRIX</text>
    <text x="175" y="154" fill="${PALETTE.dim}" font-family="ui-monospace, monospace" font-size="10">// COMMITS, PRS &amp; TELEMETRY FREQUENCY</text>
    <text x="774" y="154" text-anchor="end" fill="${PALETTE.green}" font-family="ui-monospace, monospace" font-size="10.5" font-weight="700">PIPELINE: NORMAL</text>

    <!-- Render Blocks -->
    ${blocksSvg}

    <!-- Status Text line below blocks -->
    <text x="44" y="206" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="11">&gt; telemetry_sync: ${eventsCount} active events detected in telemetry window</text>
    <text x="774" y="206" text-anchor="end" fill="${PALETTE.cyan}" font-family="ui-monospace, monospace" font-size="11" font-weight="600">[ CAPACITY: 88% ]</text>
  </g>

  <!-- CRT Scanlines Overlay -->
  <rect width="${width}" height="${height}" rx="8" fill="url(#scanlines)" pointer-events="none" />

  ${renderCornerBrackets(width, height)}
</svg>`;
}

/**
 * 3. FEATURED PROJECT CARD (MIXIE EMPIRE: BOBA & ICE CREAM)
 */
function renderProjectCard() {
  const width = 820;
  const height = 230;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="${height}" role="img" aria-label="Featured Game Project: Mixie Empire Boba and Ice Cream">
  ${getSvgDefs()}

  <!-- Card Background -->
  <rect width="${width}" height="${height}" rx="8" fill="${PALETTE.bg}" stroke="${PALETTE.panelBorder}" stroke-width="1.2" />
  <rect width="${width}" height="${height}" rx="8" fill="url(#dot-grid)" pointer-events="none" />

  ${renderHeader("PROJECT_ARCHIVE // 01_FEATURED_RELEASE", "// GAME_SPOTLIGHT", "● RELEASED", PALETTE.yellow)}

  <!-- Left: Game Terminal Hologram Box -->
  <g transform="translate(28, 56)">
    <rect width="144" height="152" rx="6" fill="${PALETTE.panel}" stroke="${PALETTE.panelBorder}" stroke-width="1.2" />
    
    <!-- Viewfinder Tech Corners -->
    <path d="M 4 10 L 4 4 L 10 4" stroke="${PALETTE.yellow}" stroke-width="2" fill="none" />
    <path d="M 140 10 L 140 4 L 134 4" stroke="${PALETTE.yellow}" stroke-width="2" fill="none" />
    <path d="M 4 142 L 4 148 L 10 148" stroke="${PALETTE.yellow}" stroke-width="2" fill="none" />
    <path d="M 140 142 L 140 148 L 134 148" stroke="${PALETTE.yellow}" stroke-width="2" fill="none" />

    <!-- Gamepad Vector Icon -->
    <g transform="translate(36, 26)" stroke="${PALETTE.cyan}" stroke-width="1.8" fill="none">
      <rect x="0" y="8" width="72" height="42" rx="14" fill="#0d141e" />
      <!-- D-Pad -->
      <path d="M 16 29 H 28 M 22 23 V 35" stroke="${PALETTE.cyan}" stroke-width="2.5" stroke-linecap="round" />
      <!-- Action Buttons -->
      <circle cx="50" cy="24" r="2.2" fill="${PALETTE.yellow}" stroke="none" />
      <circle cx="58" cy="29" r="2.2" fill="${PALETTE.red}" stroke="none" />
      <circle cx="44" cy="31" r="2.2" fill="${PALETTE.green}" stroke="none" />
      <circle cx="52" cy="36" r="2.2" fill="${PALETTE.cyan}" stroke="none" />
    </g>

    <!-- Genre & Tags -->
    <text x="72" y="98" text-anchor="middle" fill="${PALETTE.yellow}" font-family="ui-monospace, monospace" font-size="11" font-weight="700">TYCOON / SIM</text>
    <text x="72" y="118" text-anchor="middle" fill="${PALETTE.cyan}" font-family="ui-monospace, monospace" font-size="10" font-weight="600">UNITY 2D/3D</text>
    <text x="72" y="136" text-anchor="middle" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="9.5">ITCH.IO LIVE</text>
  </g>

  <!-- Right: Project Description & Specs -->
  <g transform="translate(192, 56)">
    <!-- Subtitle Tag -->
    <text x="0" y="16" fill="${PALETTE.cyan}" font-family="ui-monospace, monospace" font-size="10.5" font-weight="700" letter-spacing="1.5">FEATURED GAME PROJECT</text>

    <!-- Game Title -->
    <text x="0" y="44" fill="${PALETTE.text}" font-family="ui-monospace, 'Cascadia Code', monospace" font-size="22" font-weight="800" letter-spacing="1">MIXIE EMPIRE: BOBA &amp; ICE CREAM</text>

    <!-- Tech Badges -->
    <g transform="translate(0, 58)">
      <rect x="0" y="0" width="100" height="22" rx="3" fill="#141f2b" stroke="${PALETTE.panelBorder}" />
      <text x="50" y="15" text-anchor="middle" fill="${PALETTE.cyan}" font-family="ui-monospace, monospace" font-size="10.5" font-weight="600">Unity Engine</text>

      <rect x="108" y="0" width="70" height="22" rx="3" fill="#141f2b" stroke="${PALETTE.panelBorder}" />
      <text x="143" y="15" text-anchor="middle" fill="${PALETTE.yellow}" font-family="ui-monospace, monospace" font-size="10.5" font-weight="600">C# Core</text>

      <rect x="186" y="0" width="134" height="22" rx="3" fill="#141f2b" stroke="${PALETTE.panelBorder}" />
      <text x="253" y="15" text-anchor="middle" fill="${PALETTE.text}" font-family="ui-monospace, monospace" font-size="10.5" font-weight="600">Shop Management</text>

      <rect x="328" y="0" width="134" height="22" rx="3" fill="#141f2b" stroke="${PALETTE.panelBorder}" />
      <text x="395" y="15" text-anchor="middle" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="10.5" font-weight="600">Gameplay Systems</text>
    </g>

    <!-- Game Synopsis -->
    <text x="0" y="104" fill="${PALETTE.text}" font-family="ui-monospace, monospace" font-size="12">Build, automate, and serve desserts in a cozy cafe tycoon simulation game.</text>
    <text x="0" y="124" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="11.5">Engineered state machines, order queue processing, shop economy, and juice effects.</text>

    <!-- Interactive Link Button Look -->
    <g transform="translate(0, 136)">
      <rect width="180" height="28" rx="4" fill="${PALETTE.cyan}" fill-opacity="0.12" stroke="${PALETTE.cyan}" stroke-width="1" />
      <text x="90" y="18" text-anchor="middle" fill="${PALETTE.cyan}" font-family="ui-monospace, monospace" font-size="11" font-weight="700">▶ PLAY ON ITCH.IO ↗</text>

      <text x="195" y="18" fill="${PALETTE.dim}" font-family="ui-monospace, monospace" font-size="10.5">&gt; monomee.itch.io/mixie-empire-boba-and-ice-cream</text>
    </g>
  </g>

  <!-- CRT Scanlines Overlay -->
  <rect width="${width}" height="${height}" rx="8" fill="url(#scanlines)" pointer-events="none" />

  ${renderCornerBrackets(width, height)}
</svg>`;
}

/**
 * 4. LANGUAGES & TECH STACK CARD
 */
function renderSkillsCard() {
  const width = 820;
  const height = 180;

  const skills = [
    { name: "C#", category: "CORE LANGUAGE", color: PALETTE.yellow, status: "PRIMARY" },
    { name: "UNITY", category: "GAME ENGINE", color: PALETTE.cyan, status: "CORE" },
    { name: "GIT", category: "VERSION CONTROL", color: PALETTE.red, status: "WORKFLOW" },
    { name: "JAVASCRIPT", category: "SCRIPTING / WEB", color: PALETTE.yellow, status: "SECONDARY" },
    { name: "PYTHON", category: "AUTOMATION", color: PALETTE.green, status: "TOOLS" },
    { name: "JAVA", category: "ALGORITHMS", color: PALETTE.cyan, status: "FOUNDATION" },
  ];

  const cardWidth = 122;
  const cardHeight = 98;
  const gap = 8;
  const startX = 28;

  let skillsSvg = "";
  skills.forEach((s, i) => {
    const x = startX + i * (cardWidth + gap);
    skillsSvg += `
    <g transform="translate(${x}, 56)">
      <rect width="${cardWidth}" height="${cardHeight}" rx="4" fill="${PALETTE.panel}" stroke="${PALETTE.panelBorder}" stroke-width="1" />
      <text x="12" y="22" fill="${PALETTE.muted}" font-family="ui-monospace, monospace" font-size="9" font-weight="600" letter-spacing="0.8">${s.category}</text>
      <text x="12" y="52" fill="${s.color}" font-family="ui-monospace, monospace" font-size="16" font-weight="800">${s.name}</text>
      <rect x="12" y="68" width="${cardWidth - 24}" height="18" rx="2" fill="${PALETTE.codeBg}" stroke="${PALETTE.codeBorder}" stroke-width="0.8" />
      <text x="${cardWidth / 2}" y="80" text-anchor="middle" fill="${PALETTE.dim}" font-family="ui-monospace, monospace" font-size="9" font-weight="700">${s.status}</text>
    </g>
    `;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="${height}" role="img" aria-label="Languages and Technologies Skill Rack">
  ${getSvgDefs()}

  <!-- Card Background -->
  <rect width="${width}" height="${height}" rx="8" fill="${PALETTE.bg}" stroke="${PALETTE.panelBorder}" stroke-width="1.2" />
  <rect width="${width}" height="${height}" rx="8" fill="url(#dot-grid)" pointer-events="none" />

  ${renderHeader("SYSTEM_MODULES // 02_TECH_RACK", "// ARSENAL", "● COMPILED", PALETTE.cyan)}

  ${skillsSvg}

  <!-- CRT Scanlines Overlay -->
  <rect width="${width}" height="${height}" rx="8" fill="url(#scanlines)" pointer-events="none" />

  ${renderCornerBrackets(width, height)}
</svg>`;
}

module.exports = {
  renderHeroCard,
  renderTelemetryCard,
  renderProjectCard,
  renderSkillsCard,
  PALETTE,
};
