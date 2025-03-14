/** @type {import('next').NextConfig} */

const nextConfig = {
    env: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fwgkgeexxpablhdynavt.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3Z2tnZWV4eHBhYmxoZHluYXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4Njk4MTcsImV4cCI6MjA1NzQ0NTgxN30.NSXJK3_ct7IGt3CuYVdG5wS5sZA7EW3l2-H4AepST4o'
    },
    images: {
        domains: ['fwgkgeexxpablhdynavt.supabase.co'],
    }
};

if (process.env.NEXT_PUBLIC_TEMPO) {
    nextConfig["experimental"] = {
        // NextJS 13.4.8 up to 14.1.3:
        // swcPlugins: [[require.resolve("tempo-devtools/swc/0.86"), {}]],
        // NextJS 14.1.3 to 14.2.11:
        swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]]

        // NextJS 15+ (Not yet supported, coming soon)
    }
}

module.exports = nextConfig;