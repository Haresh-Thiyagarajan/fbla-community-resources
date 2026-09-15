/* ==========================================================================
   Common Ground: shared JavaScript (js/app.js)
   Loaded in the <head> of every page. Plain JavaScript, no libraries,
   no network requests, so the site works fully offline.

   Contents
     1. Session-safe storage (falls back to memory if storage is blocked)
     2. Display settings: dark mode + larger text (applied immediately)
     3. Sample data: categories, need tags, resources, events
        EDIT HERE to swap in real organizations and events.
     4. Shared helpers
     5. Shared UI: icon sprite, display buttons, mobile menu
     6. Page: Home
     7. Page: Browse resources
     8. Page: Events calendar
     9. Page: Get help
    10. Start-up
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');


  /* 1. SESSION-SAFE STORAGE -------------------------------------------------
     Uses sessionStorage when the browser allows it, so settings and bookmarks
     carry between pages during a demo. If storage is blocked (some browsers
     block it for files opened from disk), everything still works from memory
     on the current page. Nothing is kept after the browser tab is closed. */
  var memoryStore = {};
  var store = {
    get: function (key, fallback) {
      try {
        var raw = window.sessionStorage.getItem('cg-' + key);
        if (raw !== null) return JSON.parse(raw);
      } catch (e) { /* storage unavailable: use memory */ }
      return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : fallback;
    },
    set: function (key, value) {
      memoryStore[key] = value;
      try {
        window.sessionStorage.setItem('cg-' + key, JSON.stringify(value));
      } catch (e) { /* storage unavailable: memory copy is enough */ }
    }
  };


  /* 2. DISPLAY SETTINGS -----------------------------------------------------
     Applied before the page paints to avoid a flash of the wrong theme. */
  function systemPrefersDark() {
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  }

  var prefs = {
    theme: store.get('theme', null) || (systemPrefersDark() ? 'dark' : 'light'),
    text: store.get('text', 'normal')
  };

  function applyPrefs() {
    root.setAttribute('data-theme', prefs.theme);
    root.setAttribute('data-text', prefs.text);
    root.style.colorScheme = prefs.theme;
    var themeBtn = document.getElementById('theme-toggle');
    var textBtn = document.getElementById('text-toggle');
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(prefs.theme === 'dark'));
    if (textBtn) textBtn.setAttribute('aria-pressed', String(prefs.text === 'large'));
  }
  applyPrefs();


  /* 3. SAMPLE DATA ----------------------------------------------------------
     All listings are fictional placeholders for "Maple Valley".
     Phone numbers use the 555-01XX range reserved for fiction.            */

  // Six resource categories. The Home page cards link to these ids.
  var CATEGORIES = [
    { id: 'clinics',   name: 'Clinics & medical care',       hint: 'Check-ups, dental care, vaccines',         icon: 'i-clinic',    tint: 'berry' },
    { id: 'mental',    name: 'Mental health',                hint: 'Counseling, support groups, crisis help',  icon: 'i-mental',    tint: 'sky' },
    { id: 'food',      name: 'Food security',                hint: 'Pantries, free meals, groceries',          icon: 'i-food',      tint: 'leaf' },
    { id: 'seniors',   name: 'Senior & disability services', hint: 'Rides, meals, independent living',         icon: 'i-seniors',   tint: 'sky' },
    { id: 'education', name: 'Health education',             hint: 'Classes, nutrition, coverage help',        icon: 'i-education', tint: 'berry' },
    { id: 'family',    name: 'Jobs & child care',            hint: 'Job training, child care, family support', icon: 'i-family',    tint: 'leaf' }
  ];

  // Need-type tags used by the directory filters and the Get Help flow.
  var TAGS = [
    { id: 'free',        label: 'Free' },
    { id: 'sliding',     label: 'Sliding-scale fees' },
    { id: 'noinsurance', label: 'No insurance needed' },
    { id: 'walkin',      label: 'Walk-ins welcome' },
    { id: 'spanish',     label: 'Spanish spoken' },
    { id: 'virtual',     label: 'Phone or video option' },
    { id: 'evenings',    label: 'Evening or weekend hours' },
    { id: 'transport',   label: 'Transportation help' }
  ];

  // Resource directory entries (18). "keywords" only helps search matching.
  var RESOURCES = [
    {
      id: 'mvchc', category: 'clinics', name: 'Maple Valley Community Health Center',
      desc: 'Primary care, dental cleanings, and prenatal visits for all ages. Fees are based on household income.',
      tags: ['sliding', 'noinsurance', 'spanish', 'evenings'],
      phone: '(555) 555-0101', email: 'appointments@mvchc.example', address: '410 Cedar Avenue, Maple Valley',
      hours: 'Mon–Fri 8 AM–7 PM, Sat 9 AM–1 PM', keywords: 'doctor dentist dental pregnancy checkup medical'
    },
    {
      id: 'riverside-free', category: 'clinics', name: 'Riverside Free Clinic',
      desc: 'Volunteer doctors and nurses see patients without insurance for everyday illnesses and prescriptions.',
      tags: ['free', 'walkin', 'noinsurance'],
      phone: '(555) 555-0102', email: 'info@riversidefreeclinic.example', address: '88 River Road, Maple Valley',
      hours: 'Tue & Thu 5 PM–9 PM', keywords: 'free clinic doctor sick prescription medicine'
    },
    {
      id: 'health-van', category: 'clinics', name: 'Valley Mobile Health Van',
      desc: 'A clinic on wheels offering blood pressure checks, flu shots, and vaccines at schools and parks.',
      tags: ['free', 'walkin', 'spanish'],
      phone: '(555) 555-0103', email: 'van@valleyhealth.example', address: 'Rotating stops, schedule by phone',
      hours: 'Weekdays 10 AM–3 PM', keywords: 'vaccine flu shot screening immunization mobile'
    },
    {
      id: 'harbor-counseling', category: 'mental', name: 'Harbor Counseling Collective',
      desc: 'Licensed therapists for individuals, couples, and teens, with in-person or video sessions.',
      tags: ['sliding', 'virtual', 'evenings', 'spanish'],
      phone: '(555) 555-0104', email: 'care@harborcounseling.example', address: '22 Harbor Street, Suite 3, Maple Valley',
      hours: 'Mon–Thu 9 AM–8 PM, Sat 10 AM–2 PM', keywords: 'therapy therapist counseling anxiety depression teen'
    },
    {
      id: 'warmline', category: 'mental', name: 'Maple Valley Support Warmline',
      desc: 'Talk with a trained peer when you feel stressed or alone. For a crisis, call or text 988 any time.',
      tags: ['free', 'virtual', 'evenings'],
      phone: '(555) 555-0105', email: 'warmline@mvsupport.example', address: 'Phone and text only',
      hours: 'Every day 4 PM–midnight', keywords: 'talk listen lonely stress peer phone line'
    },
    {
      id: 'open-door', category: 'mental', name: 'Open Door Peer Support Groups',
      desc: 'Weekly drop-in groups for grief, anxiety, caregivers, and recovery, led by trained volunteers.',
      tags: ['free', 'walkin', 'evenings'],
      phone: '(555) 555-0106', email: 'groups@opendoor.example', address: 'Grace Hall, 15 Elm Street, Maple Valley',
      hours: 'Mon, Wed, Thu 6:30 PM–8 PM', keywords: 'support group grief recovery caregiver addiction'
    },
    {
      id: 'food-pantry', category: 'food', name: 'Maple Valley Food Pantry',
      desc: 'Choose fresh produce, dairy, and pantry staples once a week. No proof of income needed.',
      tags: ['free', 'walkin', 'spanish', 'evenings'],
      phone: '(555) 555-0107', email: 'pantry@mvfood.example', address: '301 Oak Street, Maple Valley',
      hours: 'Wed 3 PM–7 PM, Sat 9 AM–12 PM', keywords: 'food pantry groceries produce hungry'
    },
    {
      id: 'northside-kitchen', category: 'food', name: 'Northside Community Kitchen',
      desc: 'Hot, sit-down meals served every day. Everyone is welcome; to-go boxes are available.',
      tags: ['free', 'walkin'],
      phone: '(555) 555-0108', email: 'hello@northsidekitchen.example', address: '7 Birch Lane, Maple Valley',
      hours: 'Every day 11:30 AM–1:30 PM', keywords: 'meal lunch hot food soup kitchen'
    },
    {
      id: 'fresh-start', category: 'food', name: 'Fresh Start Farmers Market',
      desc: 'Local fruits and vegetables. SNAP and WIC dollars are matched up to $20 per visit.',
      tags: ['spanish', 'evenings'],
      phone: '(555) 555-0109', email: 'market@freshstart.example', address: 'Town Square Parking Lot, Maple Valley',
      hours: 'Fri 3 PM–7 PM, Sun 9 AM–1 PM', keywords: 'snap wic ebt produce vegetables fruit market'
    },
    {
      id: 'silver-years', category: 'seniors', name: 'Silver Years Senior Center',
      desc: 'Daily lunch, fitness classes, and help with Medicare questions for adults 60 and older.',
      tags: ['free', 'transport', 'walkin'],
      phone: '(555) 555-0110', email: 'front.desk@silveryears.example', address: '55 Willow Drive, Maple Valley',
      hours: 'Mon–Fri 8 AM–4 PM', keywords: 'senior older adult medicare lunch exercise'
    },
    {
      id: 'access-ride', category: 'seniors', name: 'Access Ride Door-to-Door Transit',
      desc: 'Wheelchair-accessible rides to medical appointments, pharmacies, and grocery stores.',
      tags: ['transport', 'sliding'],
      phone: '(555) 555-0111', email: 'rides@accessride.example', address: 'Book by phone 48 hours ahead',
      hours: 'Mon–Sat 6 AM–7 PM', keywords: 'ride transportation wheelchair bus paratransit disability'
    },
    {
      id: 'independent-living', category: 'seniors', name: 'Independent Living Resource Center',
      desc: 'Disability advocacy, benefits help, and free loans of walkers, shower chairs, and other equipment.',
      tags: ['free', 'spanish', 'virtual'],
      phone: '(555) 555-0112', email: 'ilrc@mvaccess.example', address: '140 Maple Street, Maple Valley',
      hours: 'Mon–Fri 9 AM–5 PM', keywords: 'disability equipment walker wheelchair advocacy benefits'
    },
    {
      id: 'library-health', category: 'education', name: 'Public Library Health Corner',
      desc: 'Free workshops on reading prescription labels, finding reliable health info, and signing up for coverage.',
      tags: ['free', 'walkin', 'spanish', 'evenings'],
      phone: '(555) 555-0113', email: 'healthcorner@mvlibrary.example', address: 'Maple Valley Public Library, 1 Library Plaza',
      hours: 'Tue 6 PM–8 PM, Sat 10 AM–12 PM', keywords: 'class workshop insurance medicaid enrollment literacy'
    },
    {
      id: 'healthy-habits', category: 'education', name: 'Healthy Habits Nutrition Classes',
      desc: 'Six-week cooking and diabetes-prevention classes taught by registered dietitians, in person or online.',
      tags: ['free', 'virtual', 'evenings'],
      phone: '(555) 555-0114', email: 'classes@healthyhabits.example', address: 'County Extension Office, 900 Farm Road',
      hours: 'Thu 5:30 PM–7 PM', keywords: 'nutrition cooking diabetes diet class dietitian'
    },
    {
      id: 'workforce', category: 'family', name: 'Valley Workforce Center',
      desc: 'Job listings, resume reviews, interview practice, and paid training in health care careers.',
      tags: ['free', 'walkin', 'virtual'],
      phone: '(555) 555-0115', email: 'jobs@valleyworkforce.example', address: '260 Commerce Way, Maple Valley',
      hours: 'Mon–Fri 8:30 AM–5 PM', keywords: 'job employment resume work career training interview'
    },
    {
      id: 'little-sprouts', category: 'family', name: 'Little Sprouts Child Care Assistance',
      desc: 'Help paying for licensed child care, plus referrals to openings near your home or job.',
      tags: ['free', 'spanish', 'virtual'],
      phone: '(555) 555-0116', email: 'families@littlesprouts.example', address: '33 Pine Court, Maple Valley',
      hours: 'Mon–Fri 9 AM–6 PM', keywords: 'child care daycare subsidy preschool kids babysitting'
    },
    {
      id: 'bright-beginnings', category: 'family', name: 'Bright Beginnings Family Resource Center',
      desc: 'Parenting classes, free diapers and baby supplies, and help enrolling in WIC.',
      tags: ['free', 'walkin', 'spanish', 'evenings'],
      phone: '(555) 555-0117', email: 'hello@brightbeginnings.example', address: '612 Sunset Boulevard, Maple Valley',
      hours: 'Mon–Fri 9 AM–5 PM, Sat 10 AM–1 PM', keywords: 'parent baby diapers wic family child care'
    },
    {
      id: 'benefits-navigator', category: 'family', name: 'Maple Valley Benefits Navigators',
      desc: 'One-on-one help applying for SNAP, Medicaid, energy assistance, and other benefits.',
      tags: ['free', 'virtual', 'spanish', 'noinsurance'],
      phone: '(555) 555-0118', email: 'navigators@mvbenefits.example', address: 'City Hall Annex, 20 Main Street',
      hours: 'Mon–Fri 8 AM–6 PM', keywords: 'benefits snap medicaid apply application utility bills'
    }
  ];

  /* Events use "offset" (months from the current month) and "day" so the
     calendar always has events, whatever month the site is demoed in.
     offset 0 = this month, 1 = next month, -1 = last month. Keep day <= 28. */
  var EVENTS = [
    { id: 'e1',  offset: -1, day: 10, category: 'food',      title: 'Harvest Share Giveaway',        time: '9:00 AM – 12:00 PM', location: 'Maple Valley Food Pantry',       desc: 'Free boxes of seasonal produce while supplies last.', cost: 'Free' },
    { id: 'e2',  offset: -1, day: 22, category: 'clinics',   title: 'Back-to-School Vaccine Day',    time: '10:00 AM – 2:00 PM', location: 'Valley Mobile Health Van, Lincoln Park', desc: 'Required school vaccines for kids and teens. Bring any vaccine records you have.', cost: 'Free' },
    { id: 'e3',  offset: 0,  day: 3,  category: 'education', title: 'Understanding Your Health Coverage', time: '6:00 PM – 7:30 PM', location: 'Public Library, Community Room', desc: 'Learn how deductibles and copays work and get help choosing a plan.', cost: 'Free' },
    { id: 'e4',  offset: 0,  day: 6,  category: 'food',      title: 'Saturday Pantry Plus',          time: '9:00 AM – 12:00 PM', location: 'Maple Valley Food Pantry',       desc: 'Regular pantry hours with an added cooking demo and recipe cards.', cost: 'Free' },
    { id: 'e5',  offset: 0,  day: 9,  category: 'mental',    title: 'Stress Less: Teen Workshop',    time: '4:00 PM – 5:30 PM',  location: 'Harbor Counseling Collective',   desc: 'Practical tools for managing school stress, for ages 13 to 18.', cost: 'Free' },
    { id: 'e6',  offset: 0,  day: 12, category: 'seniors',   title: 'Medicare Q&A Morning',          time: '10:00 AM – 11:30 AM', location: 'Silver Years Senior Center',   desc: 'Bring your questions about plans, prescriptions, and enrollment dates.', cost: 'Free' },
    { id: 'e7',  offset: 0,  day: 14, category: 'clinics',   title: 'Community Health Fair',         time: '10:00 AM – 3:00 PM', location: 'Town Square',                    desc: 'Free blood pressure, vision, and glucose screenings with local clinics.', cost: 'Free' },
    { id: 'e8',  offset: 0,  day: 14, category: 'family',    title: 'Child Care Enrollment Help',    time: '11:00 AM – 2:00 PM', location: 'Town Square, Family Tent',       desc: 'Apply for child care assistance on the spot with Little Sprouts staff.', cost: 'Free' },
    { id: 'e9',  offset: 0,  day: 14, category: 'food',      title: 'Fresh Start Market Tour',       time: '1:00 PM – 2:00 PM',  location: 'Fresh Start Farmers Market',     desc: 'See how to use SNAP matching and pick budget-friendly produce.', cost: 'Free' },
    { id: 'e10', offset: 0,  day: 17, category: 'family',    title: 'Resume and Interview Lab',      time: '5:30 PM – 7:30 PM',  location: 'Valley Workforce Center',        desc: 'One-on-one resume reviews and mock interviews with local employers.', cost: 'Free' },
    { id: 'e11', offset: 0,  day: 20, category: 'education', title: 'Healthy Cooking on a Budget',   time: '5:30 PM – 7:00 PM',  location: 'County Extension Office',        desc: 'Cook three low-cost meals with a registered dietitian.', cost: 'Free' },
    { id: 'e12', offset: 0,  day: 23, category: 'mental',    title: 'Caregiver Support Circle',      time: '6:30 PM – 8:00 PM',  location: 'Grace Hall',                     desc: 'A welcoming space for people caring for a family member.', cost: 'Free' },
    { id: 'e13', offset: 0,  day: 26, category: 'seniors',   title: 'Accessible Ride Sign-Up Day',   time: '9:00 AM – 1:00 PM',  location: 'Independent Living Resource Center', desc: 'Register for Access Ride and try out the accessible vans.', cost: 'Free' },
    { id: 'e14', offset: 1,  day: 2,  category: 'clinics',   title: 'Flu Shot Clinic',               time: '3:00 PM – 7:00 PM',  location: 'Maple Valley Community Health Center', desc: 'Walk-in flu shots for anyone 6 months and older.', cost: 'Free' },
    { id: 'e15', offset: 1,  day: 7,  category: 'food',      title: 'Community Meal Night',          time: '5:00 PM – 7:00 PM',  location: 'Northside Community Kitchen',    desc: 'A shared dinner with live music. Everyone is welcome.', cost: 'Free' },
    { id: 'e16', offset: 1,  day: 11, category: 'family',    title: 'New Parent Meetup',             time: '10:00 AM – 11:30 AM', location: 'Bright Beginnings Family Resource Center', desc: 'Meet other parents of babies under one and pick up free supplies.', cost: 'Free' },
    { id: 'e17', offset: 1,  day: 15, category: 'mental',    title: 'Mental Health First Aid Training', time: '9:00 AM – 4:00 PM', location: 'Public Library, Community Room', desc: 'Learn how to help someone showing signs of a mental health challenge.', cost: 'Free, registration required' },
    { id: 'e18', offset: 1,  day: 19, category: 'education', title: 'Reading Prescription Labels',   time: '6:00 PM – 7:00 PM',  location: 'Public Library Health Corner',   desc: 'Understand dosing, side effects, and drug interactions.', cost: 'Free' },
    { id: 'e19', offset: 1,  day: 24, category: 'seniors',   title: 'Chair Yoga for Every Body',     time: '10:30 AM – 11:30 AM', location: 'Silver Years Senior Center',   desc: 'Gentle, seated movement for all mobility levels.', cost: 'Free' },
    { id: 'e20', offset: 2,  day: 5,  category: 'family',    title: 'Health Careers Job Fair',       time: '1:00 PM – 5:00 PM',  location: 'Valley Workforce Center',        desc: 'Meet hiring managers from clinics, hospitals, and home care agencies.', cost: 'Free' },
    { id: 'e21', offset: 2,  day: 18, category: 'food',      title: 'Holiday Grocery Distribution',  time: '9:00 AM – 1:00 PM',  location: 'Maple Valley Food Pantry',       desc: 'Holiday meal boxes for registered households. Call ahead to reserve.', cost: 'Free' }
  ];


  /* 4. SHARED HELPERS ------------------------------------------------------ */
  function $(selector, scope) { return (scope || document).querySelector(selector); }
  function $all(selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function icon(id, extraClass) {
    return '<svg class="icon' + (extraClass ? ' ' + extraClass : '') + '" aria-hidden="true" focusable="false"><use href="#' + id + '"></use></svg>';
  }

  function debounce(fn, wait) {
    var timer;
    return function () {
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(null, args); }, wait);
    };
  }

  function findById(list, id) {
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) return list[i]; }
    return null;
  }

  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  function telHref(phone) { return 'tel:+1' + phone.replace(/\D/g, ''); }

  function joinWords(words) {
    if (words.length < 2) return words.join('');
    return words.slice(0, -1).join(', ') + ' and ' + words[words.length - 1];
  }

  // Bookmarks (ids of saved resources) shared by Browse and Get Help.
  var bookmarks = store.get('bookmarks', []);
  if (!Array.isArray(bookmarks)) bookmarks = [];
  function isSaved(id) { return bookmarks.indexOf(id) !== -1; }
  function toggleSaved(id) {
    if (isSaved(id)) bookmarks.splice(bookmarks.indexOf(id), 1);
    else bookmarks.push(id);
    store.set('bookmarks', bookmarks);
    return isSaved(id);
  }

  /* One filter function used by both the directory and the guided flow.
     filters = { q, category, tags[], saved } */
  function filterResources(filters) {
    var terms = String(filters.q || '').toLowerCase().split(/\s+/).filter(Boolean);
    var tags = filters.tags || [];
    return RESOURCES.filter(function (r) {
      if (filters.category && filters.category !== 'all' && r.category !== filters.category) return false;
      for (var i = 0; i < tags.length; i++) { if (r.tags.indexOf(tags[i]) === -1) return false; }
      if (filters.saved && !isSaved(r.id)) return false;
      if (terms.length) {
        var haystack = [
          r.name, r.desc, r.keywords, r.address,
          findById(CATEGORIES, r.category).name,
          r.tags.map(function (t) { return findById(TAGS, t).label; }).join(' ')
        ].join(' ').toLowerCase();
        return terms.every(function (term) { return haystack.indexOf(term) !== -1; });
      }
      return true;
    });
  }

  function browseUrl(filters) {
    var params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.category && filters.category !== 'all') params.set('category', filters.category);
    if (filters.tags && filters.tags.length) params.set('tags', filters.tags.join(','));
    var qs = params.toString();
    return 'browse.html' + (qs ? '?' + qs : '');
  }

  // Dates
  var TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0);
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function eventDate(ev) { return new Date(TODAY.getFullYear(), TODAY.getMonth() + ev.offset, ev.day); }
  function isoDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function longDate(d) { return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }); }
  function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

  var DATED_EVENTS = EVENTS.map(function (ev) {
    var copy = {};
    for (var key in ev) { if (Object.prototype.hasOwnProperty.call(ev, key)) copy[key] = ev[key]; }
    copy.date = eventDate(ev);
    return copy;
  }).sort(function (a, b) { return a.date - b.date; });

  // Event card markup shared by Home and Events. headingTag: 'h3' or 'h4'.
  function eventCardHTML(ev, headingTag) {
    var cat = findById(CATEGORIES, ev.category);
    return '<li><article class="event-card">' +
      '<p class="date-tile" aria-hidden="true"><span class="mon">' + MONTHS[ev.date.getMonth()].slice(0, 3) + '</span>' +
      '<span class="day">' + ev.date.getDate() + '</span></p>' +
      '<div class="event-body">' +
        '<' + headingTag + '>' + esc(ev.title) + '</' + headingTag + '>' +
        '<ul class="event-meta">' +
          '<li>' + icon('i-clock') + '<span><time datetime="' + isoDate(ev.date) + '">' + longDate(ev.date) + '</time>, ' + esc(ev.time) + '</span></li>' +
          '<li>' + icon('i-pin') + '<span>' + esc(ev.location) + '</span></li>' +
        '</ul>' +
        '<p class="event-desc">' + esc(ev.desc) + '</p>' +
        '<ul class="tag-row">' +
          '<li class="tag cat-' + ev.category + '"><span class="tag-dot" aria-hidden="true"></span>' + esc(cat.name) + '</li>' +
          '<li class="tag">' + esc(ev.cost) + '</li>' +
        '</ul>' +
      '</div>' +
    '</article></li>';
  }


  /* 5. SHARED UI ------------------------------------------------------------ */

  // Icon + mascot sprite, injected once per page and used with <use href="#id">.
  var SPRITE =
    '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">' +
    // Line icons (24px grid, 2px stroke)
    '<symbol id="i-clinic" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M8 12h8"/></symbol>' +
    '<symbol id="i-mental" viewBox="0 0 24 24"><path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 20.5l1.4-5A8.5 8.5 0 1 1 21 11.5z"/><path d="M12.5 15s-3.5-2-3.5-4.2A1.9 1.9 0 0 1 12.5 9.7 1.9 1.9 0 0 1 16 10.8c0 2.2-3.5 4.2-3.5 4.2z"/></symbol>' +
    '<symbol id="i-food" viewBox="0 0 24 24"><path d="M12 7.5c-1.6-1.3-3.7-1.6-5.2-.6-2.6 1.7-2.6 5.8-1 9.2 1.2 2.7 3 4.4 4.5 4.4.9 0 1.1-.5 1.7-.5s.8.5 1.7.5c1.5 0 3.3-1.7 4.5-4.4 1.6-3.4 1.6-7.5-1-9.2-1.5-1-3.6-.7-5.2.6z"/><path d="M12 7.5c0-2.2 1-3.8 3-4.5"/></symbol>' +
    '<symbol id="i-seniors" viewBox="0 0 24 24"><circle cx="9" cy="7" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1"/><circle cx="17.5" cy="9" r="2.5"/><path d="M16.5 14.1A4.5 4.5 0 0 1 21 18.5V20"/></symbol>' +
    '<symbol id="i-education" viewBox="0 0 24 24"><path d="M2.5 5H8a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H2.5z"/><path d="M21.5 5H16a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h6.5z"/></symbol>' +
    '<symbol id="i-family" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></symbol>' +
    '<symbol id="i-compass" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></symbol>' +
    '<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></symbol>' +
    '<symbol id="i-bookmark" viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4.5L6 21z"/></symbol>' +
    '<symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 3.5h3.5l2 5-2.5 1.6a11 11 0 0 0 5.9 5.9l1.6-2.5 5 2V19a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 3 5.6 2 2 0 0 1 5 3.5z"/></symbol>' +
    '<symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/></symbol>' +
    '<symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></symbol>' +
    '<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>' +
    '<symbol id="i-chevron-left" viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></symbol>' +
    '<symbol id="i-chevron-right" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></symbol>' +
    '<symbol id="i-camera" viewBox="0 0 24 24"><path d="M3.5 8h3.5l2-3h6l2 3h3.5v11h-17z"/><circle cx="12" cy="13" r="3.5"/></symbol>' +
    '<symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>' +
    '<symbol id="i-filter" viewBox="0 0 24 24"><path d="M3 6h18M6.5 12h11M10 18h4"/></symbol>' +
    '<symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></symbol>' +
    // Friendly characters (decorative)
    '<symbol id="m-blob" viewBox="0 0 120 120"><path d="M18 74C10 44 34 14 64 16s46 30 40 60-30 34-50 32S24 98 18 74z" fill="#8CCB7E"/><circle cx="48" cy="58" r="13" fill="#fff"/><circle cx="78" cy="54" r="13" fill="#fff"/><circle cx="52" cy="61" r="6" fill="#2B1A22"/><circle cx="81" cy="57" r="6" fill="#2B1A22"/><path d="M54 82q11 9 22 0" fill="none" stroke="#2B1A22" stroke-width="3.5" stroke-linecap="round"/></symbol>' +
    '<symbol id="m-ghost" viewBox="0 0 120 120"><path d="M22 108V58a38 38 0 0 1 76 0v50l-12.7-9-12.6 9-12.7-9-12.7 9-12.6-9z" fill="#A9C7EE"/><circle cx="46" cy="56" r="12" fill="#fff"/><circle cx="74" cy="56" r="12" fill="#fff"/><circle cx="48" cy="59" r="5.5" fill="#2B1A22"/><circle cx="76" cy="59" r="5.5" fill="#2B1A22"/><ellipse cx="60" cy="80" rx="6" ry="4.5" fill="#2B1A22"/></symbol>' +
    '<symbol id="m-drop" viewBox="0 0 120 120"><path d="M60 10c24 22 40 44 40 64a40 40 0 0 1-80 0c0-20 16-42 40-64z" fill="#F4A3BE"/><circle cx="46" cy="72" r="11" fill="#fff"/><circle cx="74" cy="72" r="11" fill="#fff"/><circle cx="47" cy="75" r="5" fill="#2B1A22"/><circle cx="75" cy="75" r="5" fill="#2B1A22"/><path d="M52 93q8 6 16 0" fill="none" stroke="#2B1A22" stroke-width="3.5" stroke-linecap="round"/></symbol>' +
    '<symbol id="m-sprout" viewBox="0 0 120 120"><path d="M60 112V62" fill="none" stroke="#3F8A4A" stroke-width="5" stroke-linecap="round"/><path d="M60 66C60 36 38 18 12 18c0 30 20 48 48 48z" fill="#8CCB7E"/><path d="M60 58c0-26 18-42 46-42 0 26-18 42-46 42z" fill="#B7DFA9"/></symbol>' +
    '</svg>';

  function injectSprite() {
    if (!document.getElementById('i-search')) document.body.insertAdjacentHTML('afterbegin', SPRITE);
  }

  function initDisplayButtons() {
    var themeBtn = $('#theme-toggle');
    var textBtn = $('#text-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        prefs.theme = prefs.theme === 'dark' ? 'light' : 'dark';
        store.set('theme', prefs.theme);
        applyPrefs();
      });
    }
    if (textBtn) {
      textBtn.addEventListener('click', function () {
        prefs.text = prefs.text === 'large' ? 'normal' : 'large';
        store.set('text', prefs.text);
        applyPrefs();
      });
    }
    applyPrefs(); // sync aria-pressed now that the buttons exist
  }

  function initNav() {
    var btn = $('#nav-toggle');
    var nav = $('#site-nav');
    if (!btn || !nav) return;

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    }
    btn.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); btn.focus(); }
    });
    window.addEventListener('resize', debounce(function () {
      if (window.innerWidth >= 1024) setOpen(false);
    }, 150));
  }


  /* 6. HOME ------------------------------------------------------------------ */
  function initHome() {
    // Resource counts on the category cards come straight from the data.
    $all('[data-count-for]').forEach(function (el) {
      var n = RESOURCES.filter(function (r) { return r.category === el.getAttribute('data-count-for'); }).length;
      el.textContent = plural(n, 'resource');
    });

    // Next three upcoming events.
    var list = $('#home-events');
    if (list) {
      var upcoming = DATED_EVENTS.filter(function (ev) { return ev.date >= TODAY; }).slice(0, 3);
      list.innerHTML = upcoming.map(function (ev) { return eventCardHTML(ev, 'h3'); }).join('');
    }
  }


  /* 7. BROWSE RESOURCES ----------------------------------------------------- */
  function initBrowse() {
    var form = $('#filters-form');
    if (!form) return;

    var qInput = $('#f-q');
    var catWrap = $('#filter-categories');
    var tagWrap = $('#filter-tags');
    var savedBox = $('#f-saved');
    var savedCount = $('#saved-count');
    var resultsEl = $('#results');
    var resultsTitle = $('#results-title');
    var statusEl = $('#results-status');
    var emptyEl = $('#results-empty');
    var bookmarkStatus = $('#bookmark-status');
    var panel = $('#filters-panel');
    var panelToggle = $('#filters-toggle');
    var activeCount = $('#filters-active-count');

    // Read any filters passed in the address (from Home search or Get Help).
    var params = new URLSearchParams(window.location.search);
    var state = {
      q: params.get('q') || '',
      category: findById(CATEGORIES, params.get('category')) ? params.get('category') : 'all',
      tags: (params.get('tags') || '').split(',').filter(function (t) { return findById(TAGS, t); }),
      saved: params.get('saved') === '1'
    };

    // Build filter controls from the data so they always match.
    catWrap.innerHTML = [{ id: 'all', name: 'All categories' }].concat(CATEGORIES).map(function (c) {
      var count = c.id === 'all' ? RESOURCES.length : RESOURCES.filter(function (r) { return r.category === c.id; }).length;
      return '<label class="option"><input type="radio" name="category" value="' + c.id + '">' +
        '<span>' + esc(c.name) + '</span><span class="option-count" aria-hidden="true">' + count + '</span></label>';
    }).join('');

    tagWrap.innerHTML = TAGS.map(function (t) {
      return '<label class="chip"><input type="checkbox" name="tags" value="' + t.id + '"><span>' + esc(t.label) + '</span></label>';
    }).join('');

    function syncControls() {
      qInput.value = state.q;
      $all('input[name="category"]', catWrap).forEach(function (input) { input.checked = input.value === state.category; });
      $all('input[name="tags"]', tagWrap).forEach(function (input) { input.checked = state.tags.indexOf(input.value) !== -1; });
      savedBox.checked = state.saved;
    }

    function syncUrl() {
      var url = browseUrl(state);
      if (state.saved) url += (url.indexOf('?') === -1 ? '?' : '&') + 'saved=1';
      try { window.history.replaceState(null, '', url); } catch (e) { /* not critical */ }
    }

    function describeFilters(count) {
      var parts = [];
      if (state.category !== 'all') parts.push('in ' + findById(CATEGORIES, state.category).name);
      if (state.tags.length) parts.push('with ' + joinWords(state.tags.map(function (t) { return findById(TAGS, t).label.toLowerCase(); })));
      if (state.q) parts.push('matching "' + state.q + '"');
      if (state.saved) parts.push('from your saved list');
      return 'Showing ' + count + ' of ' + plural(RESOURCES.length, 'resource') + (parts.length ? ' ' + parts.join(', ') : '') + '.';
    }

    function cardHTML(r) {
      var cat = findById(CATEGORIES, r.category);
      var saved = isSaved(r.id);
      return '<li><article class="resource-card cat-' + r.category + (saved ? ' is-saved' : '') + '" aria-labelledby="res-' + r.id + '">' +
        '<div class="resource-top">' +
          '<p class="tag"><span class="tag-dot" aria-hidden="true"></span>' + esc(cat.name) + '</p>' +
          '<button type="button" class="bookmark-btn" data-bookmark="' + r.id + '" aria-pressed="' + saved + '" aria-label="Save ' + esc(r.name) + '">' +
            icon('i-bookmark') + '<span class="bm-label" aria-hidden="true">' + (saved ? 'Saved' : 'Save') + '</span>' +
          '</button>' +
        '</div>' +
        '<h3 id="res-' + r.id + '">' + esc(r.name) + '</h3>' +
        '<p class="resource-desc">' + esc(r.desc) + '</p>' +
        '<ul class="tag-row" aria-label="Features">' +
          r.tags.map(function (t) { return '<li class="tag">' + esc(findById(TAGS, t).label) + '</li>'; }).join('') +
        '</ul>' +
        '<ul class="contact-list">' +
          '<li>' + icon('i-phone', 'icon-sm') + '<span><span class="visually-hidden">Phone: </span><a href="' + telHref(r.phone) + '">' + esc(r.phone) + '</a></span></li>' +
          '<li>' + icon('i-mail', 'icon-sm') + '<span><span class="visually-hidden">Email: </span><a href="mailto:' + esc(r.email) + '">' + esc(r.email) + '</a></span></li>' +
          '<li>' + icon('i-pin', 'icon-sm') + '<span><span class="visually-hidden">Address: </span>' + esc(r.address) + '</span></li>' +
          '<li>' + icon('i-clock', 'icon-sm') + '<span><span class="visually-hidden">Hours: </span>' + esc(r.hours) + '</span></li>' +
        '</ul>' +
      '</article></li>';
    }

    function render() {
      var list = filterResources(state);
      resultsEl.innerHTML = list.map(cardHTML).join('');
      emptyEl.hidden = list.length > 0;
      statusEl.textContent = describeFilters(list.length);
      savedCount.textContent = bookmarks.length;

      var active = (state.q ? 1 : 0) + (state.category !== 'all' ? 1 : 0) + state.tags.length + (state.saved ? 1 : 0);
      activeCount.textContent = active ? '(' + active + ' on)' : '';
      syncUrl();
    }

    function clearAll() {
      state = { q: '', category: 'all', tags: [], saved: false };
      syncControls();
      render();
    }

    // Events
    form.addEventListener('submit', function (e) { e.preventDefault(); });

    qInput.addEventListener('input', debounce(function () {
      state.q = qInput.value.trim();
      render();
    }, 150));

    catWrap.addEventListener('change', function (e) {
      if (e.target.name === 'category') { state.category = e.target.value; render(); }
    });

    tagWrap.addEventListener('change', function () {
      state.tags = $all('input[name="tags"]:checked', tagWrap).map(function (input) { return input.value; });
      render();
    });

    savedBox.addEventListener('change', function () { state.saved = savedBox.checked; render(); });

    $('#clear-filters').addEventListener('click', function () { clearAll(); qInput.focus(); });
    $('#empty-clear').addEventListener('click', function () { clearAll(); resultsTitle.focus(); });

    panelToggle.addEventListener('click', function () {
      var open = !panel.classList.contains('is-open');
      panel.classList.toggle('is-open', open);
      panelToggle.setAttribute('aria-expanded', String(open));
    });

    // Bookmark buttons (event delegation: cards are re-rendered often).
    resultsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-bookmark]');
      if (!btn) return;
      var id = btn.getAttribute('data-bookmark');
      var nowSaved = toggleSaved(id);
      var resource = findById(RESOURCES, id);
      bookmarkStatus.textContent = (nowSaved ? 'Saved ' : 'Removed ') + resource.name + '. ' + plural(bookmarks.length, 'saved resource') + '.';
      savedCount.textContent = bookmarks.length;

      if (state.saved && !nowSaved) {
        render();               // card leaves the "saved only" view
        resultsTitle.focus();   // keep keyboard focus in a sensible place
      } else {
        btn.setAttribute('aria-pressed', String(nowSaved));
        btn.querySelector('.bm-label').textContent = nowSaved ? 'Saved' : 'Save';
        btn.closest('.resource-card').classList.toggle('is-saved', nowSaved);
      }
    });

    syncControls();
    render();
  }


  /* 8. EVENTS CALENDAR ------------------------------------------------------ */
  function initEvents() {
    var grid = $('#cal-grid');
    if (!grid) return;

    var monthLabel = $('#cal-month-label');
    var statusEl = $('#cal-status');
    var monthView = $('#cal-month-view');
    var listView = $('#cal-list-view');
    var dayPanel = $('#cal-day-panel');
    var catSelect = $('#cal-category');
    var viewMonthBtn = $('#view-month');
    var viewListBtn = $('#view-list');

    var state = {
      year: TODAY.getFullYear(),
      month: TODAY.getMonth(),
      view: 'month',
      category: 'all',
      selectedDay: null
    };

    catSelect.innerHTML = '<option value="all">All categories</option>' + CATEGORIES.map(function (c) {
      return '<option value="' + c.id + '">' + esc(c.name) + '</option>';
    }).join('');

    function monthName() { return MONTHS[state.month] + ' ' + state.year; }
    function isCurrentMonth() { return state.year === TODAY.getFullYear() && state.month === TODAY.getMonth(); }

    function visibleEvents() {
      return DATED_EVENTS.filter(function (ev) {
        return ev.date.getFullYear() === state.year &&
          ev.date.getMonth() === state.month &&
          (state.category === 'all' || ev.category === state.category);
      });
    }

    function groupByDay(events) {
      var groups = {};
      events.forEach(function (ev) {
        var d = ev.date.getDate();
        if (!groups[d]) groups[d] = [];
        groups[d].push(ev);
      });
      return groups;
    }

    function emptyHTML() {
      var catName = state.category === 'all' ? '' : findById(CATEGORIES, state.category).name.toLowerCase() + ' ';
      var actions = '';
      if (state.category !== 'all') actions += '<button type="button" class="btn btn-secondary" data-action="all-categories">Show all categories</button>';
      if (!isCurrentMonth()) actions += '<button type="button" class="btn btn-ghost" data-action="this-month">Go to this month</button>';
      return '<div class="empty-state">' +
        '<svg class="mascot" aria-hidden="true" focusable="false"><use href="#m-ghost"></use></svg>' +
        '<h3>No ' + catName + 'events in ' + monthName() + '</h3>' +
        '<p>Try another month or category. New events are added as organizations share them.</p>' +
        (actions ? '<div class="empty-actions">' + actions + '</div>' : '') +
      '</div>';
    }

    function renderGrid(events) {
      var groups = groupByDay(events);
      var days = Object.keys(groups).map(Number).sort(function (a, b) { return a - b; });

      // Pick a sensible selected day: keep the current one, else today, else the first event day.
      if (state.selectedDay === null || !groups[state.selectedDay]) {
        state.selectedDay = (isCurrentMonth() && groups[TODAY.getDate()]) ? TODAY.getDate() : (days.length ? days[0] : null);
      }

      var firstWeekday = new Date(state.year, state.month, 1).getDay();
      var daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
      var rows = Math.ceil((firstWeekday + daysInMonth) / 7);
      var html = '';
      var day = 1;

      for (var r = 0; r < rows; r++) {
        html += '<tr>';
        for (var c = 0; c < 7; c++) {
          var index = r * 7 + c;
          if (index < firstWeekday || day > daysInMonth) {
            html += '<td class="is-outside"></td>';
            continue;
          }
          var date = new Date(state.year, state.month, day);
          var isToday = sameDay(date, TODAY);
          var dayEvents = groups[day];
          html += '<td' + (isToday ? ' class="is-today"' : '') + '>';
          if (dayEvents) {
            var label = longDate(date) + ', ' + plural(dayEvents.length, 'event') + (isToday ? ', today' : '');
            html += '<button type="button" class="cal-day" data-day="' + day + '" aria-pressed="' + (day === state.selectedDay) + '" aria-label="' + label + '">' +
              '<span class="cal-num">' + day + '</span>' +
              '<span class="cal-evts" aria-hidden="true">' +
                dayEvents.slice(0, 2).map(function (ev) {
                  return '<span class="cal-evt cat-' + ev.category + '">' + esc(ev.title) + '</span>';
                }).join('') +
                (dayEvents.length > 2 ? '<span class="cal-more">+' + (dayEvents.length - 2) + ' more</span>' : '') +
              '</span>' +
              '<span class="cal-dot" aria-hidden="true"></span>' +
            '</button>';
          } else {
            html += '<span class="cal-day"><span class="cal-num">' + day + '</span>' + (isToday ? '<span class="visually-hidden">, today</span>' : '') + '</span>';
          }
          html += '</td>';
          day++;
        }
        html += '</tr>';
      }

      $('tbody', grid).innerHTML = html;
      $('caption', grid).textContent = 'Community events calendar for ' + monthName();
      renderDayPanel(groups, events);
    }

    function renderDayPanel(groups, events) {
      if (!events.length) {
        dayPanel.innerHTML = emptyHTML();
        return;
      }
      var selected = groups[state.selectedDay];
      if (!selected) {
        dayPanel.innerHTML = '<p>Select a highlighted date to see its events.</p>';
        return;
      }
      var date = new Date(state.year, state.month, state.selectedDay);
      dayPanel.innerHTML = '<h3 id="day-panel-title">Events on ' + longDate(date) + '</h3>' +
        '<ul class="event-list">' + selected.map(function (ev) { return eventCardHTML(ev, 'h4'); }).join('') + '</ul>';
    }

    function renderList(events) {
      if (!events.length) {
        listView.innerHTML = emptyHTML();
        return;
      }
      var groups = groupByDay(events);
      listView.innerHTML = Object.keys(groups).map(Number).sort(function (a, b) { return a - b; }).map(function (d) {
        var date = new Date(state.year, state.month, d);
        return '<section class="list-day"><h3>' + longDate(date) + '</h3>' +
          '<ul class="event-list">' + groups[d].map(function (ev) { return eventCardHTML(ev, 'h4'); }).join('') + '</ul></section>';
      }).join('');
    }

    function render() {
      var events = visibleEvents();
      monthLabel.textContent = monthName();
      monthView.hidden = state.view !== 'month';
      listView.hidden = state.view !== 'list';
      viewMonthBtn.setAttribute('aria-pressed', String(state.view === 'month'));
      viewListBtn.setAttribute('aria-pressed', String(state.view === 'list'));

      if (state.view === 'month') renderGrid(events);
      else renderList(events);

      var catText = state.category === 'all' ? '' : ' in ' + findById(CATEGORIES, state.category).name;
      statusEl.textContent = plural(events.length, 'event') + ' in ' + monthName() + catText + '.';
    }

    function changeMonth(step) {
      var d = new Date(state.year, state.month + step, 1);
      state.year = d.getFullYear();
      state.month = d.getMonth();
      state.selectedDay = null;
      render();
    }

    $('#cal-prev').addEventListener('click', function () { changeMonth(-1); });
    $('#cal-next').addEventListener('click', function () { changeMonth(1); });
    $('#cal-today').addEventListener('click', function () {
      state.year = TODAY.getFullYear();
      state.month = TODAY.getMonth();
      state.selectedDay = null;
      render();
    });

    catSelect.addEventListener('change', function () {
      state.category = catSelect.value;
      state.selectedDay = null;
      render();
    });

    viewMonthBtn.addEventListener('click', function () { state.view = 'month'; render(); });
    viewListBtn.addEventListener('click', function () { state.view = 'list'; render(); });

    // Selecting a day updates the panel without rebuilding the grid (keeps focus).
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-day]');
      if (!btn) return;
      state.selectedDay = Number(btn.getAttribute('data-day'));
      $all('button[data-day]', grid).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      var events = visibleEvents();
      renderDayPanel(groupByDay(events), events);
      statusEl.textContent = 'Showing events for ' + longDate(new Date(state.year, state.month, state.selectedDay)) + ' below the calendar.';
    });

    // Buttons inside empty states.
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      if (action === 'all-categories') {
        state.category = 'all';
        catSelect.value = 'all';
        render();
        catSelect.focus();
      } else if (action === 'this-month') {
        state.year = TODAY.getFullYear();
        state.month = TODAY.getMonth();
        state.selectedDay = null;
        render();
        $('#cal-today').focus();
      }
    });

    render();
  }


  /* 9. GET HELP (guided flow) ----------------------------------------------- */
  function initHelp() {
    var form = $('#help-form');
    if (!form) return;

    var steps = $all('.help-step', form);
    var stepLabel = $('#help-step-label');
    var bars = $all('.progress-bar li', form);
    var backBtn = $('#help-back');
    var nextBtn = $('#help-next');
    var needWrap = $('#need-options');
    var tagWrap = $('#help-tags');
    var errorEl = $('#need-error');
    var resultEl = $('#help-result');
    var current = 1;

    var unsure = { id: 'unsure', name: 'I’m not sure yet', hint: 'See everything and browse at your own pace', icon: 'i-compass', tint: 'sky' };

    needWrap.innerHTML = CATEGORIES.concat([unsure]).map(function (c) {
      return '<label class="tile"><input type="radio" name="need" value="' + c.id + '">' +
        '<span class="tile-body">' +
          '<span class="badge tint-' + c.tint + '" aria-hidden="true">' + icon(c.icon) + '</span>' +
          '<span class="tile-title">' + esc(c.name) + '</span>' +
          '<span class="tile-hint">' + esc(c.hint) + '</span>' +
        '</span></label>';
    }).join('');

    tagWrap.innerHTML = TAGS.map(function (t) {
      return '<label class="chip"><input type="checkbox" name="help-tags" value="' + t.id + '"><span>' + esc(t.label) + '</span></label>';
    }).join('');

    function selectedNeed() {
      var checked = $('input[name="need"]:checked', form);
      return checked ? checked.value : null;
    }
    function selectedTags() {
      return $all('input[name="help-tags"]:checked', form).map(function (input) { return input.value; });
    }

    function showStep(n, moveFocus) {
      current = n;
      steps.forEach(function (step) { step.hidden = Number(step.getAttribute('data-step')) !== n; });
      stepLabel.textContent = 'Step ' + n + ' of 3';
      bars.forEach(function (bar, i) { bar.classList.toggle('is-done', i < n); });
      backBtn.hidden = n === 1;
      nextBtn.hidden = n === 3;
      nextBtn.textContent = n === 2 ? 'Show my matches' : 'Next';
      if (n === 3) renderResult();
      if (moveFocus) {
        var heading = $('.help-legend', steps[n - 1]);
        if (heading) heading.focus();
      }
    }

    function renderResult() {
      var need = selectedNeed();
      var tags = selectedTags();
      var category = need === 'unsure' ? 'all' : need;
      var cat = findById(CATEGORIES, category);
      var matches = filterResources({ category: category, tags: tags });
      var usedTags = tags;
      var relaxed = false;

      // If no single service meets every option, fall back to the category alone.
      if (!matches.length && tags.length) {
        matches = filterResources({ category: category, tags: [] });
        usedTags = [];
        relaxed = true;
      }

      var tagNames = tags.map(function (t) { return findById(TAGS, t).label.toLowerCase(); });
      var html = '<p>You chose <strong>' + esc(cat ? cat.name : unsure.name) + '</strong>' +
        (tagNames.length ? ' and <strong>' + esc(joinWords(tagNames)) + '</strong>' : '') + '.</p>';

      if (relaxed) {
        html += '<p class="note">No single service matches all of those options, so here is every ' +
          esc(cat ? cat.name.toLowerCase() : 'community') + ' resource. You can narrow the list on the next page.</p>';
      }

      html += '<p>We found <strong>' + plural(matches.length, 'resource') + '</strong> for you. Here are the first few:</p>' +
        '<ul class="match-list">' + matches.slice(0, 3).map(function (r) {
          return '<li class="cat-' + r.category + '"><strong>' + esc(r.name) + '</strong><span>' + esc(r.hours) + '</span></li>';
        }).join('') + '</ul>' +
        '<div class="empty-actions" style="justify-content:flex-start">' +
          '<a class="btn btn-primary" href="' + browseUrl({ category: category, tags: usedTags }) + '">See all ' + matches.length + (matches.length === 1 ? ' match' : ' matches') + '</a>' +
          '<button type="button" class="btn btn-ghost" data-help="restart">Start over</button>' +
        '</div>';

      resultEl.innerHTML = html;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (current === 1) {
        if (!selectedNeed()) {
          errorEl.hidden = false;
          $('input[name="need"]', form).focus();
          return;
        }
        errorEl.hidden = true;
        showStep(2, true);
      } else if (current === 2) {
        showStep(3, true);
      }
    });

    needWrap.addEventListener('change', function () { errorEl.hidden = true; });
    backBtn.addEventListener('click', function () { showStep(current - 1, true); });

    resultEl.addEventListener('click', function (e) {
      if (!e.target.closest('[data-help="restart"]')) return;
      form.reset();
      errorEl.hidden = true;
      showStep(1, true);
    });

    showStep(1, false);
  }


  /* 10. START-UP -------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    injectSprite();
    initDisplayButtons();
    initNav();

    var pages = { home: initHome, browse: initBrowse, events: initEvents, help: initHelp };
    var init = pages[document.body.getAttribute('data-page')];
    if (init) init();
  });
})();
