export interface ColleagueProfile {
  id: string;
  username: string;
  fullName: string;
  title: string;
  age: number;
  avatarUrl: string;
  degree: string;
  university: string;
  medicalCouncilNumber: string;
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  specialties: string[];
  bio: string;
  officeAddress: string;
  phone: string;
  email: string;
}

export interface ReviewItem {
  id: string;
  clientName: string;
  rating: number;
  date: string;
  topic: string;
  comment: string;
  response?: string;
}

export interface ClientHistoryItem {
  id: string;
  clientName: string;
  clientPhone: string;
  totalSessions: number;
  lastSessionDate: string;
  consultationTopic: string;
  type: 'in_person' | 'online'; // حضوری یا آنلاین
  notes: string;
  status: 'completed' | 'active' | 'archived';
}

export interface UpcomingAppointment {
  id: string;
  clientName: string;
  clientPhone: string;
  type: 'in_person' | 'online'; // حضوری یا آنلاین
  date: string; // تاریخ
  time: string; // ساعت
  topic: string; // موضوع جلسه
  status: 'confirmed' | 'pending';
  meetingLink?: string;
  notes?: string;
}

export const DEFAULT_COLLEAGUES: Record<string, ColleagueProfile> = {
  dr_tehrani: {
    id: 'psych-001',
    username: 'dr_tehrani',
    fullName: 'دکتر مریم تهرانی',
    title: 'متخصص روان‌شناسی بالینی و طرح‌واره درمانی',
    age: 38,
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-818a4d4554b2?auto=format&fit=crop&q=80&w=400',
    degree: 'دکتری تخصصی روان‌شناسی بالینی',
    university: 'دانشگاه تهران',
    medicalCouncilNumber: 'ن-۴۵۸۹۲',
    yearsOfExperience: 12,
    rating: 4.9,
    reviewCount: 142,
    specialties: ['درمان اضطراب و افسردگی', 'طرح‌واره درمانی', 'مشاوره فردی', 'مدیریت استرس'],
    bio: 'عضو هیئت علمی دانشگاه و درمانگر ارشد با بیش از ۱۲ سال سابقه بالینی در حوزه درمان‌های شناختی-رفتاری (CBT) و طرح‌واره درمانی. دارنده گواهینامه‌های بین‌المللی روان‌درمانی.',
    officeAddress: 'تهران، خیابان ولیعصر، بالاتر از پارک وی، ساختمان پزشکان پناه، طبقه ۴',
    phone: '021-88992211',
    email: 'dr.tehrani@panah.psych',
  },
  dr_alavi: {
    id: 'psych-002',
    username: 'dr_alavi',
    fullName: 'دکتر علی علوی',
    title: 'متخصص روان‌پزشکی و زوج‌درمانی',
    age: 44,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    degree: 'تخصص روان‌پزشکی (بورد تخصصی)',
    university: 'دانشگاه علوم پزشکی شهید بهشتی',
    medicalCouncilNumber: 'ن-۳۸۴۰۱',
    yearsOfExperience: 15,
    rating: 4.8,
    reviewCount: 98,
    specialties: ['زوج درمانی', 'مشاوره پیش از ازدواج', 'دارودرمانی روان‌پزشکی', 'اختلالات خلق و خو'],
    bio: 'روان‌پزشک و زوج‌درمانگر با ۱۵ سال سابقه فعالیت در کلینیک‌های تخصصی. متخصص در حل تعارضات زناشویی، مشاوره تخصصی خانواده و درمان اختلالات با رویکرد تلفیقی.',
    officeAddress: 'تهران، میدان ونک، خیابان ملاصدرا، پلاک ۶۴، واحد ۲',
    phone: '021-88771122',
    email: 'dr.alavi@panah.psych',
  },
};

