/**
 * ============================================================================
 * NeuronSparks Showcase Presentation Generator
 * ============================================================================
 *
 * Generates a PowerPoint (.pptx) showcase presentation with source-code
 * snippets, architecture diagrams, and lessons learned.
 *
 * Usage:
 *   node scripts/generate-showcase.js
 *
 * Output:
 *   docs/NeuronSparks_Showcase.pptx
 *
 * Requires pptxgenjs as a dev dependency (npm install --save-dev pptxgenjs).
 */

const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const OUTPUT = path.join(DOCS_DIR, 'NeuronSparks_Showcase.pptx');

/** Read a source file relative to project root and return its content. */
function readSrc(relPath) {
    const full = path.join(ROOT, relPath);
    if (!fs.existsSync(full)) return `// File not found: ${relPath}`;
    return fs.readFileSync(full, 'utf-8');
}

/** Extract a named block from source code (between two markers). */
function extractSnippet(relPath, startMarker, endMarker, maxLines = 30) {
    const src = readSrc(relPath);
    const lines = src.split('\n');
    let capturing = false;
    const result = [];
    for (const line of lines) {
        if (!capturing && line.includes(startMarker)) capturing = true;
        if (capturing) {
            result.push(line);
            if (result.length >= maxLines) break;
            if (line.includes(endMarker) && result.length > 1) break;
        }
    }
    return result.join('\n');
}

// ---------------------------------------------------------------------------
// Colour palette (matches the app's cyberpunk theme)
// ---------------------------------------------------------------------------

const COLORS = {
    bg_dark: '0A0E27',
    bg_card: '111633',
    primary: '00D4FF',
    accent: '7B61FF',
    text: 'E0E6FF',
    textDim: '8892B0',
    success: '64FFDA',
    error: 'FF6B6B',
    codeBg: '1A1F3D',
};

// ---------------------------------------------------------------------------
// Slide builder helpers
// ---------------------------------------------------------------------------

function addTitleSlide(presx) {
    const slide = presx.addSlide();
    slide.background = { color: COLORS.bg_dark };
    slide.addText('NEURON SPARKS', {
        x: 0.5, y: 1.0, w: 9, h: 1.2,
        fontSize: 44, bold: true, color: COLORS.primary,
        fontFace: 'Segoe UI', align: 'center',
    });
    slide.addText('From Zero to Production', {
        x: 0.5, y: 2.3, w: 9, h: 0.8,
        fontSize: 24, color: COLORS.accent,
        fontFace: 'Segoe UI', align: 'center',
    });
    slide.addText(
        'A cyberpunk sci-fi notes application built with React Native & Expo\nVersion 1.0.2',
        {
            x: 1, y: 3.5, w: 8, h: 1,
            fontSize: 14, color: COLORS.textDim,
            fontFace: 'Segoe UI', align: 'center',
        }
    );
}

function addContentSlide(presx, title, bullets) {
    const slide = presx.addSlide();
    slide.background = { color: COLORS.bg_dark };
    slide.addText(title, {
        x: 0.5, y: 0.3, w: 9, h: 0.8,
        fontSize: 28, bold: true, color: COLORS.primary,
        fontFace: 'Segoe UI',
    });
    slide.addText(bullets.map(b => ({ text: b, options: { bullet: true, color: COLORS.text, fontSize: 14 } })), {
        x: 0.7, y: 1.3, w: 8.6, h: 4.5,
        fontFace: 'Segoe UI', lineSpacingMultiple: 1.3, paraSpaceAfter: 8, valign: 'top',
    });
    return slide;
}

