import svgLoader from "vite-svg-loader";

/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
    vite: {
        plugins: [svgLoader()]
    }
}

export default config