# وش شعورك؟ — تجربة اليوم الوطني السعودي 96

تجربة تفاعلية للجمهور بمناسبة اليوم الوطني السعودي 96. يشاهد المتفاعل فيديو، ثم يسجّل مشاعره بصوته، وتظهر التسجيلات في صفحة مخصصة.

## التقنيات

- **React 18** + **TypeScript**
- **Vite** كأداة بناء
- **Tailwind CSS** للتصميم
- **lucide-react** للأيقونات
- **MediaRecorder API** للتسجيل الصوتي
- **Web Audio API** لموجة الصوت (Waveform)

## تشغيل المشروع

```bash
npm install
npm run dev
```

ثم افتح الرابط في المتصفح.

## بناء المشروع

```bash
npm run build
```

الملفات الناتجة في مجلد `dist/`.

## رفع المشروع على GitHub

```bash
git init
git add .
git commit -m "Initial commit: SND96 interactive experience"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

## هيكل المشروع

```
src/
  components/    مكونات قابلة لإعادة الاستخدام
  pages/         الصفحات (الرئيسية + التسجيلات)
  hooks/         React hooks (التسجيل الصوتي + التسجيلات)
  services/      طبقة API (mock حاليًا، جاهزة للـbackend)
  types/         تعريفات الأنواع
  utils/         دوال مساعدة
  config.ts      إعدادات التطبيق (رابط الفيديو، المفاتيح)
  App.tsx        المكون الرئيسي
```

## تغيير رابط الفيديو

افتح `src/config.ts` وغيّر قيمة `VIDEO_URL`:

```typescript
export const VIDEO_URL = 'https://your-video-url.mp4';
```

## تغيير الهوية / الأصول

- الألوان معرفة في `tailwind.config.js` تحت `snd` (الأخضر السعودي) و`gold` و`sand`.
- الخطوط: `Tajawal` للعناوين و`IBM Plex Sans Arabic` للنصوص — محمّلة من Google Fonts في `index.html`.
- الشعار في `src/components/SNDLogo.tsx`.
- العناصر الزخرفية في `src/components/Decorations.tsx`.

## API Contract للـBackend

الواجهة جاهزة للربط مع backend. طبقة API في `src/services/recordingsService.ts` — استبدل الـmock بندوات HTTP حقيقية.

### الأنواع المتوقعة

```typescript
interface Recording {
  id: string;
  audioUrl: string;
  duration: number;       // بالثواني
  createdAt: string;      // ISO timestamp
  sessionId: string;     // معرّف مجهول
  status: 'saved' | 'uploading' | 'failed';
}

interface RecordingStats {
  participantsCount: number;
  recordingsCount: number;
}
```

### Endpoints المقترحة

| Method | Endpoint              | الوصف                        | Body / Response                          |
|--------|-----------------------|------------------------------|------------------------------------------|
| GET    | `/api/recordings`     | جلب جميع التسجيلات           | `Recording[]`                            |
| GET    | `/api/stats`          | جلب الإحصائيات               | `RecordingStats`                         |
| POST   | `/api/recordings`     | رفع تسجيل جديد               | `multipart/form-data` → `Recording`      |
| DELETE | `/api/recordings/:id` | حذف تسجيل واحد               | `void`                                   |
| DELETE | `/api/recordings`     | حذف جميع التسجيلات           | `void`                                   |

### شكل طلب رفع التسجيل

```
POST /api/recordings
Content-Type: multipart/form-data

Fields:
  audio:      [audio file blob]   // ملف الصوت
  duration:   number               // المدة بالثواني
  sessionId:  string              // معرّف مجهول للمتفاعل
```

### شكل JSON المتوقع من الـBackend

```json
// GET /api/recordings
[
  {
    "id": "abc123",
    "audioUrl": "https://cdn.example.com/recordings/abc123.webm",
    "duration": 83,
    "createdAt": "2026-09-23T10:30:00.000Z",
    "sessionId": "p_xyz789",
    "status": "saved"
  }
]

// GET /api/stats
{
  "participantsCount": 128,
  "recordingsCount": 128
}
```

## الأمان والخصوصية

- التسجيلات **مجهولة** بالكامل — لا يتم جمع أسماء أو معلومات شخصية.
- كل متفاعل يحصل على `sessionId` عشوائي مخزّن في `sessionStorage`.
- صفحة التسجيلات مخصصة للعرض فقط، ويمكن لاحقًا إضافة `/admin` مع مصادقة.

## ملاحظات تقنية

- التسجيل الصوتي يستخدم `MediaRecorder API` مع جمع الـchunks بشكل تدريجي لدعم التسجيل الطويل.
- `Pause` لا يحذف الصوت المسجل — يستخدم `MediaRecorder.pause()/resume()`.
- لا يوجد حد زمني للتسجيل.
- عند العودة للصفحة الرئيسية يتم تنظيف جميع الحالات (التسجيل، الفيديو، المؤقت) لتجربة شخص جديد.
- الواجهة بالكامل RTL وعربية.
- تدعم اللمس (Touch-friendly) ومناسبة للأجهزة في الفعاليات (Kiosk Mode).
