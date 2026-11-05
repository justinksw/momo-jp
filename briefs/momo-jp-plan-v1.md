# momo-jp plan v1（locked）

Justin OK 2026-11-05. Daisy coop 2026-11-05.

- Repo: `justinksw/momo-jp`（公開）
- Pages: `https://justinksw.github.io/momo-jp/`
- 読者: Justin 自分用の勉強メモ（公開でも自分優先）
- カード言語: 日＋中（Momo の教え方）
- 報告先: 常に Sua

## 役割・handoff順

1. **Sua** — この設計メモ／窓口／調整（ここまで書いたら各人へ）
2. **Momo** — 学習カードの中身のみ（デザイン・Pages は触らない）
3. **Celine** — UI／レイアウト（メモの IA ＋ Momo のカード形を受けて）。コードは書かない。`design-build-handoff` → Jessie
4. **Jessie** — 実装・GitHub Pages（preview → acceptance → live）。`pages-preview-live` / `pages-acceptance-proof` / `justinksw-git-author`

同時渡し: メモ完成 → **Momo「中身」＋ Celine「メモ＋中身の形待ち」** → Momo 完了後 Celine 本着手 → Celine 完了後 Jessie。詰まったら Daisy に 1 件だけ。

コードもカードも **同じ 1 リポ**。

このメモに書かないもの: ピクセル／ビジュアル → Celine。実装・Pages 設定 → Jessie。教材の中身そのもの → Momo。

## カテゴリ（複数タグ OK）

スラッグ固定:

`vocabulary` · `grammar` · `fun-fact` · `history` · `society` · `culture` · `food` · `living` · `travel` · `fashion`

必須: 作成日 `date: YYYY-MM-DD`。1 カードに 1 つ以上のカテゴリ。

運用: Justin／Sua が「今日のカード」と頼んだ日は、**項目ごと複数枚**（語彙・文法などを分けて）。1 日 1 巨大カードにしない。

## カードのデータ形（Momo が埋める欄）

1 Markdown ファイル = 1 カード。

パス案: `cards/YYYY/MM/YYYY-MM-DD--short-slug.md`

```yaml
---
title: 短い見出し（日、または 日＋短い中）
date: 2026-11-05
categories: [vocabulary, living]
---
```

| 欄 | 必須 | 誰 | メモ |
|----|------|-----|------|
| `title` | ✓ | Momo | 短く。リストに出る |
| `date` | ✓ | Momo | 作成日。フィルタ用 |
| `categories` | ✓ | Momo | 上のスラッグのみ。配列 |
| 本文 | ✓ | Momo | 日の例文＋中の説明。先輩口調。短く |

任意（後で足してよい）: `slug`（ファイル名と違うとき）, `related`（他カード id）— v1 必須ではない。

## サイトの絞り込み（IA）

必須:

- 日／週／月／年
- カテゴリ（単一・複数組み合わせ）
- 一覧 → カードを開く

モバイル優先・静的サイト。カード＝データ、ページ＝表示。

## UI 文言ルール（AI っぽい禁止）

全部自然な言葉。UI もカード本文も。

やってよい例:

- 「今日」「今週」「語彙」「文法」「全部」「戻る」
- 「2026年11月」「カテゴリで絞る」

やらない例:

- 「Explore your learning journey」「Unlock insights」「Dive into」
- 「AIが厳選」「スマート学習」「パーソナライズされた体験」
- 教科書すぎる敬語の羅列、英語スローガンだけのヘッダー

トーン: シンプル勉強メモ。Justin が自分で見返すノート。Celine／Jessie はラベルを短く人間っぽく。

## 成功条件（Done）

| 段階 | Done |
|------|------|
| Sua メモ | この v1 locked。Daisy 順反映。各人へ渡し済み |
| Momo | カード規約に沿った **サンプル 2〜3 枚**（本物の先輩トーン）＋必要なら本文テンプレ短文。報告 → Sua |
| Celine | hub／カード／フィルタのレイアウト brief（シンプルメモ）。報告 → Sua → Jessie へ design-build-handoff |
| Jessie PREVIEW | リポ作成、サンプル表示、日／週／月／年／カテゴリ絞り込み動く、PREVIEW バッジ。acceptance 証明。報告 → Sua |
| Justin visual OK | 見た目・絞り込み OK の一声 |
| Jessie LIVE | PREVIEW 外し、main で `justinksw.github.io/momo-jp/` 公開。報告 → Sua |
| 継続 | 「今日のカード」→ Momo 作成 → 同リポに入れる（Jessie または合意パス） |

## v1 外

ログイン／進捗、クイズ・SRS、Momo 以外の著者、独自ドメイン。
