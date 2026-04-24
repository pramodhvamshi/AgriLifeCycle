import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle2, 
    XCircle, 
    MessageSquare, 
    Layers, 
    User, 
    Calendar,
    ArrowRightLeft,
    Check
} from 'lucide-react';
import './ExpertDashboard.css';

const ExpertDashboard = () => {
    const [activeTab, setActiveTab] = useState('crops');
    const [pendingData, setPendingData] = useState({ crops: [], quality: [], decisions: [] });
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [notes, setNotes] = useState('');
    const [modifiedValue, setModifiedValue] = useState('');
    const [filterStatus, setFilterStatus] = useState('Pending'); // Pending or Reviewed
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/expert/pending-requests');
            setPendingData(res.data);
            setLoading(false);
        } catch (err) { console.error(err); }
    };

    const handleValidate = async (status) => {
        let endpoint = '';
        const body = { status, notes };

        console.log("Submitting validation:", { status, notes, activeTab });

        if (activeTab === 'crops') {
            endpoint = `validate-crop/${selectedItem?._id}`;
            body.modifiedCrop = status === 'Modified' ? modifiedValue : selectedItem?.mlPrediction?.crop;
        } else if (activeTab === 'quality') {
            endpoint = `validate-quality/${selectedItem?._id}`;
            body.modifiedGrade = status === 'Modified' ? modifiedValue : selectedItem?.systemGrade?.grade;
        } else {
            endpoint = `validate-post-harvest/${selectedItem?._id}`;
            body.modifiedAction = status === 'Modified' ? modifiedValue : selectedItem?.systemDecision?.action;
        }

        try {
            console.log("Request Body:", body);
            const res = await axios.post(`http://localhost:5000/api/expert/${endpoint}`, body);
            console.log("Validation Response:", res.data);
            setSelectedItem(null);
            setNotes('');
            setModifiedValue('');
            fetchPending();
        } catch (err) { 
            console.error(err);
            alert("Failed to submit validation.");
        }
    };

    const currentTabItems = pendingData[activeTab] || [];
    
    const filteredItems = currentTabItems.filter(item => {
        const matchesStatus = filterStatus === 'Pending' 
            ? item.expertValidation.status === 'Pending'
            : item.expertValidation.status !== 'Pending';
        
        const matchesSearch = item.farmer?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.mlPrediction?.crop?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.systemGrade?.grade?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.systemDecision?.action?.toLowerCase().includes(searchQuery.toLowerCase());
                             
        return matchesStatus && matchesSearch;
    });

    const handleItemSelect = (item) => {
        setSelectedItem(item);
        setNotes(item?.expertValidation?.notes || '');
        if (activeTab === 'crops') {
            setModifiedValue(item?.expertValidation?.modifiedCrop || item?.mlPrediction?.crop);
        } else if (activeTab === 'quality') {
            setModifiedValue(item?.expertValidation?.modifiedGrade || item?.systemGrade?.grade);
        } else {
            setModifiedValue(item?.expertValidation?.modifiedAction || item?.systemDecision?.action);
        }
    };

    return (
        <div className="expert-container">
            <header className="expert-header">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Expert Verification Hub</h1>
                    <p className="text-slate-500 mt-1">Review and validate automated agricultural insights</p>
                </div>
                
                <div className="flex flex-col gap-4 items-end">
                    <div className="tab-switcher">
                        {['crops', 'quality', 'decisions'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setSelectedItem(null); }}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="expert-controls">
                <div className="status-filters">
                    {['Pending', 'Reviewed'].map(status => (
                        <button
                            key={status}
                            onClick={() => { setFilterStatus(status); setSelectedItem(null); }}
                            className={`filter-chip ${filterStatus === status ? 'active' : ''}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Search by farmer or crop..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="expert-grid">
                {/* Pending List */}
                <div className="pending-list scrollable-area">
                    {loading ? (
                        <div className="text-center py-20 text-slate-400">Loading requests...</div>
                    ) : filteredItems.length === 0 ? (
                        <div className="glass-card p-20 text-center" style={{ borderStyle: 'dashed', borderWidth: '2px' }}>
                            <CheckCircle2 size={48} className="mx-auto text-primary-200 mb-4" />
                            <h3 className="text-xl font-bold text-slate-400">No records found</h3>
                            <p className="text-slate-400 mt-1">Try adjusting your filters or search.</p>
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <motion.div 
                                key={item._id}
                                layoutId={item._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => handleItemSelect(item)}
                                className={`glass-card request-card ${selectedItem?._id === item._id ? 'selected' : ''}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="farmer-avatar">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{item.farmer?.fullName}</h4>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`status-badge badge-${item?.expertValidation?.status?.toLowerCase()}`}>
                                            {item?.expertValidation?.status}
                                        </div>
                                        <p className="prediction-label mt-2">
                                            {activeTab === 'crops' ? 'Prediction' : activeTab === 'quality' ? 'Grade' : 'Decision'}
                                        </p>
                                        <p className="prediction-value">
                                            {activeTab === 'crops' ? item?.mlPrediction?.crop : activeTab === 'quality' ? `Grade ${item?.systemGrade?.grade}` : item?.systemDecision?.action}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Validation Panel */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {selectedItem ? (
                            <motion.div 
                                key="panel"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="glass-card validation-panel"
                            >
                                <h3 className="panel-title">
                                    <Layers className="text-primary" size={20} />
                                    Review Details
                                </h3>

                                <div className="space-y-6">
                                    <div className="data-section">
                                        <p className="prediction-label" style={{ color: 'var(--slate-400)', marginBottom: '1rem' }}>Input Parameters</p>
                                        <div className="data-grid">
                                            {activeTab === 'crops' && (
                                                <>
                                                    <span className="data-label">Soil N:</span> <span className="data-value">{selectedItem?.soilData?.N}</span>
                                                    <span className="data-label">Soil P:</span> <span className="data-value">{selectedItem?.soilData?.P}</span>
                                                    <span className="data-label">Soil K:</span> <span className="data-value">{selectedItem?.soilData?.K}</span>
                                                    <span className="data-label">pH:</span> <span className="data-value">{selectedItem?.soilData?.ph}</span>
                                                </>
                                            )}
                                            {activeTab === 'quality' && (
                                                <>
                                                    <span className="data-label">Moisture:</span> <span className="data-value">{selectedItem?.harvestData?.moisture}%</span>
                                                    <span className="data-label">Damage:</span> <span className="data-value">{selectedItem?.harvestData?.damage}%</span>
                                                    <span className="data-label">Maturity:</span> <span className="data-value">{selectedItem?.harvestData?.maturity}</span>
                                                </>
                                            )}
                                            {activeTab === 'decisions' && (
                                                <>
                                                    <span className="data-label">Crop:</span> <span className="data-value">{selectedItem?.cropName}</span>
                                                    <span className="data-label">Current:</span> <span className="data-value">₹{selectedItem?.currentPrice}</span>
                                                    <span className="data-label">Predicted:</span> <span className="data-value">₹{selectedItem?.predictedPrice}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="form-group">
                                            <label className="label ml-1">Expert Notes</label>
                                            <textarea 
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                className="input"
                                                style={{ height: '100px', padding: '1rem' }}
                                                placeholder="Professional observations..."
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="label ml-1">
                                                Modify {activeTab === 'crops' ? 'Crop' : activeTab === 'quality' ? 'Grade' : 'Action'}
                                            </label>
                                            <input 
                                                type="text"
                                                value={modifiedValue}
                                                onChange={(e) => setModifiedValue(e.target.value)}
                                                className="input"
                                                placeholder={`Modify ${activeTab}...`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="panel-actions">
                                    <button 
                                        onClick={() => handleValidate('Approved')}
                                        className="btn btn-primary btn-approve"
                                    >
                                        <Check size={18} /> Approve
                                    </button>
                                    <button 
                                        onClick={() => handleValidate('Modified')}
                                        className="btn btn-modify"
                                    >
                                        <ArrowRightLeft size={18} /> Modify
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="empty"
                                className="glass-card"
                                style={{ height: '400px', borderStyle: 'dashed', borderWidth: '2px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', color: 'var(--slate-300)' }}
                            >
                                <MessageSquare size={48} className="mb-4" />
                                <p className="font-bold">Select a request to start validation</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ExpertDashboard;
