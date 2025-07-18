# BYOK Cache System Flowcharts

本文檔包含 BYOK 快取系統的詳細流程圖，使用 Mermaid 語法繪製。

## 1. 整體快取系統架構圖

```mermaid
graph TB
    subgraph "User Interface"
        A[用戶輸入] --> B[VS Code Chat]
        B --> C[BYOK Provider Selection]
    end

    subgraph "BYOK Core System"
        C --> D[Provider Router]
        D --> E{Provider Type}

        E -->|Anthropic| F[Anthropic Provider]
        E -->|xAI| G[xAI Provider]
        E -->|OpenAI| H[OpenAI Provider]
        E -->|Others| I[Other Providers]
    end

    subgraph "Cache Management Layer"
        F --> J[Cache Breakpoints]
        G --> K[Auto Cache]
        H --> L[Standard Cache]
        I --> L

        J --> M[Message Converter]
        K --> N[Direct Processing]
        L --> O[OpenAI Compatible]
    end

    subgraph "API Layer"
        M --> P[Anthropic API]
        N --> Q[xAI API]
        O --> R[Provider APIs]
    end

    subgraph "Response Processing"
        P --> S[Cache Statistics]
        Q --> S
        R --> S
        S --> T[Token Usage Tracking]
        T --> U[Response to User]
    end

    style F fill:#e1f5fe
    style G fill:#f3e5f5
    style H fill:#e8f5e8
    style J fill:#fff3e0
    style K fill:#fce4ec
    style L fill:#f1f8e9
```

## 2. Anthropic Claude 快取流程

```mermaid
flowchart TD
    A[用戶請求] --> B[解析輸入]
    B --> C{檢查系統訊息}

    C -->|已存在| D[載入快取訊息]
    C -->|不存在| E[建立系統訊息]

    E --> F[設置快取斷點]
    F --> G[標記 cache_control]

    D --> H[收集工作區上下文]
    G --> H

    H --> I{上下文大小檢查}
    I -->|> 8KB| J[應用上下文快取]
    I -->|< 8KB| K[直接使用]

    J --> L[分割上下文區塊]
    L --> M[設置區塊快取斷點]
    M --> N[構建分層快取]

    K --> O[收集工具定義]
    N --> O

    O --> P{工具定義檢查}
    P -->|大型工具集| Q[快取工具定義]
    P -->|小型工具集| R[直接使用]

    Q --> S[建立完整請求]
    R --> S

    S --> T[發送到 Anthropic API]
    T --> U[處理回應]

    U --> V[解析快取使用情況]
    V --> W[更新快取統計]
    W --> X[回傳結果]

    subgraph "快取斷點處理"
        F --> F1[系統訊息快取]
        M --> M1[上下文區塊快取]
        Q --> Q1[工具定義快取]
    end

    subgraph "API 回應處理"
        U --> U1[cached_tokens]
        U --> U2[cache_creation_tokens]
        U --> U3[cache_hit 標記]
    end

    style F fill:#e3f2fd
    style M fill:#e8f5e8
    style Q fill:#fff3e0
    style V fill:#fce4ec
```

## 3. xAI Grok 自動快取流程

```mermaid
flowchart TD
    A[用戶請求] --> B[xAI Provider 處理]
    B --> C[標準 OpenAI 格式轉換]

    C --> D[構建訊息陣列]
    D --> E[Token 預算檢查]

    E --> F{Token 限制檢查}
    F -->|超出限制| G[內容截斷]
    F -->|在限制內| H[直接處理]

    G --> I[應用截斷策略]
    I --> J[保留核心內容]
    J --> H

    H --> K[發送到 xAI API]
    K --> L[xAI 自動快取處理]

    subgraph "xAI 內部處理"
        L --> L1[智慧內容分析]
        L1 --> L2[自動識別可快取內容]
        L2 --> L3[建立內部快取]
        L3 --> L4[執行推理]
    end

    L4 --> M[回應生成]
    M --> N[快取使用統計]

    N --> O[標準回應格式]
    O --> P[解析使用情況]

    P --> Q[更新 Token 統計]
    Q --> R[回傳結果]

    subgraph "自動快取特性"
        L2 --> A1[重複模式識別]
        L2 --> A2[上下文相似性分析]
        L2 --> A3[Token 效率優化]
    end

    style L fill:#f3e5f5
    style L1 fill:#e8eaf6
    style L2 fill:#e1f5fe
    style L3 fill:#e0f2f1
```

## 4. Token 預算管理流程

```mermaid
flowchart TD
    A[開始對話] --> B[載入模型配置]
    B --> C[讀取 Token 限制]

    C --> D{模型類型檢查}
    D -->|Grok 4| E[200K Context Window]
    D -->|Grok 3| F[128K Context Window]
    D -->|Claude 4| G[200K Context Window]
    D -->|Others| H[Default Limits]

    E --> I[計算可用預算]
    F --> I
    G --> I
    H --> I

    I --> J[分配 Token 預算]

    subgraph "預算分配策略"
        J --> J1[系統訊息: 10%]
        J --> J2[工具定義: 5%]
        J --> J3[工作區上下文: 60%]
        J --> J4[對話歷史: 20%]
        J --> J5[預留空間: 5%]
    end

    J5 --> K[開始內容處理]

    K --> L{內容類型}
    L -->|系統訊息| M[檢查系統訊息長度]
    L -->|上下文| N[檢查上下文大小]
    L -->|對話| O[檢查對話長度]

    M --> P{超出預算?}
    N --> Q{超出預算?}
    O --> R{超出預算?}

    P -->|是| S[截斷系統訊息]
    P -->|否| T[應用快取]

    Q -->|是| U[分頁上下文]
    Q -->|否| V[應用快取]

    R -->|是| W[修剪對話歷史]
    R -->|否| X[保留完整對話]

    S --> Y[重新計算預算]
    U --> Y
    W --> Y
    T --> Z[構建最終請求]
    V --> Z
    X --> Z

    Y --> Z
    Z --> AA[發送 API 請求]

    AA --> BB{回應檢查}
    BB -->|Token 超限錯誤| CC[降級處理]
    BB -->|成功| DD[處理回應]

    CC --> EE[減少內容]
    EE --> AA

    DD --> FF[更新使用統計]
    FF --> GG[回傳結果]

    style I fill:#e3f2fd
    style J fill:#e8f5e8
    style Y fill:#fff3e0
    style CC fill:#ffebee
```

