/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { defaultAgentName, editingSessionAgent2Name, editingSessionAgentName, editorAgentName, editsAgentName, getChatParticipantNameFromId, terminalAgentName, vscodeAgentName, workspaceAgentName } from '../../../platform/chat/common/chatAgents';

/**
 * 為 GitHub 遙測創建模式名稱
 * 將參與者 ID 映射到對應的模式名稱，用於分析用戶使用不同聊天功能的模式
 * 這是意圖識別系統的一部分，幫助了解用戶如何與不同的 AI 助手交互
 */
export function participantIdToModeName(participantId: string): string {
	const name = getChatParticipantNameFromId(participantId);

	switch (name) {
		case defaultAgentName:      // 默認代理
		case workspaceAgentName:    // 工作區代理
		case vscodeAgentName:       // VS Code 代理
		case 'terminalPanel':       // 終端面板
			return 'ask';           // 問答模式

		case editsAgentName:        // 編輯代理
			return 'agent';         // 代理模式

		case editingSessionAgentName:  // 編輯會話代理
		case editingSessionAgent2Name: // 編輯會話代理 v2
			return 'edit';             // 編輯模式

		case editorAgentName:       // 編輯器代理
		case terminalAgentName:     // 終端代理（與其他未分類的一起歸為內聯模式）
		default:
			return 'inline';        // 內聯模式
	}
}