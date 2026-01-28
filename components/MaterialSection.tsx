
import React, { useState, useEffect } from 'react';
import { Material } from '../types';
import { Plus, Trash2, RotateCcw, Save, Edit2, X, Loader2 } from 'lucide-react';

interface Props {
  materials: Material[];
  isEditMode: boolean;
  onToggleEdit: () => void;
  onUpdateMaterial: (index: number, updated: Material) => void;
  onAddRow: () => void;
  onRemoveRow: () => void;
  onReset: () => void;
  onSave: () => void;
  isLoading?: boolean;
}

const MaterialSection: React.FC<Props> = ({
  materials,
  isEditMode,
  onToggleEdit,
  onUpdateMaterial,
  onAddRow,
  onRemoveRow,
  onReset,
  onSave,
  isLoading = false
}) => {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  // Reset selection when exiting edit mode
  useEffect(() => {
    if (!isEditMode) {
      setSelectedIndices(new Set());
    }
  }, [isEditMode]);

  const handleInputChange = (index: number, field: keyof Material, value: string) => {
    onUpdateMaterial(index, { ...materials[index], [field]: value });
  };

  const toggleSelectAll = () => {
    if (selectedIndices.size === materials.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(materials.map((_, i) => i)));
    }
  };

  const toggleSelectRow = (index: number) => {
    const next = new Set(selectedIndices);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setSelectedIndices(next);
  };

  const isAllSelected = materials.length > 0 && selectedIndices.size === materials.length;
  const isSomeSelected = selectedIndices.size > 0 && selectedIndices.size < materials.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[300px] relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-20">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-widest">Loading Materials...</span>
          </div>
        </div>
      )}

      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-slate-800">Required Materials</h3>
            {isEditMode && selectedIndices.size > 0 && (
              <span className="text-xs font-semibold text-teal-600">{selectedIndices.size} items selected</span>
            )}
          </div>
          <button 
            onClick={onToggleEdit}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isEditMode 
                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-100'
            }`}
          >
            {isEditMode ? (
              <><X className="w-4 h-4" /> <span>Cancel Edit</span></>
            ) : (
              <><Edit2 className="w-4 h-4" /> <span>Edit Materials</span></>
            )}
          </button>
        </div>

        {/* MOBILE SELECT ALL BAR */}
        {isEditMode && (
          <div className="lg:hidden flex items-center justify-between p-3 bg-teal-50 border border-teal-100 rounded-xl animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                id="mobile-select-all"
                className="w-5 h-5 rounded border-teal-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                checked={isAllSelected}
                ref={(el) => { if (el) el.indeterminate = isSomeSelected; }}
                onChange={toggleSelectAll}
              />
              <label htmlFor="mobile-select-all" className="text-sm font-bold text-teal-800 uppercase tracking-tight">
                Select All ({materials.length})
              </label>
            </div>
            {selectedIndices.size > 0 && (
              <span className="text-[10px] font-black text-teal-600 bg-white px-2 py-1 rounded-full border border-teal-200 shadow-sm">
                {selectedIndices.size} SELECTED
              </span>
            )}
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-teal-600 text-white">
              {isEditMode && (
                <th className="px-4 py-3 border-r border-teal-500 w-12 text-center">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-teal-400 text-teal-600 focus:ring-teal-500 cursor-pointer accent-white"
                      checked={isAllSelected}
                      ref={(el) => { if (el) el.indeterminate = isSomeSelected; }}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
              )}
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-teal-500 w-12 text-center">No</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-teal-500 min-w-[140px]">Part No.</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-teal-500 min-w-[200px]">Description</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-teal-500 w-24">Qty</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-teal-500 w-24">UoM</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-teal-500 min-w-[140px]">Avail.</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-teal-500 min-w-[100px]">PR</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-teal-500 min-w-[100px]">PO</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r border-teal-500 min-w-[200px]">Note</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider min-w-[140px]">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {materials.map((mat, idx) => (
              <tr 
                key={idx} 
                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-teal-50/40 transition-colors ${selectedIndices.has(idx) ? 'bg-teal-50' : ''}`}
              >
                {isEditMode && (
                  <td className="px-4 py-2 border-r border-slate-100 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      checked={selectedIndices.has(idx)}
                      onChange={() => toggleSelectRow(idx)}
                    />
                  </td>
                )}
                <td className="px-4 py-3 text-sm font-medium text-slate-500 text-center border-r border-slate-100">{idx + 1}</td>
                <td className="px-4 py-2 border-r border-slate-100">
                  <input 
                    readOnly={!isEditMode}
                    value={mat.partNo}
                    onChange={(e) => handleInputChange(idx, 'partNo', e.target.value)}
                    className={`w-full bg-transparent text-sm border-none focus:ring-0 px-0 placeholder:text-slate-300 ${!isEditMode ? 'cursor-default' : ''}`}
                    placeholder="PN-123"
                  />
                </td>
                <td className="px-4 py-2 border-r border-slate-100">
                  <input 
                    readOnly={!isEditMode}
                    value={mat.description}
                    onChange={(e) => handleInputChange(idx, 'description', e.target.value)}
                    className={`w-full bg-transparent text-sm border-none focus:ring-0 px-0 placeholder:text-slate-300 ${!isEditMode ? 'cursor-default' : ''}`}
                    placeholder="Describe item..."
                  />
                </td>
                <td className="px-4 py-2 border-r border-slate-100">
                  <input 
                    readOnly={!isEditMode}
                    type="number"
                    value={mat.qty}
                    onChange={(e) => handleInputChange(idx, 'qty', e.target.value)}
                    className={`w-full bg-transparent text-sm border-none focus:ring-0 px-0 text-center placeholder:text-slate-300 ${!isEditMode ? 'cursor-default' : ''}`}
                    placeholder="0"
                  />
                </td>
                <td className="px-4 py-2 border-r border-slate-100">
                  <input 
                    readOnly={!isEditMode}
                    value={mat.uom}
                    onChange={(e) => handleInputChange(idx, 'uom', e.target.value)}
                    className={`w-full bg-transparent text-sm border-none focus:ring-0 px-0 text-center placeholder:text-slate-300 ${!isEditMode ? 'cursor-default' : ''}`}
                    placeholder="EA"
                  />
                </td>
                <td className="px-4 py-2 border-r border-slate-100">
                  <input 
                    readOnly={!isEditMode}
                    value={mat.availability}
                    onChange={(e) => handleInputChange(idx, 'availability', e.target.value)}
                    className={`w-full bg-transparent text-sm border-none focus:ring-0 px-0 placeholder:text-slate-300 ${!isEditMode ? 'cursor-default' : ''}`}
                    placeholder="In Stock"
                  />
                </td>
                <td className="px-4 py-2 border-r border-slate-100">
                  <input 
                    readOnly={!isEditMode}
                    value={mat.pr}
                    onChange={(e) => handleInputChange(idx, 'pr', e.target.value)}
                    className={`w-full bg-transparent text-sm border-none focus:ring-0 px-0 placeholder:text-slate-300 ${!isEditMode ? 'cursor-default' : ''}`}
                    placeholder="PR-..."
                  />
                </td>
                <td className="px-4 py-2 border-r border-slate-100">
                  <input 
                    readOnly={!isEditMode}
                    value={mat.po}
                    onChange={(e) => handleInputChange(idx, 'po', e.target.value)}
                    className={`w-full bg-transparent text-sm border-none focus:ring-0 px-0 placeholder:text-slate-300 ${!isEditMode ? 'cursor-default' : ''}`}
                    placeholder="PO-..."
                  />
                </td>
                <td className="px-4 py-2 border-r border-slate-100">
                  <input 
                    readOnly={!isEditMode}
                    value={mat.note}
                    onChange={(e) => handleInputChange(idx, 'note', e.target.value)}
                    className={`w-full bg-transparent text-sm border-none focus:ring-0 px-0 placeholder:text-slate-300 ${!isEditMode ? 'cursor-default' : ''}`}
                    placeholder="Reference..."
                  />
                </td>
                <td className="px-4 py-2">
                  <input 
                    readOnly={!isEditMode}
                    type="date"
                    value={mat.dateChange}
                    onChange={(e) => handleInputChange(idx, 'dateChange', e.target.value)}
                    className={`w-full bg-transparent text-xs border-none focus:ring-0 px-0 ${!isEditMode ? 'cursor-default' : ''}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid */}
      <div className="lg:hidden p-4 space-y-4 bg-slate-50/30">
        {materials.map((mat, idx) => (
          <div 
            key={idx} 
            className={`bg-white rounded-xl border transition-all duration-200 shadow-sm p-4 space-y-3 relative ${selectedIndices.has(idx) ? 'border-teal-500 ring-1 ring-teal-500' : 'border-slate-200'}`}
            onClick={() => isEditMode && toggleSelectRow(idx)}
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                {isEditMode && (
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    checked={selectedIndices.has(idx)}
                    onChange={() => {}} // Handled by div click
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <span className="text-xs font-bold text-teal-600 uppercase">Material {idx + 1}</span>
              </div>
              {isEditMode && (
                <span className="text-[10px] text-slate-400 font-bold">CLICK TO SELECT</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Part No</label>
                <div className="text-sm font-medium text-slate-700 truncate">{mat.partNo || '—'}</div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Qty ({mat.uom || 'UoM'})</label>
                <div className="text-sm font-medium text-slate-700">{mat.qty || '0'}</div>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Description</label>
                <div className="text-sm font-medium text-slate-700 truncate">{mat.description || 'No description'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-3">
        {isEditMode ? (
          <>
            <button 
              onClick={onAddRow}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" /> <span>Add Row</span>
            </button>
            <button 
              onClick={onRemoveRow}
              className="flex items-center space-x-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <Trash2 className="w-4 h-4" /> <span>Remove Row</span>
            </button>
            <button 
              onClick={onReset}
              className="flex items-center space-x-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <RotateCcw className="w-4 h-4" /> <span>Reset</span>
            </button>
            <div className="flex-grow" />
            <button 
              onClick={onSave}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-teal-100 transition-all"
            >
              <Save className="w-4 h-4" /> <span>Save Changes</span>
            </button>
          </>
        ) : (
          <div className="text-sm text-slate-500 font-medium">
            Viewing {materials.length} material records for this finding.
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialSection;
