# CLAUDE.md — Xóm Làm Crypto · Remotion Clip Editor

> File này Claude Code tự đọc khi mở project. Đây là toàn bộ rule cứng cho mỗi lần edit clip.

---

## 🎬 TỔNG QUAN

Template video 9:16 (1080×1920), 40 giây, dùng Remotion.
Mỗi clip là 1 bản tin crypto ngắn — crawl chủ đề mới → chỉ edit `src/config.ts` là ra clip mới.
**Tuyệt đối không đổi design, layout, animation, màu sắc.**

---

## 🔒 RULE CỐ ĐỊNH — KHÔNG ĐƯỢC BỎ QUA

### 1. MỞ ĐẦU (Scene SIntro — `d.intro` + `d.hook`)

Câu chào cứng, không được thay:

```
"Hế lô các vợ trong xóm làm c! rypto na, mình là Uyên.
Hôm nay mình sẽ nói về [CHỦ ĐỀ CRAWL ĐƯỢC]."
```

Map vào config:
```ts
intro: {
  hi: 'Hế lô các vợ trong xóm!',           // hiện to trên màn hình
  sub: 'Mình là',
  role: '[CHỦ ĐỀ HÔM NAY — 1 dòng ngắn]',  // kicker dưới cùng intro
},
hook: {
  top: 'HÔM NAY MÌNH NÓI VỀ',
  big: ['[TỪ KHOÁ 1]', '[TỪ KHOÁ 2]'],      // 2 dòng chữ to trên scene hook
  ...
}
```

### 2. KẾT CLIP (Scene SOutro — `d.outro`)

Câu kết cứng, không được thay:

```
"Cảm ơn mọi người đã nghe,
ai chưa tham gia vào xóm làm crypto thì đừng quên nhá!"
```

Map vào config:
```ts
outro: {
  big: ['Cảm ơn mọi người', 'đã nghe! 🙏'],
  cta: 'THAM GIA XÓM LÀM CRYPTO',
  bye: 'Ai chưa vào xóm thì đừng quên nhá!',
},
```

### 3. GIỌNG ĐIỆU — VUI VẺ 100%

- Tất cả text phải nghe vui, nhẹ nhàng, gần gũi như đang chat với bạn
- KHÔNG dùng từ nặng nề: "sụp đổ", "thảm họa", "nguy hiểm" — thay bằng: "đỏ lửa", "rung lắc nhẹ", "thị trường hơi nhát"
- Insight/quote luôn tích cực hoặc trung lập — không bi quan
- `d.insight.quote` phải kết thúc bằng góc nhìn lạc quan

### 4. THỜI LƯỢNG — ĐÚNG 40 GIÂY

Timeline trong `src/Video.tsx` (KHÔNG được sửa file này):
```
SIntro   4s | SHook    5s | SStat    4s
SSource  4s | SChart   5s | SReasons 5s
SInsight 4s | SFlows   5s | SOutro   4s
                              TỔNG = 40s ✅
```
Nếu muốn thêm/bớt nội dung → gói vào scene đang có, KHÔNG thêm scene mới.

---

## ✏️ CHỈ ĐƯỢC SỬA: `src/config.ts`

Mỗi lần ra clip mới, chỉ update các field sau theo chủ đề crawl được:

```ts
export const CONFIG = {
  brand: {
    name: 'Xóm Làm Crypto',
    host: 'Tú Uyên',
    handle: '@xomlamcrypto',
    ep: 'TẬP [SỐ]',           // ← tăng số tập mỗi clip
  },

  intro: {
    hi: 'Hế lô các vợ trong xóm!',
    sub: 'Mình là',
    role: '[CHỦ ĐỀ HÔM NAY]', // ← thay theo tin
  },

  hook: {
    top: 'HÔM NAY MÌNH NÓI VỀ',
    big: ['[TỪ KHOÁ 1]', '[TỪ KHOÁ 2]'], // ← 2 dòng chữ to
    cards: [
      ['01', '[ĐIỂM TIN 1]', 'sky'],
      ['02', '[ĐIỂM TIN 2]', 'butter'],
      ['03', '[ĐIỂM TIN 3]', 'lilac'],
    ],
    note: 'Lướt hết video để xóm mình nắm trong 40 giây nha!',
  },

  stat: {
    label: '[TÊN CHỈ SỐ · KHUNG GIỜ]', // vd: 'GIÁ BITCOIN · 24 GIỜ'
    value: '[GIÁ]',                      // vd: '65.220'
    unit: 'USD',
    delta: '[% THAY ĐỔI]',              // vd: '1,0%'
    dir: 'down' | 'up',                  // ← đổi theo xu hướng
    ghost: '[TICKER]',                   // vd: 'BTC'
    spark: [/* 8 điểm số float */],      // ← dữ liệu sparkline
  },

  source: {
    tag: 'DẪN NGUỒN',
    title: '[TIÊU ĐỀ MAN TÍNH GỌN]',   // vd: 'Báo chí nói gì?'
    outlet: '[TÊN BÁO]',               // vd: 'vnexpress.net'
    date: '[DD.MM.YYYY]',
    kind: 'clip' | 'image',
    time: '[0:XX]',                     // thời lượng clip báo nếu có
    caption: '"[TRÍCH DẪN TỪ BÀI BÁO]"',
    credit: 'Ảnh / clip: [TÊN BÁO]',
    src: '',                            // ← gán staticFile('...') nếu có file
  },

  chart: {
    title: '[TIÊU ĐỀ BIỂU ĐỒ]',       // vd: 'Diễn biến 24 giờ'
    sub: 'NGUỒN · [SÀN/NGUỒN]',
    type: 'area' | 'line',
    color: 'var(--down)' | 'var(--up)' | 'var(--violet)',
    data: [/* 10 điểm số */],
    foot: '[GHI CHÚ CUỐI BIỂU ĐỒ]',
  },

  reasons: {
    title: ['[ĐỘNG TỪ/CÂU HỎI]', '[CHỦ THỂ]'], // vd: ['Vì sao', 'đỏ lửa?']
    items: [
      ['01', '[LÝ DO 1 — NGẮN]', '[GIẢI THÍCH 1 — 1 câu]', 'sky'],
      ['02', '[LÝ DO 2 — NGẮN]', '[GIẢI THÍCH 2 — 1 câu]', 'butter'],
      ['03', '[LÝ DO 3 — NGẮN]', '[GIẢI THÍCH 3 — 1 câu]', 'mint'],
    ],
  },

  insight: {
    ghost: 'GÓC NHÌN',
    quote: ['[DÒNG 1 — lạc quan]', '[DÒNG 2 — kết luận tích cực]'],
    body: '[1-2 câu phân tích, giọng vui, không bi quan]',
  },

  flows: {
    title: '[TIÊU ĐỀ BẢNG]',           // vd: 'Top giảm 24h' hoặc 'Top tăng 24h'
    bars: [
      ['[TICKER]', '[+/−X,X%]', [chiều cao 20-100], '[màu]'],
      // thêm 3-5 dòng
    ],
    foot: '[GHI CHÚ]',
  },

  outro: {
    big: ['Cảm ơn mọi người', 'đã nghe! 🙏'],   // ← KHÔNG THAY
    cta: 'THAM GIA XÓM LÀM CRYPTO',              // ← KHÔNG THAY
    bye: 'Ai chưa vào xóm thì đừng quên nhá!',   // ← KHÔNG THAY
  },
};
```

