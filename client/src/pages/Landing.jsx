import { Link } from 'react-router-dom';
import {
    ArrowForwardRounded, AutoGraphRounded, BookmarkBorderRounded,
    CalendarMonthRounded, CodeRounded, CompareArrowsRounded,
    SearchRounded, TrendingUpRounded,
} from '@mui/icons-material';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';

const features = [
    { icon: <AutoGraphRounded />, title: 'See your progress', description: 'Follow your rating history and get a better sense of how your contest performance changes over time.' },
    { icon: <CompareArrowsRounded />, title: 'Compare profiles', description: 'Put two Codeforces profiles side by side and compare ratings, contests, and solved problems.' },
    { icon: <CodeRounded />, title: 'Find practice problems', description: 'Browse problems by rating and tags, and save the ones you want to come back to.' },
    { icon: <CalendarMonthRounded />, title: 'Keep contests in view', description: 'See upcoming contests and open their official pages without hunting for links.' },
];

function WindowBar({ title }) {
    return (
        <Box className="product-window-bar">
            <Stack direction="row" spacing={0.7} aria-hidden="true"><i /><i /><i /></Stack>
            <Typography variant="caption">{title}</Typography>
            <span className="product-preview-label">PRODUCT PREVIEW</span>
        </Box>
    );
}

function DashboardPreview() {
    return (
        <Paper className="product-window dashboard-preview" elevation={0} aria-label="Example CP-Hub progress dashboard">
            <WindowBar title="CP-Hub / Dashboard" />
            <Box className="product-window-content">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
                    <Box><Typography variant="h6" fontWeight={700}>Your practice, in context</Typography><Typography variant="caption" color="text.secondary">A sample view of Codeforces activity</Typography></Box>
                    <Chip label="Codeforces" size="small" className="cf-chip" />
                </Stack>
                <Box className="dashboard-metrics">
                    <div><span>Current rating</span><strong>1,642</strong><small className="metric-up"><TrendingUpRounded fontSize="inherit" /> +84 this season</small></div>
                    <div><span>Problems solved</span><strong>286</strong><small>Across 24 tags</small></div>
                    <div><span>Contests</span><strong>38</strong><small>Rating history tracked</small></div>
                </Box>
                <Box className="rating-chart-area">
                    <Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="subtitle2" fontWeight={700}>Rating history</Typography><Typography variant="caption" color="text.secondary">Recent contests</Typography></Stack>
                    <svg className="rating-chart" viewBox="0 0 600 156" role="img" aria-label="Illustrative rating history chart">
                        <defs><linearGradient id="rating-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--primary-color)" stopOpacity=".26" /><stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0" /></linearGradient></defs>
                        <path className="chart-gridline" d="M0 30H600M0 70H600M0 110H600M0 150H600" />
                        <path className="rating-area-fill" d="M0 130 C38 122 52 117 82 120 S126 111 150 112 S184 95 218 102 S258 92 286 96 S329 77 354 84 S395 68 420 74 S459 53 486 59 S529 42 552 47 S582 29 600 33 V156 H0Z" />
                        <path className="rating-line" d="M0 130 C38 122 52 117 82 120 S126 111 150 112 S184 95 218 102 S258 92 286 96 S329 77 354 84 S395 68 420 74 S459 53 486 59 S529 42 552 47 S582 29 600 33" />
                        <circle cx="600" cy="33" r="4" className="chart-point" />
                    </svg>
                    <Stack direction="row" justifyContent="space-between" className="chart-axis-labels"><Typography variant="caption">Earlier</Typography><Typography variant="caption">Recent</Typography></Stack>
                </Box>
                <Stack direction="row" spacing={1} mt={2} flexWrap="wrap" useFlexGap>
                    <Chip icon={<CompareArrowsRounded />} label="Compare profiles" size="small" variant="outlined" />
                    <Chip icon={<BookmarkBorderRounded />} label="Saved problems" size="small" variant="outlined" />
                    <Chip icon={<CalendarMonthRounded />} label="Contests" size="small" variant="outlined" />
                </Stack>
            </Box>
        </Paper>
    );
}

function ProblemsPreview() {
    const rows = [
        ['Way Too Long Words', '800', 'implementation'],
        ['Beautiful Matrix', '800', 'implementation'],
        ['Petya and Strings', '1000', 'strings'],
    ];
    return (
        <Paper className="product-window problems-preview" elevation={0} aria-label="Example CP-Hub problem finder">
            <WindowBar title="CP-Hub / Problems" />
            <Box className="problem-preview-content">
                <Box className="problem-preview-heading">
                    <Box><Typography variant="h6" fontWeight={700}>Find a problem to work on</Typography><Typography variant="caption" color="text.secondary">Example list · filter by difficulty or topic</Typography></Box>
                    <Box className="problem-search"><SearchRounded fontSize="small" /><span>Search problems</span></Box>
                </Box>
                <Stack direction="row" spacing={1} className="problem-filters" flexWrap="wrap" useFlexGap>
                    <Chip label="Rating: 800–1200" size="small" className="filter-chip-active" />
                    <Chip label="implementation" size="small" variant="outlined" />
                    <Chip label="Unsolved" size="small" variant="outlined" />
                </Stack>
                <Box className="problem-table" role="table" aria-label="Example filtered problems">
                    <Box className="problem-row problem-row-header" role="row"><span>Problem</span><span>Rating</span><span>Tag</span></Box>
                    {rows.map(([name, rating, tag]) => <Box className="problem-row" role="row" key={name}><strong>{name}</strong><span>{rating}</span><span className="problem-tag">{tag}</span></Box>)}
                </Box>
            </Box>
        </Paper>
    );
}

