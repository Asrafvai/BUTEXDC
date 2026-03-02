import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAlumni } from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Users, Briefcase, ChevronDown } from 'lucide-react';

const AlumniCard = ({ alum }) => (
  <Card className="bg-[#000000] border-[#333333] hover:border-[#FF7F00]/50 transition-all hover-lift overflow-hidden" data-testid={`alumni-card-${alum.id}`}>
    <div className="aspect-square bg-[#252525] flex items-center justify-center">
      {alum.photo_url ? (
        <img src={alum.photo_url} alt={alum.name} className="w-full h-full object-cover" />
      ) : (
        <Users className="h-24 w-24 text-gray-600" />
      )}
    </div>
    <CardContent className="p-6">
      <h3 className="text-xl font-semibold mb-2 text-white">{alum.name}</h3>
      <p className="text-[#FF7F00] text-sm mb-1">{alum.designation}</p>
      <p className="text-gray-500 text-xs mb-3">Batch: {alum.batch}</p>
      <div className="flex items-start gap-2 text-sm text-gray-400">
        <Briefcase className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#FF7F00]" />
        <p>{alum.current_occupation}</p>
      </div>
    </CardContent>
  </Card>
);

const AlumniPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    loadAlumni();
  }, []);

  const loadAlumni = async () => {
    try {
      const response = await getAlumni();
      setAlumni(response.data);
    } catch (error) {
      console.error('Failed to load alumni:', error);
    }
  };

  const batches = useMemo(() => {
    const batchSet = [...new Set(alumni.map(a => a.batch))];
    batchSet.sort((a, b) => b.localeCompare(a));
    return batchSet;
  }, [alumni]);

  const filteredAlumni = useMemo(() => {
    if (selectedBatch === 'all') return alumni;
    return alumni.filter(a => a.batch === selectedBatch);
  }, [alumni, selectedBatch]);

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8 text-gray-400 hover:text-[#FF7F00]" data-testid="back-home-button">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-5xl font-bold mb-2" data-testid="alumni-page-title">Alumni of BUTEX DC</h1>
            <p className="text-gray-400">Meet our distinguished alumni who have made their mark</p>
          </div>

          {/* Batch Dropdown */}
          <div className="relative" data-testid="batch-dropdown">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-[#0A0A0A] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white hover:border-[#FF7F00]/50 transition-all min-w-[180px] justify-between"
              data-testid="batch-dropdown-trigger"
            >
              <span>{selectedBatch === 'all' ? 'All Batches' : `Batch ${selectedBatch}`}</span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-1 z-20 bg-[#0A0A0A] border border-[#333] rounded-lg shadow-xl overflow-hidden min-w-[180px]" data-testid="batch-dropdown-menu">
                <button
                  onClick={() => { setSelectedBatch('all'); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#252525] transition-colors ${selectedBatch === 'all' ? 'text-[#FF7F00] bg-[#FF7F00]/5' : 'text-white'}`}
                  data-testid="batch-option-all"
                >
                  All Batches ({alumni.length})
                </button>
                {batches.map(batch => {
                  const count = alumni.filter(a => a.batch === batch).length;
                  return (
                    <button
                      key={batch}
                      onClick={() => { setSelectedBatch(batch); setDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#252525] transition-colors ${selectedBatch === batch ? 'text-[#FF7F00] bg-[#FF7F00]/5' : 'text-white'}`}
                      data-testid={`batch-option-${batch}`}
                    >
                      Batch {batch} ({count})
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Selected batch header */}
        {selectedBatch !== 'all' && (
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-[#FF7F00]" data-testid="batch-heading">Batch {selectedBatch}</h2>
            <span className="text-gray-500 text-sm">({filteredAlumni.length} alumni)</span>
          </div>
        )}

        {selectedBatch === 'all' ? (
          /* Grouped by batch */
          batches.map(batch => {
            const batchAlumni = alumni.filter(a => a.batch === batch);
            return (
              <div key={batch} className="mb-10" data-testid={`batch-group-${batch}`}>
                <div className="flex items-center gap-3 mb-5 border-b border-[#333] pb-3">
                  <h2 className="text-2xl font-semibold text-[#FF7F00]">Batch {batch}</h2>
                  <span className="text-gray-500 text-sm">({batchAlumni.length})</span>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {batchAlumni.map((alum) => (
                    <AlumniCard key={alum.id} alum={alum} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {filteredAlumni.map((alum) => (
              <AlumniCard key={alum.id} alum={alum} />
            ))}
          </div>
        )}

        {alumni.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No alumni profiles yet</p>
          </div>
        )}
        {selectedBatch !== 'all' && filteredAlumni.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No alumni in Batch {selectedBatch}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniPage;
