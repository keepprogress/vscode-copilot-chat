export const BYOK_MODEL_OVERRIDES = {
    Anthropic: {
        // Claude 4 Sonnet - specific dated version (recommended for production)
        'claude-sonnet-4-20250514': {
            name: 'Claude Sonnet 4 (2025-05-14)',
            vision: true,
            toolCalling: true,
            maxInputTokens: 200000,  // 200K context window
            maxOutputTokens: 64000,  // 64K max output tokens
        },
        // Claude 4 Sonnet - latest alias (auto-updates)
        'claude-sonnet-4-0': {
            name: 'Claude Sonnet 4 (Latest)',
            vision: true,
            toolCalling: true,
            maxInputTokens: 200000,
            maxOutputTokens: 64000,
        },
        // Claude 4 Opus - specific dated version
        'claude-opus-4-20250514': {
            name: 'Claude Opus 4 (2025-05-14)',
            vision: true,
            toolCalling: true,
            maxInputTokens: 200000,  // 200K context window
            maxOutputTokens: 32000,  // 32K max output tokens
        },
        // Claude 4 Opus - latest alias
        'claude-opus-4-0': {
            name: 'Claude Opus 4 (Latest)',
            vision: true,
            toolCalling: true,
            maxInputTokens: 200000,
            maxOutputTokens: 32000,
        }
    }
};
export type BYOKModelOverrides = typeof BYOK_MODEL_OVERRIDES;