## 5. 快取命中決策流程

```mermaid
flowchart TD
    A[接收請求] --> B[內容指紋計算]
    B --> C[檢查快取存在性]

    C --> D{快取狀態}
    D -->|Hit| E[載入快取內容]
    D -->|Miss| F[準備新快取]
    D -->|Partial| G[部分快取處理]

    E --> H[驗證快取有效性]
    H --> I{快取是否有效?}
    I -->|是| J[使用快取內容]
    I -->|否| K[標記快取失效]

    F --> L[分析內容可快取性]
    L --> M{內容特徵分析}
    M -->|穩定內容| N[設為高優先級快取]
    M -->|動態內容| O[設為低優先級快取]
    M -->|一次性內容| P[不快取]

    G --> Q[合併快取與新內容]
    Q --> R[優化混合快取策略]

    J --> S[構建請求]
    K --> L
    N --> S
    O --> S
    P --> S
    R --> S

    S --> T[發送 API 請求]
    T --> U[處理回應]

    U --> V[更新快取統計]
    V --> W[快取效果評估]

    W --> X{效果評估}
    X -->|良好| Y[增加快取權重]
    X -->|一般| Z[維持當前策略]
    X -->|差| AA[降低快取使用]

    Y --> BB[回傳結果]
    Z --> BB
    AA --> BB

    subgraph "快取評估指標"
        W --> W1[命中率]
        W --> W2[Token 節省]
        W --> W3[回應延遲]
        W --> W4[成本效益]
    end

    subgraph "內容特徵"
        M --> M1[重複頻率]
        M --> M2[內容大小]
        M --> M3[變化模式]
        M --> M4[使用頻率]
    end

    style E fill:#e8f5e8
    style F fill:#fff3e0
    style G fill:#e3f2fd
    style AA fill:#ffebee
```

## 6. 錯誤處理和恢復流程

```mermaid
flowchart TD
    A[API 請求發送] --> B[等待回應]
    B --> C{回應狀態}

    C -->|200 成功| D[正常處理]
    C -->|429 限流| E[處理速率限制]
    C -->|400 請求錯誤| F[處理請求錯誤]
    C -->|500 伺服器錯誤| G[處理伺服器錯誤]

    D --> H[解析回應內容]
    H --> I[檢查快取資訊]
    I --> J[更新統計資料]
    J --> K[成功回傳]

    E --> L{錯誤類型分析}
    L -->|Token 超限| M[Token 超限處理]
    L -->|速率限制| N[速率限制處理]
    L -->|快取錯誤| O[快取錯誤處理]

    M --> P[減少內容大小]
    P --> Q[重新計算 Token 預算]
    Q --> R[生成簡化請求]

    N --> S[檢查 retry-after]
    S --> T[等待指定時間]
    T --> U[重新發送請求]

    O --> V{快取錯誤類型}
    V -->|快取格式錯誤| W[重置快取格式]
    V -->|快取超限| X[減少快取使用]
    V -->|快取不支援| Y[禁用快取功能]

    F --> Z{請求錯誤分析}
    Z -->|參數錯誤| AA[修正參數]
    Z -->|格式錯誤| BB[修正格式]
    Z -->|不支援功能| CC[降級功能]

    G --> DD[伺服器錯誤處理]
    DD --> EE[指數退避重試]
    EE --> FF{重試次數檢查}
    FF -->|< 最大次數| GG[等待後重試]
    FF -->|>= 最大次數| HH[失敗回報]

    R --> II[重新發送]
    U --> II
    W --> II
    X --> II
    Y --> II
    AA --> II
    BB --> II
    CC --> II
    GG --> II

    II --> A

    HH --> JJ[錯誤日誌記錄]
    JJ --> KK[用戶錯誤提示]

    subgraph "重試策略"
        EE --> E1[1秒]
        EE --> E2[2秒]
        EE --> E3[4秒]
        EE --> E4[8秒]
        EE --> E5[16秒]
    end

    subgraph "錯誤分類"
        L --> L1[Client Error 4xx]
        L --> L2[Server Error 5xx]
        L --> L3[Network Error]
        L --> L4[Timeout Error]
    end

    style E fill:#fff3e0
    style M fill:#ffebee
    style O fill:#fce4ec
    style HH fill:#f3e5f5
```

## 使用說明

這些流程圖可以幫助開發者理解：

1. **整體架構**: 了解 BYOK 快取系統的完整結構
2. **提供者特定流程**: 理解不同 AI 提供者的快取實現差異
3. **Token 管理**: 掌握 Token 預算分配和使用策略
4. **快取決策**: 了解快取命中和失誤的處理邏輯
5. **錯誤處理**: 學習如何處理各種錯誤情況和恢復策略

每個流程圖都包含了關鍵決策點和處理路徑，可以作為代碼實現和問題排除的參考。

---

*生成工具: Mermaid*
*最後更新: 2025年7月18日*
