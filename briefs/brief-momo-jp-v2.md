# momo-jp · design brief v2

**Celine · Designer** · 2026-11-05  
報告先: Sua → Jessie（実装）／Justin visual（LIVE）  
根拠: Justin 決定 **Direction A+ 紙ノート洗練** ＋ **カテゴリ折りたたみあり** ＋ **一覧1行プレビューなし**  
前版: `brief-momo-jp-v1.md` ＋ punch（tip `6696934` で must-fix 反映済）＋ `research-momo-jp-ui-v1.md`  
この brief は **レイアウト／色／字／折りたたみ IA／UI 文言**のみ。教材 MD は触らない。コードは書かない。

**v1 からの差分（実装スコープ）:** 色階層・本文 18/1.7・例文ルール色・カテゴリ折りたたみ。期間・データ・文言ロック・PREVIEW/LIVE ゲートは v1 と同じ。一覧プレビュー行は **今回やらない**。

---

## 0. Direction（ロック）

| 項目 | 決定 |
|------|------|
| ゴール | 自分用モバイル優先勉強メモ。絞り込み → カードを開く。 |
| トーン | 紙のノート。静か・読みやすい・短い日本語。英語スローガン無し。 |
| ビジュアル | **A+ · 紙ノート洗練** — page／raised／divider の3層、システム字、本文 18/1.7 |
| レイアウト追加 | **カテゴリは折りたたみ**（閉じ時は選中チップ＋解除のみ） |
| やらない（v2） | 一覧1行プレビュー、Direction B/C、webfont、緑アクセント |

現状 PREVIEW: https://justinksw.github.io/momo-jp/ · tip `6696934` · LIVE **HOLD** until Justin visual OK after this polish.

---

## 1. 情報設計（v1 継承＋折りたたみ）

```
hub (/)
  ├─ ヘッダー（勉強メモ ＋ 小さく momo-jp）
  ├─ 期間フィルタ（単一・常時表示）
  ├─ カテゴリ（折りたたみ）
  │    ├─ 閉じ: 見出し「カテゴリで絞る」＋選中チップ（あれば）＋「解除」
  │    └─ 開き: 全カテゴリチップ（トグル）
  ├─ 件数／空状態
  └─ カード一覧（title・日付・カテゴリチップのみ／プレビュー行なし）
       └─ tap → カード詳細
カード詳細
  ├─ 戻る
  ├─ メタ（日付・カテゴリ）
  └─ 本文（MD そのまま・型の視覚差は CSS のみ）
```

データ源・front matter・サンプル3枚は v1 どおり（Jessie 既存）。教材文言は非改変。

---

## 2. Hub レイアウト

### 2.1 ヘッダー

- 主: **勉強メモ**
- 副: 小さく `momo-jp`
- サブコピー無し

### 2.2 期間フィルタ（単一・変更なし）

常時表示のチップ行。必ず1つ。初期 **今日**。

| value | ラベル |
|-------|--------|
| day | 今日 |
| week | 今週 |
| month | 今月 |
| year | 今年 |
| all | 全部 |

定義・HK・月曜始まりは v1 どおり。カテゴリと **AND**。未選択カテゴリ＝カテゴリ制限なし。

**320 必須:** 今日〜全部が **一行で全部見える**（横スクロール依存にしない）。tip `6696934` の padding／gap 締めを維持または再確認。

### 2.3 カテゴリ折りたたみ（v2 新）

- セクション見出し: **カテゴリで絞る**（タップで開閉。見出し行全体が ≥44px）
- **初期状態:** **閉じ**（一覧を上に出す）。選中が1つ以上あるときも閉じたまま、選中チップだけ露出。
- **閉じ時に見せるもの:**
  - 見出し＋開閉アフォーダンス（`›`／`∨` など短く・装飾過多禁止）
  - 選中カテゴリのチップ（あれば・dismissible でもトグルでも可）
  - 選中があるときだけ **解除**（全部オフ）
  - 選中ゼロのとき: 見出しだけ（「未選択」文言は不要）
- **開き時:** plan 全スラッグ（推奨）または存在するタグ。0件候補は dim（下記色）。トグルオン／オフ。
- 閉じたまま選中チップを外して全部オフにしてもよい（＝解除と同義）。

