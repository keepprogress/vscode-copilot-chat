/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const BYOK_MODEL_OVERRIDES = {
	Anthropic: {
		// Claude 4 Sonnet - specific dated version (recommended for production)
		'claude-sonnet-4-20250514': {
			name: 'Claude Sonnet 4 (2025-05-14)',
			vision: true,
			toolCalling: true,
			maxInputTokens: 100000,  // Conservative default (100K) - users can increase if their tier supports more
			maxOutputTokens: 32000,  // Conservative output limit
		},
		// Claude 4 Sonnet - latest alias (auto-updates)
		'claude-sonnet-4-0': {
			name: 'Claude Sonnet 4 (Latest)',
			vision: true,
			toolCalling: true,
			maxInputTokens: 100000,  // Conservative default (100K) - users can increase if their tier supports more
			maxOutputTokens: 32000,  // Conservative output limit
		},
		// Claude 4 Opus - specific dated version
		'claude-opus-4-20250514': {
			name: 'Claude Opus 4 (2025-05-14)',
			vision: true,
			toolCalling: true,
			maxInputTokens: 100000,  // Conservative default (100K) - users can increase if their tier supports more
			maxOutputTokens: 16000,  // Conservative output limit
		},
		// Claude 4 Opus - latest alias
		'claude-opus-4-0': {
			name: 'Claude Opus 4 (Latest)',
			vision: true,
			toolCalling: true,
			maxInputTokens: 100000,  // Conservative default (100K) - users can increase if their tier supports more
			maxOutputTokens: 16000,  // Conservative output limit
		}
	},
	xAI: {
		// Grok 3 - xAI's advanced language model
		'grok-3': {
			name: 'Grok 3',
			vision: true,
			toolCalling: true,
			maxInputTokens: 64000,   // Conservative default (64K) - users can increase if their tier supports more
			maxOutputTokens: 16000,  // Conservative output limit
		},
		// Grok 4 - latest xAI model with enhanced capabilities
		'grok-4': {
			name: 'Grok 4',
			vision: true,
			toolCalling: true,
			maxInputTokens: 64000,   // Conservative default (64K) - users can increase if their tier supports more
			maxOutputTokens: 16000,  // Conservative output limit
		}
	}
};

export type BYOKModelOverrides = typeof BYOK_MODEL_OVERRIDES;