function addCodeSlide(presx, title, codeSnippet, subtitle) {
    const slide = presx.addSlide();
    slide.background = { color: COLORS.bg_dark };
    slide.addText(title, {
        x: 0.5, y: 0.2, w: 9, h: 0.7,
        fontSize: 24, bold: true, color: COLORS.primary,
        fontFace: 'Segoe UI',
    });
    if (subtitle) {
        slide.addText(subtitle, {
            x: 0.5, y: 0.85, w: 9, h: 0.4,
            fontSize: 12, color: COLORS.textDim,
            fontFace: 'Segoe UI',
        });
    }
    slide.addText(codeSnippet, {
        x: 0.4, y: subtitle ? 1.3 : 1.0, w: 9.2, h: subtitle ? 4.3 : 4.6,
        fontSize: 10, color: COLORS.success,
        fontFace: 'Consolas',
        fill: { color: COLORS.codeBg },
        valign: 'top',
        wrap: true,
        lineSpacingMultiple: 1.15,
        margin: [6, 10, 6, 10],
    });
    return slide;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    // Ensure docs directory exists
    if (!fs.existsSync(DOCS_DIR)) {
        fs.mkdirSync(DOCS_DIR, { recursive: true });
    }

    const presx = new PptxGenJS();
    presx.author = 'NeuronSparks';
    presx.title = 'NeuronSparks Showcase Presentation';
    presx.subject = 'Showcase';
    presx.layout = 'LAYOUT_WIDE';

    // Slide 1: Title
    addTitleSlide(presx);

    // Slide 2: App Features
    addContentSlide(presx, 'App Features & Sci-Fi Design', [
        'Cyberpunk / Tony Stark holographic UI with dark obsidian theme (#0A0E27)',
        'Neon-glowing note cards with time-ago counters, tag pills, and dynamic shadows',
        'Interactive tag engine: create, filter, and organise notes by custom tags',
        'Full-text search across titles, content, and tags with relevance scoring',
        'Ironclad AsyncStorage persistence — data survives app restarts',
        'Export to JSON, CSV, and Markdown via the system share sheet',
        'Responsive design: 1-column phones, 2-column tablets (dynamic key trick)',
        'React Native Reanimated: 60 fps spring animations on the UI thread',
    ]);

    // Slide 3: Architecture Overview
    addContentSlide(presx, 'Architecture Overview', [
        'Provider tree: ErrorBoundary → SafeAreaProvider → ThemeContext → SettingsContext → NoteContext → SearchContext → RootNavigator',
        'State management: useReducer pattern inside each Context for immutable updates',
        'Persistence: StorageService abstraction over AsyncStorage (never direct calls)',
        'Validation: ValidationService with sanitise → normalise → validate pipeline',
        'Search: pure-function SearchService with relevance scoring and tag filtering',
        'Animations: useAnimations.js hook library (press, fade, pulse, slide, shimmer, float, rotate)',
        'Path aliases via babel-plugin-module-resolver (@screens, @components, @hooks, etc.)',
        'EAS Build configured for APK and production builds',
    ]);

    // Slide 4: Code Snippet — Theme System
    const themeSnippet = extractSnippet('src/utils/theme.js', 'DARK_COLORS', '};', 28);
    addCodeSlide(presx, 'Code: Theme System (DARK_COLORS)', themeSnippet, 'src/utils/theme.js — Tony Stark cyberpunk colour palette');

    // Slide 5: Code Snippet — NoteContext Reducer
    const reducerSnippet = extractSnippet('src/context/NoteContext.js', 'const noteReducer', '};', 30);
    addCodeSlide(presx, 'Code: NoteContext Reducer', reducerSnippet, 'src/context/NoteContext.js — useReducer for immutable note state');

    // Slide 6: Code Snippet — HomeScreen FlatList Dynamic Key
    const flatlistSnippet = extractSnippet('src/screens/HomeScreen.js', '<FlatList', '/>', 20);
    addCodeSlide(presx, 'Code: HomeScreen FlatList (Dynamic Key Pattern)', flatlistSnippet, 'src/screens/HomeScreen.js — forces remount when numColumns changes');

    // Slide 7: Code Snippet — StorageService
    const storageSnippet = extractSnippet('src/services/StorageService.js', 'getAllNotes', '},', 25);
    addCodeSlide(presx, 'Code: StorageService', storageSnippet, 'src/services/StorageService.js — AsyncStorage abstraction layer');

    // Slide 8: Code Snippet — Animation Hooks
    const animSnippet = extractSnippet('src/hooks/useAnimations.js', 'usePressAnimation', '};', 22);
    addCodeSlide(presx, 'Code: Animation Hooks', animSnippet, 'src/hooks/useAnimations.js — Reanimated spring press effect');

    // Slide 9: Build & Deployment
    addContentSlide(presx, 'Build & Deployment', [
        'Expo SDK 52 with React Native 0.76.9 and Hermes engine',
        'EAS Build for managed APK/AAB builds (no local Android Studio needed)',
        'Web deployment via `npx expo start --web` (React Native Web)',
        'Metro bundler with babel-plugin-module-resolver for clean imports',
        'Hermes bytecode compilation for near-instant cold starts on Android',
        'ESLint + Prettier for code quality enforcement',
    ]);

    // Slide 10: Lessons Learned
    addContentSlide(presx, 'Lessons Learned', [
        'Mobile ≠ Web: text strings must be inside <Text>, layouts need SafeArea insets',
        'JSX is strict: whitespace between tags becomes a text node and crashes RN',
        'FlatList numColumns cannot change on a mounted list — use the dynamic key trick',
        'Stick to LTS toolchain versions (JDK 17, not the newest JDK 25)',
        'Clear Metro cache when asset paths change: `npx expo start --clear`',
        'Context + useReducer beats useState for complex shared state',
        'Pure-function services (SearchService, ValidationService) are easy to test',
        'Reanimated worklets run on the UI thread — 60 fps animations for free',
    ]);

    // Write file
    await presx.writeFile({ fileName: OUTPUT });
    console.log(`\n✅ Showcase presentation generated successfully!`);
    console.log(`   Output: ${OUTPUT}\n`);
}

main().catch(err => {
    console.error('❌ Failed to generate presentation:', err);
    process.exit(1);
});