ラベル表（v1 ロック）:

| slug | ラベル |
|------|--------|
| vocabulary | 語彙 |
| grammar | 文法 |
| fun-fact | 豆知識 |
| history | 歴史 |
| society | 社会 |
| culture | 文化 |
| food | 食 |
| living | 生活 |
| travel | 旅行 |
| fashion | ファッション |

### 2.4 一覧行（プレビューなし）

1行タップ領域 ≥44px:

- **title**（主）
- **date**（推奨 `11/5`；今年以外だけ年）
- **categories** — 小チップ

**やらない:** 例文1行プレビュー、subtitle、MD 抜粋。

区切り: raised 行 or フラット＋ divider 下線（紙ノート）。行面は raised 色。

### 2.5 空状態・件数

- 空: **この条件のカードはないよ**
- 件数: フィルタ下に小さく `N件`（推奨）

---

## 3. カード詳細

- **戻る**（hub）必須
- H1 = `title`
- メタ: 日付（詳細は任意で `11月5日`）＋カテゴリチップ
- 本文 MD → HTML。読み順そのまま。CSS 階層のみ:
  - **例文:** 本文よりわずかに大きい（**1.1em**）＋左ルール（色は §5）
  - **語彙／見出し:** 太字（MD `**`）
  - **中文:** 二次インク可・`lang="zh-Hant"` 付けられれば付ける（任意）
- 前後ナビ無しでよい
- max 幅 **~36–40rem**、左右 padding **≥20px**（320 でも ≥16）

---

## 4. UI 文言（ロック・v1＋折りたたみ）

使ってよい: 今日・今週・今月・今年・全部・語彙・文法・豆知識・歴史・社会・文化・食・生活・旅行・ファッション・戻る・勉強メモ・カテゴリで絞る・解除・件・この条件のカードはないよ  

禁止: 英語スローガン、Unlock / Explore / Dive、AIが厳選、スマート学習、パーソナライズ系。

---

## 5. ビジュアル（A+ トークン）

### 5.1 色

| 役割 | Hex | 使いどころ |
|------|-----|------------|
| page | `#F5F0E6` | 背景 |
| raised | `#FCFAF6` | 一覧行・カード面・開いたフィルタ面（任意） |
| divider | `#DAD1BF` | 行下線・区切り |
| ink | `#1C1A16` | 本文・選択チップ塗り・見出し |
| secondary | `#524C42` | 日付・件数・副標・dim ラベル |
| example-rule | `#C9BA9A` | 例文左ボーダーのみ（アクセントはこの一点） |
| chip-on | ink 塗り＋ raised／白字 | 期間・カテゴリ選択中 |
| chip-off | raised or page ＋ divider 枠 ＋ ink／secondary 字 | 未選択 |
| chip-dim | secondary 字 `#524C42` ＋枠・**opacity 禁止**（punch 教訓） | 0件候補 |

コントラスト目安: 本文 ink on page ≥ 4.5:1；secondary on page ≥ 4.5:1；選択チップ字 on ink ≥ 4.5:1。

### 5.2 字

- スタック（システム優先・**webfont 無し**）:  
  `"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", system-ui, sans-serif`
- ページ `lang="ja"`。中文ブロックに `lang="zh-Hant"` できれば（任意）。
- 本文 **18px / line-height 1.7**
- 例文ブロック **1.1em**／行間は本文に合わせるかわずかに広め
- 見出し **font-weight 600**、本文 Regular（400）
- hub タイトルは本文より一段大きくてよい（例 1.25rem W6）

### 5.3 その他

- ヒーロー／大マスコット無し。favicon 可。
- カテゴリは **ニュートラルチップ**（色分けしすぎない）。vocabulary／grammar のごく薄い差は任意・必須ではない。
- PREVIEW バッジは Jessie／`pages-preview-live` どおり。色は page 系でよい（緑テーマにしない）。

---

## 6. レスポンシブ

- モバイルファースト。基準 **390px**
- 証明幅: **320 / 360 / 390 / 430**
- hub 中央カラム max **~560–640px**。詳細 ~36–40rem。ワイド多カラム無し
- **desktop Chrome** ＋ **iPhone WebKit**（Safari・iOS Chrome）: 横スクロール無し、チップが本文を消さない、折りたたみ開閉でレイアウトジャンプしすぎない（閉じ→開きで一覧が下にずれてよいが、閉じ時に期間＋件数＋先頭行が見えること）

