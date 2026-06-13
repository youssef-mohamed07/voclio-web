'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ADMIN_DOC_SECTIONS, ADMIN_DOCS_INTRO } from '@/lib/admin-docs';
import Card, { CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';

export default function DocsClient() {
  const [query, setQuery] = useState('');
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(ADMIN_DOC_SECTIONS.map((s) => s.id))
  );

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ADMIN_DOC_SECTIONS;

    return ADMIN_DOC_SECTIONS.map((section) => {
      const sectionMatch =
        section.title.toLowerCase().includes(q) ||
        section.summary.toLowerCase().includes(q);

      const items = section.items.filter(
        (item) =>
          sectionMatch ||
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );

      if (sectionMatch || items.length > 0) {
        return { ...section, items: sectionMatch ? section.items : items };
      }
      return null;
    }).filter(Boolean) as typeof ADMIN_DOC_SECTIONS;
  }, [query]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setOpenSections(new Set(ADMIN_DOC_SECTIONS.map((s) => s.id)));
  const collapseAll = () => setOpenSections(new Set());

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{ADMIN_DOCS_INTRO.title}</h1>
          <p className="text-gray-500 mt-2 max-w-3xl">{ADMIN_DOCS_INTRO.subtitle}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Collapse all
          </button>
        </div>
      </div>

      <Card>
        <CardTitle>Quick Start</CardTitle>
        <ul className="mt-4 space-y-2">
          {ADMIN_DOCS_INTRO.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2 text-sm text-gray-600">
              <span className="text-[#6D28D9] mt-0.5">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="sticky top-0 z-10 bg-[#F5F6FA]/90 backdrop-blur-sm py-2 -mx-1 px-1">
        <Input
          placeholder="Search documentation…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xl bg-white"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[240px_1fr] gap-6 items-start">
        <nav className="hidden xl:block sticky top-20">
          <Card className="p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              On this page
            </p>
            <ul className="space-y-1">
              {filteredSections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block px-2 py-1.5 text-sm text-gray-600 hover:text-[#6D28D9] rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </nav>

        <div className="space-y-4 min-w-0">
          {filteredSections.length === 0 && (
            <Card className="text-center py-12">
              <p className="text-gray-500">No sections match &quot;{query}&quot;</p>
            </Card>
          )}

          {filteredSections.map((section) => {
            const isOpen = openSections.has(section.id);
            return (
              <Card key={section.id} id={section.id} className="scroll-mt-24 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-start justify-between gap-4 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                      {section.href && (
                        <Link
                          href={section.href}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-medium text-[#6D28D9] bg-purple-50 px-2 py-1 rounded-md hover:bg-purple-100"
                        >
                          Open page →
                        </Link>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{section.summary}</p>
                  </div>
                  <ChevronIcon
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-5 border-t border-gray-100 pt-4 space-y-3">
                    {section.items.map((item) => (
                      <div
                        key={item.name}
                        className="p-4 rounded-xl bg-gray-50/80 border border-gray-100"
                      >
                        <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
