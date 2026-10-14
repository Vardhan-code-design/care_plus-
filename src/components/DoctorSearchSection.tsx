import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Check,
  Star,
  Clock,
  Sparkles,
  ArrowUpDown,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useCare } from '../context/CareContext';
import { DoctorCard } from './DoctorCard';
import { Doctor } from '../types';

export const DoctorSearchSection: React.FC = () => {
  const {
    doctors,
    searchQuery,
    setSearchQuery,
    selectedSpecialty,
    setSelectedSpecialty,
    setBookingDoctor,
  } = useCare();

  const [feeFilter, setFeeFilter] = useState<'all' | 'under800' | '800to1200' | 'above1200'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [instantBookingOnly, setInstantBookingOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'feeAsc' | 'feeDesc'>('rating');

  // Filter verified doctors for public search
  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => {
        // Only verified doctors appear to the public
        if (doc.verificationStatus !== 'verified') return false;

        // Specialty filter
        if (selectedSpecialty && doc.specialty !== selectedSpecialty) return false;

        // Search query (name or specialty)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = doc.name.toLowerCase().includes(q);
          const matchSpec = doc.specialty.toLowerCase().includes(q);
          const matchQual = doc.qualifications.toLowerCase().includes(q);
          const matchHosp = doc.hospitalAffiliation.toLowerCase().includes(q);
          if (!matchName && !matchSpec && !matchQual && !matchHosp) return false;
        }

        // Fee filter
        if (feeFilter === 'under800' && doc.fee >= 800) return false;
        if (feeFilter === '800to1200' && (doc.fee < 800 || doc.fee > 1200)) return false;
        if (feeFilter === 'above1200' && doc.fee <= 1200) return false;

        // Rating filter
        if (minRating > 0 && doc.rating < minRating) return false;

        // Instant booking only
        if (instantBookingOnly && doc.requiresDoctorApproval) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
        if (sortBy === 'feeAsc') return a.fee - b.fee;
        if (sortBy === 'feeDesc') return b.fee - a.fee;
        return 0;
      });
  }, [doctors, searchQuery, selectedSpecialty, feeFilter, minRating, instantBookingOnly, sortBy]);

  return (
    <section id="find-doctors" className="py-16 bg-slate-50/50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">
              Practitioner Discovery
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Specialists & Doctors
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Inspect medical credentials, consultation fees in ₹, and real-time appointment slot availability.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium self-start sm:self-auto">
            Showing <strong className="text-slate-900">{filteredDoctors.length}</strong> verified doctors
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs mb-8 space-y-4">
          {/* Top row: search & sorting */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, specialty, hospital..."
                className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="rating">Top Rated (★)</option>
                <option value="experience">Most Experienced</option>
                <option value="feeAsc">Fee: Low to High (₹)</option>
                <option value="feeDesc">Fee: High to Low (₹)</option>
              </select>
            </div>
          </div>

          {/* Bottom row: Filter chips (fee, rating, instant booking) */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Fee options */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Fee:
              </span>
              {[
                { id: 'all', label: 'All Fees' },
                { id: 'under800', label: 'Under ₹800' },
                { id: '800to1200', label: '₹800 - ₹1200' },
                { id: 'above1200', label: '₹1200+' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFeeFilter(f.id as any)}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    feeFilter === f.id
                      ? 'bg-sky-600 text-white font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Instant booking toggle */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium select-none">
                <input
                  type="checkbox"
                  checked={instantBookingOnly}
                  onChange={(e) => setInstantBookingOnly(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <span>Instant Booking Only</span>
              </label>

              {(searchQuery || selectedSpecialty || feeFilter !== 'all' || instantBookingOnly) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSpecialty(null);
                    setFeeFilter('all');
                    setInstantBookingOnly(false);
                  }}
                  className="text-xs text-sky-700 hover:text-sky-900 font-semibold cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Doctor Results Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Doctors Match Your Filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try clearing search terms or fee restrictions to see all available practitioners.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty(null);
                setFeeFilter('all');
                setInstantBookingOnly(false);
              }}
              className="mt-2 px-4 py-2 bg-sky-600 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Show All Verified Doctors
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onBookClick={(doctor) => setBookingDoctor(doctor)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
