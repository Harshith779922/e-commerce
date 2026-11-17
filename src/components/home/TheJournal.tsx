import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface JournalArticle {
  id: string;
  category: string;
  issue: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  slug: string;
}

const ARTICLES: JournalArticle[] = [
  {
    id: '1',
    category: 'SARTORIAL ESSAY',
    issue: 'CHRONICLE NO. 01',
    title: 'The Architecture of Midnight: Why Obsidian and Deep Bordeaux Define the Maison',
    excerpt: 'Examining the interplay of low-reflective virgin wools and radiant silk lapels in ambient lighting.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop',
    readTime: '4 MIN READ',
    slug: 'the-architecture-of-midnight',
  },
  {
    id: '2',
    category: 'TEXTILE ARCHIVE',
    issue: 'CHRONICLE NO. 02',
    title: 'From Lombard Looms to Structured Form: The Heritage of Pure Como Silk Twill',
    excerpt: 'A private tour through the Como watermills where our pocket squares and dress shirt silks are woven.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=900&auto=format&fit=crop',
    readTime: '6 MIN READ',
    slug: 'from-lombard-looms-to-structured-form',
  },
  {
    id: '3',
    category: 'ATELIER STUDY',
    issue: 'CHRONICLE NO. 03',
    title: 'The Contemporary Tuxedo: Proportions, Horsehair Canvassing, and Gala Etiquette',
    excerpt: 'A definitive guide to black-tie eveningwear: choosing between peak lapels, shawl collars, and structured shoulder lines.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=900&auto=format&fit=crop',
    readTime: '5 MIN READ',
    slug: 'the-contemporary-tuxedo-proportions',
  },
];

export default function TheJournal() {
  return (
    <section className="bg-[#101010] text-[#F2EEE5] py-24 sm:py-36 border-t border-[#241C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="w-8 h-[1px] bg-[#B69A63]" />
              <span className="text-[11px] font-sans tracking-[0.3em] uppercase text-[#B69A63] font-medium">
                CHAPTER VII · THE JOURNAL
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#F2EEE5] font-light tracking-tight">
              Maison Chronicles
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#85817B] max-w-md font-sans font-light leading-relaxed">
            Essays on sartorial silhouette, textile provenance, and the evolving philosophy of modern luxury dressing.
          </p>
        </div>

        {/* 3 Editorial Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              className="group bg-[#141010] border border-[#2A2424] hover:border-[#B69A63]/50 transition-all duration-500 overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#181212]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141010] via-transparent to-transparent opacity-70" />
                <span className="absolute top-4 left-4 text-[9px] font-mono tracking-widest text-[#B69A63] bg-[#101010]/85 px-2 py-1 border border-[#2A2424]">
                  {article.issue}
                </span>
              </div>

              <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#85817B] mb-2">
                    <span className="text-[#B69A63]">{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl text-[#F2EEE5] font-light leading-snug group-hover:text-[#B69A63] transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-2.5 text-xs text-[#85817B] font-sans leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#241C1C] flex items-center justify-between">
                  <span className="text-[11px] font-sans tracking-[0.2em] text-[#F2EEE5] group-hover:text-[#B69A63] uppercase transition-colors">
                    READ CHRONICLE
                  </span>
                  <div className="w-7 h-7 rounded-full border border-[#2A2424] group-hover:border-[#B69A63] flex items-center justify-center text-[#85817B] group-hover:text-[#B69A63] transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
