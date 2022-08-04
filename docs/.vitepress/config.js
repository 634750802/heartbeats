import svgLoader from "vite-svg-loader";

/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
    base: '/heartbeats/',
    vite: {
        plugins: [svgLoader()]
    }
}

export default config