export const INITIAL_REVIEWS: Record<string, ReviewItem[]> = {
  dr_tehrani: [
    {
      id: 'rev-1',
      clientName: 'سارا م.',
      rating: 5,
      date: '۱۴ مرداد ۱۴۰۳',
      topic: 'درمان اضطراب فراگیر و حملات پانیک',
      comment: 'خانم دکتر تهرانی فوق‌العاده صبور، حرفه‌ای و با درک بالا هستند. بعد از ۶ جلسه درمان CBT توانستم استرس شغلی و حملات اضطرابی شدیدم را کاملاً کنترل کنم.',
      response: 'ممنون از اعتماد شما سارای عزیز، خوشحالم که مسیر بهبودی را با موفقیت طی کردید.',
    },
    {
      id: 'rev-2',
      clientName: 'محمدعلی ک.',
      rating: 5,
      date: '۲۸ تیر ۱۴۰۳',
      topic: 'طرح‌واره درمانی و توسعه فردی',
      comment: 'راهکارهای ایشان کاملاً کاربردی و علمی است. محیط جلسه حس امنیت بسیار زیادی می‌دهد و بدون قضاوت به صحبت‌ها گوش می‌دهند.',
    },
    {
      id: 'rev-3',
      clientName: 'زهرا پ.',
      rating: 4.8,
      date: '۱۰ تیر ۱۴۰۳',
      topic: 'مدیریت استرس و افسردگی خفیف',
      comment: 'بسیار با مهارت و وقت‌شناس هستند. جلسات آنلاین ایشان از کیفیت بسیار بالایی برخوردار بود و راهکارهای هفتگی عالی دادند.',
    },
    {
      id: 'rev-4',
      clientName: 'امیرحسین ر.',
      rating: 5,
      date: '۲۵ خرداد ۱۴۰۳',
      topic: 'مشاوره فردی و تقویت عزت‌نفس',
      comment: 'تجربه بسیار عالی. راهنمایی‌های دقیق و تخصصی که باعث شد نگرش من به مسائل زندگی کاملاً تغییر کند.',
    },
  ],
  dr_alavi: [
    {
      id: 'rev-5',
      clientName: 'نرگس و رضا',
      rating: 5,
      date: '۵ مرداد ۱۴۰۳',
      topic: 'زوج‌درمانی و بهبود روابط زناشویی',
      comment: 'آقای دکتر علوی کمک بزرگ و ماندگاری به زندگی مشترک ما کردند. دیدگاه بی‌طرفانه و روش حل مسئله دقیق ایشان بی‌نظیر بود.',
    },
    {
      id: 'rev-6',
      clientName: 'کامران ش.',
      rating: 4.7,
      date: '۱۸ تیر ۱۴۰۳',
      topic: 'درمان اختلال خواب و استرس',
      comment: 'ایشان با صبوری کامل دوز دارویی و روند درمان من را تنظیم کردند و بعد از ۲ ماه بهبود کامل پیدا کردم.',
    },
  ],
};

export const INITIAL_CLIENT_HISTORY: Record<string, ClientHistoryItem[]> = {
  dr_tehrani: [
    {
      id: 'hist-101',
      clientName: 'مهدی کشاورز',
      clientPhone: '09123456789',
      totalSessions: 10,
      lastSessionDate: '۱۴ مرداد ۱۴۰۳',
      consultationTopic: 'درمان اختلال اضطراب اجتماعی و وسواس فکری',
      type: 'in_person',
      notes: 'دوره ۱۰ جلسه‌ای CBT تکمیل شد. علائم اضطراب به سطح حداقل رسیده است. توصیه به پایش دوره‌ای ۶ ماهه.',
      status: 'completed',
    },
    {
      id: 'hist-102',
      clientName: 'مریم حسینی',
      clientPhone: '09129876543',
      totalSessions: 8,
      lastSessionDate: '۰۲ مرداد ۱۴۰۳',
      consultationTopic: 'طرح‌واره درمانی (طرح‌واره رهاشدگی)',
      type: 'online',
      notes: 'پیشرفت محسوس در شناسایی ذهنیت‌های طرح‌واره‌ای. تمرینات تکنیک‌های صندلی خالی و بازوالدگری تجسمی داده شد.',
      status: 'active',
    },
    {
      id: 'hist-103',
      clientName: 'نیلوفر ابراهیمی',
      clientPhone: '09351112233',
      totalSessions: 12,
      lastSessionDate: '۲۰ تیر ۱۴۰۳',
      consultationTopic: 'درمان افسردگی اساسی (MDD)',
      type: 'in_person',
      notes: 'پروتکل فعال‌سازی رفتاری و شناختی پیاده‌سازی گردید. بهبودی کامل خلقی و بازگشت به فعالیت شغلی.',
      status: 'completed',
    },
    {
      id: 'hist-104',
      clientName: 'سینا صادقی',
      clientPhone: '09194445566',
      totalSessions: 5,
      lastSessionDate: '۰۵ تیر ۱۴۰۳',
      consultationTopic: 'مدیریت استرس شغلی و فرسودگی روان',
      type: 'online',
      notes: 'تکنیک‌های تنظیم هیجان و مرزبندی شغلی آموزش داده شد. جلسات با موفقیت پایان یافت.',
      status: 'completed',
    },
  ],
  dr_alavi: [
    {
      id: 'hist-201',
      clientName: 'فرهاد و مهتاب',
      clientPhone: '09125556677',
      totalSessions: 6,
      lastSessionDate: '۱۰ مرداد ۱۴۰۳',
      consultationTopic: 'زوج درمانی و حل تعارضات ارتباطی',
      type: 'in_person',
      notes: 'بهبود پروتکل ارتباطی و کاهش صدمات عاطفی. ادامه جلسات جهت تثبیت الگوهای گفت‌وگو.',
      status: 'active',
    },
  ],
};