---

## 7. Acceptance list（計測可・矛盾なし）

1. 期間（今日／今週／今月／今年／全部）単一選択。初期 **今日**。HK 定義は v1。
2. カテゴリ複数トグル。未選択＝制限なし。期間と AND。
3. **カテゴリ折りたたみ:** 初期閉じ。閉じ時は選中チップ（あれば）＋解除のみ。開きで全チップ。見出しタップで開閉。タップ高 ≥44px。
4. 一覧にサンプル3枚が条件どおり出る／隠れる。`全部`＋カテゴリなしで3件。
5. 一覧行は title・日付・カテゴリのみ（**プレビュー行なし**）。タップで詳細。
6. 詳細に戻る・title・日付・カテゴリ・MD 本文（例文→語彙／変化→中の説明が読める）。例文は 1.1em＋左ルール `#C9BA9A`。
7. UI 文言が §4 の日本語のみ。英語スローガン無し。
8. 色トークンが §5.1（page／raised／divider／ink／secondary／example-rule）。dim に opacity でコントラストを落とさない。
9. 本文 18px / 1.7。システムスタック。webfont 無し。
10. 320–430px で横スクロール無し。期間「全部」が 320 で切れない。タップ高 ≥44px（期間・カテゴリ開閉・チップ・解除・一覧行・戻る）。
11. desktop Chrome と iPhone WebKit（Safari・iOS Chrome）で 10 を満たす。
12. テキストコントラストおおむね 4.5:1 以上（本文・ラベル・dim チップ字）。
13. PREVIEW バッジあり。LIVE は Justin visual OK 後のみ。
14. 教材 MD 文言をデザイン／実装で書き換えない。
15. 静的 GitHub Pages。ログイン無し。

---

## 8. Handoff

| To | いつ | 何 |
|----|------|-----|
| Sua | いま | この `briefs/brief-momo-jp-v2.md`。Justin 決定反映済。 |
| Jessie | いま | 本 brief で PREVIEW を A+＋折りたたみに更新。`design-build-handoff` → preview tip 更新 → `pages-acceptance-proof`（320/360/390/430＋Chrome；WebKit 可能な範囲）→ 報告 Sua → Justin visual → LIVE。author: `justinksw-git-author` |
| Momo | 継続 | 新カードのみ。レイアウトは Celine brief 新版 |

**Jessie へ渡すパス（box）:**

- `/workspace/momo-jp/briefs/brief-momo-jp-v2.md` ← **この版を正**
- `/workspace/momo-jp/briefs/research-momo-jp-ui-v1.md`（根拠・任意）
- `/workspace/momo-jp/briefs/brief-momo-jp-v1.md`（IA・期間定義の継承）
- `/workspace/momo-jp/briefs/momo-jp-plan-v1.md`
- `/workspace/momo-jp/cards/2026/11/*.md`

Repo: `justinksw/momo-jp` · 現行 PREVIEW tip `6696934` · PR #1 系統を継続でよい。

**実装メモ（矛盾回避）:**

- v1 punch must-fix（dim `#5C5C5C` 相当 → v2 は secondary `#524C42`；期間 320 締め）は **維持したまま** A+ トークンへ寄せる。
- 折りたたみは CSS／小さな JS で可。状態は URL に残さなくてよい（v2）。
- 一覧プレビューは **入れない**（Justin 今回なし）。

---

## 9. Self-critique（v2）

- 折りたたみ初期閉じは発見性が下がる → 見出し「カテゴリで絞る」を常時出し＋選中露出で緩和（research どおり）。
- プレビュー無しは一覧が薄い可能性 → A+ の raised／divider で行の紙感を出す。次版でプレビューを足すなら brief-v3。
- 二次 `#524C42` on `#F5F0E6` は cream 上で余裕が薄い可能性 → 実装後コントラストを測り、足りなければ secondary を一段濃く（例 `#3F3A33`）して punch で報告。brief 改訂はそのとき。
- モック HTML 無し。ピクセルは PREVIEW punch 前提。