function ComparePreview() {
    return (
        <Paper className="product-window compare-preview" elevation={0} aria-label="Example CP-Hub profile comparison">
            <WindowBar title="CP-Hub / Compare" />
            <Box className="compare-preview-content">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
                    <Box><Typography variant="h6" fontWeight={700}>Two profiles, one view</Typography><Typography variant="caption" color="text.secondary">Illustrative comparison</Typography></Box>
                    <Chip label="Rating over time" size="small" className="cf-chip" />
                </Stack>
                <Stack direction="row" spacing={3} mb={1.5} className="compare-legend">
                    <span><i className="legend-a" /> Handle A</span><span><i className="legend-b" /> Handle B</span>
                </Stack>
                <svg className="compare-chart" viewBox="0 0 600 210" role="img" aria-label="Illustrative rating comparison chart">
                    <path className="chart-gridline" d="M0 25H600M0 65H600M0 105H600M0 145H600M0 185H600" />
                    <path className="compare-line-a" d="M8 164 C65 149 78 155 124 133 S180 140 218 116 S272 126 315 95 S370 106 410 79 S468 92 509 54 S565 58 592 32" />
                    <path className="compare-line-b" d="M8 178 C55 170 82 161 124 165 S184 145 218 151 S274 132 315 140 S371 115 410 124 S463 100 509 108 S563 83 592 79" />
                </svg>
                <Stack direction="row" justifyContent="space-between" className="chart-axis-labels"><Typography variant="caption">Earlier contests</Typography><Typography variant="caption">Recent contests</Typography></Stack>
                <Box className="compare-summary"><span>Profiles can also be compared by max rating, contest rank, solved problems, and submissions.</span><CompareArrowsRounded fontSize="small" /></Box>
            </Box>
        </Paper>
    );
}

export default function Landing() {
    return (
        <Box className="landing-page">
            <Box className="landing-hero">
                <Box className="hero-copy">
                    <Chip className="hero-kicker" label="FOR CODEFORCES PRACTICE" size="small" />
                    <Typography component="h1" className="hero-title">Make sense of your<br /><span>CP progress.</span></Typography>
                    <Typography className="hero-description">Keep your Codeforces stats, practice problems, saved questions, and contest comparisons together. Spend less time switching tabs and more time solving.</Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} className="hero-actions">
                        <Button component={Link} to="/register" variant="contained" size="large" endIcon={<ArrowForwardRounded />}>Create an account</Button>
                        <Button component={Link} to="/login" variant="outlined" size="large">Log in</Button>
                    </Stack>
                    <Typography variant="caption" className="hero-note">Link a Codeforces handle to get started. The previews use example data.</Typography>
                </Box>
                <Box className="hero-preview"><DashboardPreview /></Box>
            </Box>

            <Box component="section" className="feature-section" id="features">
                <Box className="section-intro">
                    <Typography variant="overline" className="section-eyebrow">A PRACTICAL HOME FOR YOUR PRACTICE</Typography>
                    <Typography component="h2" variant="h4" fontWeight={750} sx={{ mt: 0.5, mb: 1 }}>The useful parts, in one place</Typography>
                    <Typography color="text.secondary" sx={{ maxWidth: 650 }}>CP-Hub brings a few everyday Codeforces tools together, so you can check progress, choose what to solve, and look back at contests.</Typography>
                </Box>
                <Box className="feature-grid">
                    {features.map((feature) => (
                        <Box key={feature.title} className="feature-item">
                            <Box className="feature-icon">{feature.icon}</Box>
                            <Box><Typography variant="h6" fontWeight={700} gutterBottom>{feature.title}</Typography><Typography color="text.secondary" variant="body2">{feature.description}</Typography></Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box component="section" className="product-story">
                <Box className="story-copy">
                    <Typography variant="overline" className="section-eyebrow">PICK YOUR NEXT CHALLENGE</Typography>
                    <Typography component="h2" variant="h4" fontWeight={750}>A problem list you can actually narrow down</Typography>
                    <Typography color="text.secondary">Filter the Codeforces problem set by rating and tags, search by title, and save problems for later. Start with a topic you want to practise and find a problem that fits.</Typography>
                    <Button component={Link} to="/register" variant="text" endIcon={<ArrowForwardRounded />}>Explore problem practice</Button>
                </Box>
                <ProblemsPreview />
            </Box>

            <Box component="section" className="product-story compare-story">
                <ComparePreview />
                <Box className="story-copy">
                    <Typography variant="overline" className="section-eyebrow">LEARN FROM THE COMPARISON</Typography>
                    <Typography component="h2" variant="h4" fontWeight={750}>Compare profiles beyond one number</Typography>
                    <Typography color="text.secondary">Look at rating trends together, then compare contest results and solved-problem counts. It gives you more context than checking current ratings alone.</Typography>
                    <Button component={Link} to="/register" variant="text" endIcon={<ArrowForwardRounded />}>Try profile comparison</Button>
                </Box>
            </Box>

            <Box component="section" className="landing-cta">
                <Box><Typography component="h2" variant="h4" fontWeight={750}>Ready for your next practice session?</Typography><Typography color="text.secondary">Create an account, connect your Codeforces handle, and pick up where you left off.</Typography></Box>
                <Button component={Link} to="/register" variant="contained" size="large" endIcon={<ArrowForwardRounded />}>Get started</Button>
            </Box>
            <Box component="footer" className="landing-footer"><Typography variant="caption">CP-Hub · Codeforces stats, practice problems, comparisons, and contests</Typography></Box>
        </Box>
    );
}