export const INITIAL_UPCOMING_APPOINTMENTS: Record<string, UpcomingAppointment[]> = {
  dr_tehrani: [
    {
      id: 'app-201',
      clientName: 'الهام سعادتی',
      clientPhone: '09121112233',
      type: 'in_person', // حضوری
      date: 'یکشنبه ۲۶ مرداد ۱۴۰۳',
      time: '۱۶:۰۰ الی ۱۷:۰۰',
      topic: 'مشاوره فردی - پیگیری درمان اضطراب',
      status: 'confirmed',
      notes: 'جلسه چهارم درمان - مراجعه حضوری به مطب پارک وی',
    },
    {
      id: 'app-202',
      clientName: 'کیوان رضایی',
      clientPhone: '09358889900',
      type: 'online', // آنلاین
      date: 'دوشنبه ۲۷ مرداد ۱۴۰۳',
      time: '۱۸:۳۰ الی ۱۹:۳۰',
      topic: 'طرح‌واره درمانی و خودشناسی',
      status: 'confirmed',
      meetingLink: 'https://panah.psych/room/dr-tehrani-live-202',
      notes: 'جلسه دوم آنلاین - ارسال لینک ویدیوکنفرانس',
    },
    {
      id: 'app-203',
      clientName: 'شیرین طاهری',
      clientPhone: '09193334455',
      type: 'in_person', // حضوری
      date: 'چهارشنبه ۲۹ مرداد ۱۴۰۳',
      time: '۱۱:۰۰ الی ۱۲:۰۰',
      topic: 'ارزیابی اولیه و سنجش علائم اضطرابی',
      status: 'confirmed',
      notes: 'نوبت جدید رزرو شده - مراجعه حضوری',
    },
    {
      id: 'app-204',
      clientName: 'فرزاد نوری',
      clientPhone: '09127778899',
      type: 'online', // آنلاین
      date: 'شنبه ۱ شهریور ۱۴۰۳',
      time: '۱۵:۰۰ الی ۱۶:۰۰',
      topic: 'مدیریت استرس امتحانات و تمرکز',
      status: 'pending',
      meetingLink: 'https://panah.psych/room/dr-tehrani-live-204',
      notes: 'جلسه آنلاین - در انتظار تأیید اولیه فیش',
    },
  ],
  dr_alavi: [
    {
      id: 'app-301',
      clientName: 'رضا و پروانه',
      clientPhone: '09124441122',
      type: 'in_person', // حضوری
      date: 'یکشنبه ۲۶ مرداد ۱۴۰۳',
      time: '۱۷:۳۰ الی ۱۸:۳۰',
      topic: 'مشاوره زوجی پیش از ازدواج',
      status: 'confirmed',
      notes: 'مراجعه حضوری مطب ونک',
    },
    {
      id: 'app-302',
      clientName: 'بهرام محمدی',
      clientPhone: '09362223344',
      type: 'online', // آنلاین
      date: 'سه‌شنبه ۲۸ مرداد ۱۴۰۳',
      time: '۲۰:۰۰ الی ۲۱:۰۰',
      topic: 'مشاوره دارویی و تنوع خلق',
      status: 'confirmed',
      meetingLink: 'https://panah.psych/room/dr-alavi-live-302',
    },
  ],
};
