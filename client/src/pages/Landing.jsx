import { Link } from 'react-router-dom';
import {
    ArrowForwardRounded, AutoGraphRounded, BookmarkBorderRounded,
    CalendarMonthRounded, CodeRounded, CompareArrowsRounded,
} from '@mui/icons-material';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';

const features = [
    { icon: <AutoGraphRounded />, title: 'Progress analytics', description: 'Explore rating history, submission outcomes, and the problem tags you solve.' },
    { icon: <CompareArrowsRounded />, title: 'Compare handles', description: 'Compare Codeforces ratings, contest history, and solved problems side by side.' },
    { icon: <CodeRounded />, title: 'Problem tracker', description: 'Browse problems by rating and tags, then keep a personal practice list.' },
    { icon: <CalendarMonthRounded />, title: 'Contest hub', description: 'Find upcoming contests and open the official contest page from one place.' },
];

function DashboardPreview() {
    return (
        <Paper className="preview-window" elevation={0} aria-label="CP-Hub dashboard preview">
            <Box className="preview-topbar">
                <Stack direction="row" spacing={0.7}><i /><i /><i /></Stack>
                <Typography variant="caption">CP-Hub / Overview</Typography>
                <span className="preview-live">SAMPLE PREVIEW</span>
            </Box>
            <Box className="preview-content">
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                    <Box><Typography variant="h6" fontWeight={700}>Your progress, at a glance</Typography><Typography variant="caption" color="text.secondary">A clearer view of your Codeforces practice</Typography></Box>
                    <Chip label="Codeforces" size="small" className="cf-chip" />
                </Stack>
                <Box className="preview-stats">
                    {[['RATING', 'Track over time'], ['SOLVED', 'See accepted problems'], ['CONTESTS', 'Review performance']].map(([label, value]) => (
                        <Paper key={label} elevation={0} className="preview-stat"><Typography variant="overline" color="text.secondary">{label}</Typography><Typography variant="body2" fontWeight={600}>{value}</Typography></Paper>
                    ))}
                </Box>
                <Paper elevation={0} className="preview-chart">
                    <Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="subtitle2" fontWeight={700}>Rating history</Typography><Typography variant="caption" color="text.secondary">Interactive chart</Typography></Stack>
                    <Box className="chart-bars" aria-hidden="true">{[32, 45, 38, 58, 48, 67, 61, 82, 72, 92, 78, 100].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</Box>
                </Paper>
                <Stack direction="row" spacing={1} mt={1.5} flexWrap="wrap" useFlexGap>
                    <Chip icon={<CompareArrowsRounded />} label="Compare" size="small" variant="outlined" />
                    <Chip icon={<BookmarkBorderRounded />} label="Bookmarks" size="small" variant="outlined" />
                    <Chip icon={<CalendarMonthRounded />} label="Contests" size="small" variant="outlined" />
                </Stack>
            </Box>
        </Paper>
    );
}

export default function Landing() {
    return (
        <Box className="landing-page">
            <Box className="landing-hero">
                <Box className="hero-copy">
                    <Chip className="hero-kicker" label="YOUR CODEFORCES COMPANION" size="small" />
                    <Typography component="h1" className="hero-title">Make every contest<br /><span>count.</span></Typography>
                    <Typography className="hero-description">CP-Hub brings your Codeforces progress, practice problems, contests, and comparisons into one focused workspace.</Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} className="hero-actions">
                        <Button component={Link} to="/register" variant="contained" size="large" endIcon={<ArrowForwardRounded />}>Get started</Button>
                        <Button component={Link} to="/login" variant="outlined" size="large">Log in</Button>
                    </Stack>
                    <Typography variant="caption" className="hero-note">Link a Codeforces handle to explore your stats and practice history.</Typography>
                </Box>
                <Box className="hero-preview"><DashboardPreview /></Box>
            </Box>

            <Box component="section" className="feature-section" id="features">
                <Typography variant="overline" className="section-eyebrow">BUILT FOR YOUR PRACTICE</Typography>
                <Typography component="h2" variant="h4" fontWeight={750} sx={{ mt: 0.5, mb: 1 }}>One place to keep improving</Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 640, mb: 4 }}>Use Codeforces data to understand your progress and make your next practice session more intentional.</Typography>
                <Box className="feature-grid">
                    {features.map((feature) => (
                        <Paper key={feature.title} elevation={0} className="feature-card">
                            <Box className="feature-icon">{feature.icon}</Box>
                            <Typography variant="h6" fontWeight={700} gutterBottom>{feature.title}</Typography>
                            <Typography color="text.secondary" variant="body2">{feature.description}</Typography>
                        </Paper>
                    ))}
                </Box>
            </Box>
            <Box component="footer" className="landing-footer"><Typography variant="caption">CP-Hub · Competitive programming analytics and practice tools</Typography></Box>
        </Box>
    );
}