---

## 🖼️ CHÈN ẢNH / CLIP TỪ NGUỒN BÁO

Scene `SSource` có sẵn khung `SourceMedia` để chèn:

**Chèn ảnh:**
```ts
source: {
  kind: 'image',
  src: staticFile('news-image.png'), // đặt file vào /public/
  ...
}
```

**Chèn clip từ báo:**
```ts
source: {
  kind: 'clip',
  src: staticFile('news-clip.mp4'),  // đặt file vào /public/
  time: '0:14',                       // thời lượng clip
  ...
}
```

Nếu chưa có file → để `src: ''`, sẽ hiện placeholder tự động.

---

## 🎨 DESIGN — KHÔNG ĐƯỢC SỬA

| Thứ | Rule |
|-----|------|
| Màu sắc | Giữ nguyên toàn bộ CSS variables trong `styles.css` |
| Font | Be Vietnam Pro + Space Mono — không thêm font khác |
| Layout các scene | Không dịch chuyển vị trí elements |
| Animation | `fadeUp`, `fadeIn`, `popIn`, `countUp` — giữ nguyên, chỉ có thể chỉnh `delay` nếu cần |
| Transition giữa scene | Remotion `<Series>` tự cắt cảnh — không thêm transition component khác |
| HostArch / HostCut | Ảnh host Tú Uyên, giữ nguyên `staticFile('host-tuuyen.jpg')` |
| `Stage` bg | Chỉ `"paper"` hoặc `"violet"` — pattern đã được thiết kế sẵn cho từng scene |

---

## ⚡ ANIMATION & EFFECT CÓ SẴN

Tất cả hiệu ứng đã có trong `src/lib/anim.ts`:

```ts
fadeUp(frame, start, dur, dist)   // trượt lên + fade in
fadeIn(frame, start, dur)          // chỉ fade in
popIn(frame, fps, start, extra)    // bật vào spring + có thể thêm rotate/translate
countUp(frame, to, start, dur)     // đếm số tăng dần (dùng cho SStat)
revealProgress(frame, start, dur)  // 0→1 cho vẽ chart
```

Điều chỉnh được: `start` (frame bắt đầu), `dur` (số frame). Không tạo animation mới.

**Chart:**
- `type: 'area'` → đường giá fill gradient, vẽ trái→phải
- `type: 'line'` → đường giá không fill
- `type: 'bars'` → cột mọc dần từ trái, stagger tự động

**Màu chart theo xu hướng:**
```ts
color: 'var(--down)'    // đỏ — thị trường giảm
color: 'var(--up)'      // xanh — thị trường tăng
color: 'var(--violet)'  // tím — trung lập / altcoin
```

---

## 📋 CHECKLIST TRƯỚC KHI RENDER

- [ ] `ep` đã tăng số tập
- [ ] `intro.hi` = "Hế lô các vợ trong xóm!" (cứng)
- [ ] `outro.bye` = "Ai chưa vào xóm thì đừng quên nhá!" (cứng)
- [ ] `outro.cta` = "THAM GIA XÓM LÀM CRYPTO" (cứng)
- [ ] `stat.dir` đúng với xu hướng thực (up/down)
- [ ] `chart.color` khớp với `stat.dir`
- [ ] `insight.quote` kết thúc bằng câu lạc quan
- [ ] Tổng giây TIMELINE trong Video.tsx vẫn = 40s
- [ ] Không sửa file nào ngoài `config.ts`
- [ ] Nếu có ảnh/clip báo → đặt vào `/public/` và gán `src`

---

## 🚀 LỆNH NHANH

```bash
# Preview
npm run dev

# Render ra mp4
npx remotion render CryptoReel out/clip-[tap-số].mp4
```

---

*Mọi thắc mắc về design system → đọc `src/styles.css` và `src/lib/parts.tsx`.*
*Mọi thay đổi content → chỉ cần sửa `src/config.ts`.*
