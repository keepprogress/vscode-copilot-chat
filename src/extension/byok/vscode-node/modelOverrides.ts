export const BYOK_MODEL_OVERRIDES = {
    Anthropic: {
        'claude-4-sonnet': {
            name: 'Claude 4 Sonnet',
            vision: true,
            toolCalling: true,
            maxInputTokens: 64000,
            maxOutputTokens: 16384,
        }
    }
};
export type BYOKModelOverrides = typeof BYOK_MODEL_OVERRIDES;
