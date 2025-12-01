export const TEACHABLE_MACHINE_MODELS = {
  Potato: {
    modelUrl: "https://teachablemachine.withgoogle.com/models/L9xoLG22C/",
    name: "Potato Disease Detection",
    description: "Detects common potato diseases with improved accuracy",
  },
  Tomato: {
    modelUrl: "https://teachablemachine.withgoogle.com/models/xszAXgsb0/",
    name: "Tomato Disease Detection",
    description: "Detects common tomato diseases with improved accuracy",
  },
  Onion: {
    modelUrl: "https://teachablemachine.withgoogle.com/models/nJsH9nia2/",
    name: "Onion Disease Detection",
    description: "Detects common onion diseases with improved accuracy",
  },
  Corn: {
    modelUrl: "https://teachablemachine.withgoogle.com/models/YlU_lFJIJ/",
    name: "Corn Disease Detection",
    description: "Detects common corn diseases with improved accuracy",
  },
  Wheat: {
    modelUrl: "https://teachablemachine.withgoogle.com/models/DQ3zYNggU/",
    name: "Wheat Disease Detection",
    description: "Detects common wheat diseases with improved accuracy",
  },
} as const

export type SupportedCrop = keyof typeof TEACHABLE_MACHINE_MODELS

export function getModelForCrop(cropName: string): string | null {
  const normalizedCrop = cropName as SupportedCrop
  return TEACHABLE_MACHINE_MODELS[normalizedCrop]?.modelUrl || null
}

export function isCropSupported(cropName: string): cropName is SupportedCrop {
  return cropName in TEACHABLE_MACHINE_MODELS
}
