import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  globalCss: {
    "html, body": {
      bg: "neu.bg",
      color: "neu.text",
      minHeight: "100%",
    },
    "#__next": {
      minHeight: "100%",
    },
    button: {
      bg: "neu.surface",
      borderColor: "neu.border",
      borderWidth: "1px",
      borderRadius: "14px",
      boxShadow: "neuRaised",
    },
    "input, textarea, select": {
      bg: "neu.surface",
      borderColor: "neu.border",
      borderWidth: "1px",
      borderRadius: "12px",
      boxShadow: "neuInset",
    },
    "[data-scope='card'][data-part='root']": {
      bg: "neu.surface",
      borderColor: "neu.border",
      borderWidth: "1px",
      borderRadius: "20px",
      boxShadow: "neuRaised",
    },
  },
  theme: {
    semanticTokens: {
      colors: {
        neu: {
          bg: {
            value: { base: "#e6ebf2", _dark: "#161c24" },
          },
          surface: {
            value: { base: "#edf2f8", _dark: "#1f2732" },
          },
          text: {
            value: { base: "#1f2937", _dark: "#e5e7eb" },
          },
          border: {
            value: { base: "#d7dee8", _dark: "#2a3442" },
          },
        },
      },
      shadows: {
        neuRaised: {
          value: {
            base: "10px 10px 24px rgba(163, 177, 198, 0.58), -10px -10px 24px rgba(255, 255, 255, 0.9)",
            _dark: "10px 10px 24px rgba(0, 0, 0, 0.62), -10px -10px 24px rgba(255, 255, 255, 0.04)",
          },
        },
        neuInset: {
          value: {
            base: "inset 8px 8px 18px rgba(163, 177, 198, 0.46), inset -8px -8px 18px rgba(255, 255, 255, 0.8)",
            _dark: "inset 8px 8px 18px rgba(0, 0, 0, 0.56), inset -8px -8px 18px rgba(255, 255, 255, 0.04)",
          },
        },
      },
    },
    layerStyles: {
      neuRaised: {
        value: {
          bg: "neu.surface",
          borderRadius: "24px",
          borderWidth: "1px",
          borderColor: "neu.border",
          boxShadow: "neuRaised",
        },
      },
      neuInset: {
        value: {
          bg: "neu.surface",
          borderRadius: "20px",
          borderWidth: "1px",
          borderColor: "neu.border",
          boxShadow: "neuInset",
        },
      },
    },
  },
})

const system = createSystem(defaultConfig, config)

export default system