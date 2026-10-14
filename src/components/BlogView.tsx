import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, BookOpen, Clock, Share2, Check, UserCheck } from 'lucide-react';
import { resolveImageUrl, handleImageError } from '../utils/imageHelper';

interface Article {
  id: number;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  author: string;
  content: string[];
}

export const BlogView: React.FC = () => {
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const articles: Article[] = [
    {
      id: 1,
      title: 'Identifying the "Meters First" Dial in Vintage Rolex Submariners',
      category: 'FINE HOROLOGY',
      date: 'October 2026',
      readTime: '6 min read',
      author: 'Julian Vance, Senior Horological Conservator',
      excerpt: 'A comprehensive study of Reference 5513 font kerning, pumpkin tritium patina degradation curves, and case chamfer preservation.',
      image: '/images/curio_item_rolex_1791467020069.jpg',
      content: [
        'Among vintage sports watches, the Rolex Submariner Reference 5513 commands a legendary position among collectors. Produced from roughly 1962 through 1989, it witnessed pivotal manufacturing evolutions.',
        'The early "Meters First" execution—where the depth rating reads "200m = 660ft" instead of the later "660ft = 200m"—represents an exceedingly narrow manufacturing window between 1967 and approximately 1970.',
        'When authenticating these dials, curatorial examination must focus on three distinct markers: open "6" typography, the subtle crossbar positioning on the "t" in "Submariner", and the natural decay luminescence of original Swiss-T < 25 tritium markers under ultraviolet light.',
        'Beware of re-lumed dials: genuine tritium exhibits a uniform honey-pumpkin tone that neither flattens under 365nm UV nor retains active green phosphorescence past 2 seconds of excitation.',
      ],
    },
    {
      id: 2,
      title: 'Archaic Athenian Coinage: The Owl Tetradrachm Through Periclean Eyes',
      category: 'NUMISMATICS',
      date: 'September 2026',
      readTime: '8 min read',
      author: 'Dr. Helena Moros, Classical Numismatist',
      excerpt: 'How the Laurion silver mines financed Athenian naval hegemony and birthed classical Mediterranean trade standards.',
      image: '/images/curio_item_coin_1791467051484.jpg',
      content: [
        'The silver tetradrachm of Athens—affectionately dubbed the "Owl" (glaux)—is arguably the most influential coin struck in human history. Struck with silver extracted from the Laurion mines, it became the undisputed international reserve currency of the ancient Mediterranean.',
        'The obverse displays Athena Parthenos wearing an Attic helmet ornamented with olive leaves and a spiral palmette. The reverse proudly bears the owl of wisdom, an olive sprig, a crescent moon, and the abbreviation ΑΘΕ ("of the Athenians").',
        'When evaluating high-relief classical issues (circa 440–404 BC), numismatic grade relies heavily on centering and horn strike completeness. Many surviving coins have the helmet crest partially off-flan due to the high-velocity hammer strikes required to impress 17.2 grams of pure silver.',
        'A certified coin with complete crest, full owl plumage, and original cabinet toning represents an apex numismatic acquisition.',
      ],
    },
    {
      id: 3,
      title: 'Mechanical Rangefinder Calibration: The Leica M3 Double-Stroke Legacy',
      category: 'VINTAGE OPTICS',
      date: 'August 2026',
      readTime: '5 min read',
      author: 'Marcus Brandt, Optical Preservationist',
      excerpt: 'Why 0.91x magnification rangefinder prisms remain unmatched for 50mm Summicron street documentary mastery.',
      image: '/images/curio_item_camera_1791467068473.jpg',
      content: [
        'Introduced in 1954 at Photokina, the Leica M3 revolutionized documentary photography by marrying a combined coincident rangefinder and viewfinder into an ultra-bright optical masterpiece.',
        'With its 0.91x magnification—the highest ever installed on a standard M-body—both eyes can comfortably remain open while framing with a 50mm lens. The rangefinder baseline of 68.5mm offers unmatched optical focusing precision, even at f/1.4 apertures.',
        'Early serial numbers (prior to #919,251) feature the classic double-stroke film advance mechanism with a glass pressure plate, coveted for its buttery mechanical resistance and silent shutter brake.',
      ],
    },
  ];

  const activeArticle = articles.find((a) => a.id === selectedArticleId);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (activeArticle) {
    return (
      <div className="bg-white min-h-[85vh] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <button
            onClick={() => setSelectedArticleId(null)}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-black uppercase tracking-wider cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Curatorial Journal</span>
          </button>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-mono-num font-semibold text-neutral-400">
              <span className="text-[#bfa054] uppercase tracking-wider">{activeArticle.category}</span>
              <span>·</span>
              <span>{activeArticle.date}</span>
              <span>·</span>
              <span>{activeArticle.readTime}</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[#0c1926] leading-tight">
              {activeArticle.title}
            </h1>

            <div className="flex items-center justify-between py-4 border-y border-neutral-200 text-xs">
              <div className="flex items-center gap-2 text-neutral-700">
                <UserCheck className="w-4 h-4 text-[#bfa054]" />
                <span>{activeArticle.author}</span>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-300 rounded text-neutral-600 hover:text-black hover:border-black transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied' : 'Share Study'}</span>
              </button>
            </div>
          </div>

          <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-neutral-200">
            <img
              src={resolveImageUrl(activeArticle.image)}
              alt={activeArticle.title}
              onError={handleImageError}
              className="w-full h-full object-cover filter contrast-105"
            />
          </div>

          <div className="space-y-6 text-sm text-neutral-700 leading-relaxed font-light">
            {activeArticle.content.map((paragraph, idx) => (
              <p key={idx} className="text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="p-6 bg-[#f8f9fb] border border-neutral-200 rounded-xl space-y-3 mt-12">
            <h4 className="font-serif-luxury text-base font-semibold text-neutral-900">
              Interested in Consigning Similar Rare Memorabilia?
            </h4>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Our specialists evaluate rare timepieces, classical coins, and vintage optical equipment daily. Submit an inquiry for a complimentary valuation report.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[85vh] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-mono-num text-[11px] uppercase tracking-wider text-[#bfa054] font-bold block">
            COLLECTOR DISPATCHES & ARCHIVES
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[#0c1926]">
            The Curatorial Journal
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
            Scholarly insights on horological engineering, classical numismatics, provenance verification, and collector stewardship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article 
              key={art.id} 
              onClick={() => setSelectedArticleId(art.id)}
              className="group flex flex-col space-y-4 cursor-pointer"
            >
              <div className="aspect-[16/10] bg-neutral-100 overflow-hidden rounded-lg">
                <img
                  src={resolveImageUrl(art.image)}
                  alt={art.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                    <span className="text-[#bfa054]">{art.category}</span>
                    <span>·</span>
                    <span>{art.date}</span>
                  </div>

                  <h3 className="font-serif-luxury text-lg font-semibold text-[#0c1926] group-hover:text-[#bfa054] transition-colors mt-1.5 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-neutral-600 font-light mt-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center gap-1 text-xs font-semibold text-[#0c1926] group-hover:text-[#bfa054]">
                  <span>Read Curatorial Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
