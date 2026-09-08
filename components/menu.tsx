/* oxlint-disable next/no-html-link-for-pages -- menu.html is a static, printable document, not a framework route. */
'use client';
import { useMemo, useState } from 'react';
import { Search, X, ArrowUpLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import sections from '@/data/menu.json';
import restaurant from '@/data/restaurant.json';
const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .trim();
export default function Menu() {
  const [category, setCategory] = useState(sections[0]?.id ?? '0');
  const [query, setQuery] = useState('');
  const results = useMemo(
    () =>
      sections.flatMap((section) =>
        section.items
          .filter((item) =>
            normalize(`${item.ar} ${item.en ?? ""} ${section.ar}`).includes(
              normalize(query),
            ),
          )
          .map((item) => ({ ...item, section: section.ar })),
      ),
    [query],
  );
  function rows(items: typeof results) {
    return (
      <div className="menu-grid">
        {items.map((item) => (
          <article className="menu-item" key={item.id}>
            <div>
              <h3>{item.ar}</h3>
              <p lang="en" dir="ltr">
                {item.en}
              </p>
              {!item.available && <span className="unavailable">غير متاح حاليًا</span>}
              {query && <span className="item-category">{item.section}</span>}
            </div>
            <p className="price">
              <span dir="ltr">
                {item.price === null ? 'اسأل المطعم' : new Intl.NumberFormat('en', {
                  maximumFractionDigits: 2,
                }).format(item.price)}
              </span>
              {item.price !== null && <span>{restaurant.currencyAr}</span>}
            </p>
          </article>
        ))}
      </div>
    );
  }
  return (
    <div className="menu-browser">
      <div className="menu-tools">
        <label className="search-field">
          <Search size={19} />
          <span className="sr-only">ابحث في المنيو بالعربية أو الإنجليزية</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن طبقك المفضل…"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="مسح البحث">
              <X size={18} />
            </button>
          )}
        </label>
        <a
          className="print-link"
          href="./menu.html"
          target="_blank"
          rel="noreferrer"
        >
          المنيو كاملًا <ArrowUpLeft size={16} />
        </a>
      </div>
      {query ? (
        <div className="search-results">
          <output className="result-count" aria-live="polite">
            {results.length} نتيجة بحث
          </output>
          {results.length ? (
            rows(results)
          ) : (
            <div className="empty-state">
              <h3>ما لقينا طبقًا بهذا الاسم.</h3>
              <p>جرّب كلمة ثانية، أو ارجع لتصفّح الأقسام.</p>
              <button onClick={() => setQuery('')}>عرض المنيو</button>
            </div>
          )}
        </div>
      ) : (
        <Tabs value={category} onValueChange={(v) => setCategory(String(v))}>
          <div className="category-scroll">
            <TabsList className="category-list" aria-label="أقسام قائمة الطعام">
              {sections.map((s) => (
                <TabsTrigger key={s.id} value={s.id}>
                  {s.ar}
                  <span>{s.items.length}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {sections.map((s) => (
            <TabsContent key={s.id} value={s.id}>
              <div className="category-heading">
                <h3>{s.ar}</h3>
                <span lang="en" dir="ltr">
                  {s.en.toUpperCase()}
                </span>
              </div>
              {rows(s.items.map((i) => ({ ...i, section: s.ar })))}
            </TabsContent>
          ))}
        </Tabs>
      )}
      <noscript>
        <p>
          تصفّح جميع الأقسام من <a href="./menu.html">المنيو الكامل</a>.
        </p>
      </noscript>
    </div>
  );
}
