import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sprout,
    Droplets,
    Thermometer,
    Wind,
    FlaskConical,
    CloudRain,
    CheckCircle2,
    ChevronRight,
    TrendingUp,
    AlertCircle,
    BadgeCheck,
    Clock,
    ShieldCheck,
    LayoutDashboard,
    User,
    ArrowRightLeft,
    XCircle,
    Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import './FarmerDashboard.css';

const FarmerDashboard = () => {
    const [activeTab, setActiveTab] = useState('planning');
    // ... rest of state ...
    const [soilData, setSoilData] = useState({
        N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: ''
    });
    const [prediction, setPrediction] = useState(null);
    const [qualityResult, setQualityResult] = useState(null);
    const [decisionResult, setDecisionResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState({ crops: [], quality: [], decisions: [] });

    // Quality Form
    const [qualityData, setQualityData] = useState({ moisture: '', damage: '', maturity: 'Optimal' });
    // Market Trend Data
    const [marketTrend, setMarketTrend] = useState([]);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/farmer/my-dashboard');
            setHistory(res.data);
            if (res.data.decisions.length > 0) {
                setDecisionResult(res.data.decisions[0]);
                updateMarketTrend(res.data.decisions[0].predictedPrices);
            }
        } catch (err) { console.error(err); }
    };

    const updateMarketTrend = (prices) => {
        if (!prices) return;
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const trend = prices.map((p, i) => ({
            name: days[i],
            price: p
        }));
        setMarketTrend(trend);
    };

    // (same imports and everything unchanged above)

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/farmer/predict-crop', soilData);
            setPrediction(res.data);
            fetchHistory();
        } catch (err) {
            console.error(err);

            // ✅ NEW CODE (ADDED ONLY THIS LINE)
            alert(err.response?.data?.error || "Something went wrong!");
        }
        setLoading(false);
    };

    const handleQuality = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/farmer/assess-quality', qualityData);
            setQualityResult(res.data);
            fetchHistory();
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleDecision = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/farmer/post-harvest-decision');
            setDecisionResult(res.data);
            updateMarketTrend(res.data.predictedPrices);
            fetchHistory();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Failed to get decision support.");
        }
        setLoading(false);
    };

    const mockPriceData = [
        { name: 'Mon', price: 2100 }, { name: 'Tue', price: 2150 },
        { name: 'Wed', price: 2080 }, { name: 'Thu', price: 2200 },
        { name: 'Fri', price: 2300 }, { name: 'Sat', price: 2250 },
        { name: 'Sun', price: 2400 },
    ];

    return (
        <div className="container max-w-6xl">
            <header className="dashboard-header">
                <h1 className="dashboard-title">Farmer Dashboard</h1>
                <p className="dashboard-subtitle">Manage your crop lifecycle and insights</p>
            </header>

            {/* Tabs */}
            <div className="tabs-container">
                {['planning', 'quality', 'post-harvest', 'market', 'history'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                    >
                        {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'planning' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="dashboard-grid"
                    >
                        {/* Input Form */}
                        <div className="glass-card input-card">
                            <h2 className="flex items-center gap-3 mb-8">
                                <FlaskConical className="text-primary" />
                                Soil Parameters
                            </h2>
                            <form onSubmit={handlePredict} className="grid grid-cols-2 gap-6 md-grid-cols-2">
                                {[
                                    { label: 'Nitrogen (N)', key: 'N', icon: FlaskConical },
                                    { label: 'Phosphorus (P)', key: 'P', icon: FlaskConical },
                                    { label: 'Potassium (K)', key: 'K', icon: FlaskConical },
                                    { label: 'pH Level', key: 'ph', icon: Droplets },
                                    { label: 'Temperature (°C)', key: 'temperature', icon: Thermometer },
                                    { label: 'Humidity (%)', key: 'humidity', icon: Wind },
                                    { label: 'Rainfall (mm)', key: 'rainfall', icon: CloudRain },
                                ].map((field) => (
                                    <div key={field.key} className="form-group">
                                        <label className="label flex items-center gap-2">
                                            <field.icon size={12} className="text-primary" />
                                            {field.label}
                                        </label>
                                        <input
                                            type="number" step="any" required
                                            value={soilData[field.key]}
                                            onChange={(e) => setSoilData({ ...soilData, [field.key]: e.target.value })}
                                            className="input"
                                            placeholder="0.00"
                                        />
                                    </div>
                                ))}
                                <div style={{ gridColumn: 'span 2' }} className="mt-4">
                                    <button
                                        disabled={loading}
                                        className="btn btn-primary w-full p-6"
                                    >
                                        {loading ? 'Analyzing...' : 'Predict Ideal Crop'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Result Display */}
                        <div className="flex flex-col gap-6">
                            {prediction ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-card result-card"
                                >
                                    <div className="relative">
                                        <p className="badge badge-success mb-4">
                                            <Sprout size={16} />
                                            ML Model Suggestion
                                        </p>
                                        <h3 className="prediction-title">
                                            {prediction.mlPrediction?.crop || prediction.crop}
                                        </h3>


                                        <div className="status-box status-box-amber">
                                            <Clock className="status-icon" size={24} />
                                            <div>
                                                <p className="status-title">Awaiting Expert Validation</p>
                                                <p className="status-text">Your prediction is in the expert review queue for final verification.</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="glass-card flex flex-col items-center justify-center p-10 text-center h-full" style={{ borderStyle: 'dashed' }}>
                                    <div className="icon-box icon-box-primary">
                                        <Sprout size={40} />
                                    </div>
                                    <h3 className="mb-2">Ready for Analysis</h3>
                                    <p className="text-slate-500 max-w-xs mt-2">
                                        Fill in your soil parameters to receive a smart crop recommendation.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'quality' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="dashboard-grid"
                    >
                        <div className="glass-card p-10">
                            <h2 className="mb-8">Quality Assessment</h2>
                            <form onSubmit={handleQuality} className="flex flex-col gap-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="form-group">
                                        <label className="label">Moisture Level (%)</label>
                                        <input
                                            type="number" required
                                            value={qualityData.moisture}
                                            onChange={(e) => setQualityData({ ...qualityData, moisture: e.target.value })}
                                            className="input" placeholder="e.g. 11"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Damage (%)</label>
                                        <input
                                            type="number" required
                                            value={qualityData.damage}
                                            onChange={(e) => setQualityData({ ...qualityData, damage: e.target.value })}
                                            className="input" placeholder="e.g. 5"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="label">Maturity Stage</label>
                                    <select
                                        value={qualityData.maturity}
                                        onChange={(e) => setQualityData({ ...qualityData, maturity: e.target.value })}
                                        className="input"
                                    >
                                        <option>Early</option>
                                        <option>Optimal</option>
                                        <option>Late</option>
                                    </select>
                                </div>
                                <button className="btn btn-primary w-full p-4">Grade Harvest</button>
                            </form>
                        </div>

                        <div className="flex flex-col gap-6">
                            {qualityResult ? (
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-8 result-card" style={{ background: 'var(--emerald-50)', borderColor: 'var(--emerald-100)' }}>
                                    <BadgeCheck className="text-emerald-600 mb-4" size={32} />
                                    <p className="badge badge-success">System Grade Result</p>
                                    <h3 className="prediction-title" style={{ fontSize: '4.5rem' }}>Grade {qualityResult.systemGrade.grade}</h3>
                                    <div className="status-box status-box-amber mt-2">
                                        <Clock className="status-icon" size={20} />
                                        <span className="status-text">Pending Expert Validation</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="glass-card flex flex-col items-center justify-center p-10 text-slate-300" style={{ borderStyle: 'dashed' }}>
                                    <CheckCircle2 size={40} className="mb-4" />
                                    <p className="font-bold">Provide harvest details</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'post-harvest' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="dashboard-grid"
                    >
                        <div className="glass-card p-10 flex flex-col items-center justify-center text-center">
                            <h2 className="mb-4">Decision Support</h2>
                            <p className="text-slate-500 mb-8 max-w-sm">
                                Our ML model will analyze your latest predicted crop and current market trends to provide an automated storage vs. sale recommendation.
                            </p>

                            <button
                                onClick={handleDecision}
                                disabled={loading}
                                className="btn btn-primary w-full max-w-xs p-5 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <Clock className="animate-spin" size={20} />
                                        Analyzing Market...
                                    </>
                                ) : (
                                    <>
                                        <TrendingUp size={20} />
                                        Get Smart Recommendation
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="flex flex-col gap-6">
                            {decisionResult ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`glass-card p-8 result-card decision-card-${decisionResult.systemDecision.action.toLowerCase()}`}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`p-3 rounded-2xl ${decisionResult.systemDecision.action === 'Store' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                            <TrendingUp size={32} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-slate-500">Current Price</p>
                                            <h4 className="text-2xl font-bold">₹{decisionResult.currentPrice}</h4>
                                        </div>
                                    </div>

                                    <p className="badge" style={{
                                        background: decisionResult.systemDecision.action === 'Store' ? 'var(--emerald-100)' : 'var(--blue-100)',
                                        color: decisionResult.systemDecision.action === 'Store' ? 'var(--emerald-700)' : 'var(--blue-700)'
                                    }}>
                                        Market Insight: {decisionResult.cropName}
                                    </p>

                                    <h3 className="prediction-title mt-4" style={{ fontSize: '3.5rem' }}>
                                        {decisionResult.systemDecision.action}
                                    </h3>

                                    <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                                        {decisionResult.systemDecision.reason}
                                    </p>

                                    <div className="status-box status-box-amber">
                                        <ShieldCheck className="status-icon" size={20} />
                                        <span className="status-title">Verified by Agri-ML Engine</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="glass-card flex flex-col items-center justify-center p-10 text-slate-300 h-full" style={{ borderStyle: 'dashed' }}>
                                    <LayoutDashboard size={48} className="mb-4 opacity-20" />
                                    <p className="font-bold text-slate-400">Await Recommendations</p>
                                    <p className="text-sm mt-1">Click analysis to begin</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'market' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="dashboard-grid">
                            <div className="glass-card p-6" style={{ gridColumn: 'span 1' }}>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl">Weekly Price Trends</h3>
                                        <p className="text-sm text-slate-500">Predicted for {decisionResult?.cropName || 'Selected Crop'}</p>
                                    </div>
                                    <TrendingUp className="text-primary" />
                                </div>
                                <div style={{ height: '300px', width: '100%' }}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={marketTrend.length > 0 ? marketTrend : mockPriceData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="price"
                                                stroke="var(--primary)"
                                                strokeWidth={4}
                                                dot={{ r: 6, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }}
                                                activeDot={{ r: 8, strokeWidth: 0 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="glass-card p-10 flex flex-col justify-center" style={{ background: 'linear-gradient(135deg, var(--slate-900) 0%, var(--slate-800) 100%)', color: 'var(--white)' }}>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
                                    <p className="label" style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '0.7rem' }}>Decision Logic</p>
                                    <p style={{ color: 'var(--slate-300)', fontSize: '0.9rem' }}>
                                        {decisionResult ? decisionResult.systemDecision.reason : "Once analysis is complete, our ML insights will appear here to guide your market strategy."}
                                    </p>
                                </div>
                                <h3 style={{ color: 'var(--white)', fontSize: '1.4rem', fontWeight: '400', lineHeight: '1.4' }}>
                                    "Leverage the 7-day forecast to maximize your harvest value."
                                </h3>
                                <div className="flex items-center gap-2 mt-8" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                                    <BadgeCheck size={18} />
                                    Dynamic ML Forecast
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'history' && (
                    <div className="history-container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-10 history-list"
                        >
                            {/* Crops Section */}
                            <div className="flex flex-col gap-4">
                                <h3 className="label" style={{ marginLeft: '0.5rem', letterSpacing: '0.2em' }}>Crop Planning Logs</h3>
                                {history.crops.length > 0 ? (
                                    history.crops.map((rec) => (
                                        <div 
                                            key={rec._id} 
                                            onClick={() => setSelectedHistoryItem({ ...rec, type: 'crop' })}
                                            className={`log-item glass-card clickable-log ${selectedHistoryItem?._id === rec._id ? 'selected' : ''}`}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="log-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                                                    {rec.mlPrediction.crop.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="capitalize" style={{ fontSize: '1.25rem' }}>{rec.expertValidation.status === 'Modified' ? rec.expertValidation.modifiedCrop : rec.mlPrediction.crop}</h4>
                                                    <p className="flex items-center gap-2" style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
                                                        {rec.expertValidation.status === 'Modified' ? <ArrowRightLeft size={14} /> : <User size={14} />}
                                                        {rec.expertValidation.status === 'Approved' || rec.expertValidation.status === 'Modified' ? 'Expert Verified' : 'ML Predicted'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`status-badge badge-${rec.expertValidation.status.toLowerCase()}`}>
                                                    {rec.expertValidation.status}
                                                </span>
                                                <ChevronRight size={18} className="text-slate-300" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="glass-card p-6 text-center text-slate-400" style={{ borderStyle: 'dashed' }}>
                                        No crop planning history found.
                                    </div>
                                )}
                            </div>

                            {/* Quality Section */}
                            <div className="flex flex-col gap-4">
                                <h3 className="label" style={{ marginLeft: '0.5rem', letterSpacing: '0.2em' }}>Quality Grading Logs</h3>
                                {history.quality.length > 0 ? (
                                    history.quality.map((rec) => (
                                        <div 
                                            key={rec._id} 
                                            onClick={() => setSelectedHistoryItem({ ...rec, type: 'quality' })}
                                            className={`log-item glass-card clickable-log ${selectedHistoryItem?._id === rec._id ? 'selected' : ''}`} 
                                            style={{ borderColor: 'var(--emerald-50)' }}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="log-icon" style={{ background: 'var(--emerald-100)', color: 'var(--emerald-600)' }}>
                                                    G
                                                </div>
                                                <div>
                                                    <h4 className="capitalize" style={{ fontSize: '1.25rem' }}>
                                                        Grade {rec.expertValidation.status === 'Modified' ? rec.expertValidation.modifiedGrade : rec.systemGrade.grade}
                                                    </h4>
                                                    <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>Moisture: {rec.harvestData.moisture}% | Damage: {rec.harvestData.damage}%</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`status-badge badge-${rec.expertValidation.status.toLowerCase()}`}>
                                                    {rec.expertValidation.status}
                                                </span>
                                                <ChevronRight size={18} className="text-slate-300" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="glass-card p-6 text-center text-slate-400" style={{ borderStyle: 'dashed' }}>
                                        No quality assessment history found.
                                    </div>
                                )}
                            </div>

                            {/* Decision Section */}
                            <div className="flex flex-col gap-4">
                                <h3 className="label" style={{ marginLeft: '0.5rem', letterSpacing: '0.2em' }}>Post-Harvest Decisions</h3>
                                {history.decisions.length > 0 ? (
                                    history.decisions.map((rec) => (
                                        <div 
                                            key={rec._id} 
                                            onClick={() => setSelectedHistoryItem({ ...rec, type: 'decision' })}
                                            className={`log-item glass-card clickable-log ${selectedHistoryItem?._id === rec._id ? 'selected' : ''}`} 
                                            style={{ borderColor: 'var(--indigo-50)' }}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="log-icon" style={{ background: 'var(--indigo-100)', color: 'var(--indigo-600)' }}>
                                                    D
                                                </div>
                                                <div>
                                                    <h4 className="capitalize" style={{ fontSize: '1.25rem' }}>
                                                        {rec.expertValidation.status === 'Modified' ? rec.expertValidation.modifiedAction : rec.systemDecision.action}
                                                    </h4>
                                                    <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>{rec.cropName} @ ₹{rec.currentPrice}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`status-badge badge-${rec.expertValidation.status.toLowerCase()}`}>
                                                    {rec.expertValidation.status}
                                                </span>
                                                <ChevronRight size={18} className="text-slate-300" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="glass-card p-6 text-center text-slate-400" style={{ borderStyle: 'dashed' }}>
                                        No post-harvest decision history found.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                        
                        <AnimatePresence>
                            {selectedHistoryItem && (
                                <motion.div
                                    initial={{ opacity: 0, x: 300 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 300 }}
                                    className="history-detail-panel glass-card"
                                >
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="section-title">Record Details</h3>
                                        <button onClick={() => setSelectedHistoryItem(null)} className="close-btn">
                                            <XCircle size={24} />
                                        </button>
                                    </div>

                                    <div className="detail-status mb-8">
                                        <div className={`status-badge badge-${selectedHistoryItem?.expertValidation?.status?.toLowerCase()} p-4 w-full flex items-center justify-center gap-2`}>
                                            {selectedHistoryItem?.expertValidation?.status === 'Pending' ? <Clock size={20}/> : <BadgeCheck size={20}/>}
                                            <span style={{ fontSize: '1rem' }}>{selectedHistoryItem?.expertValidation?.status}</span>
                                        </div>
                                    </div>

                                    <div className="detail-sections space-y-8">
                                        <div className="detail-group">
                                            <p className="label">ML Prediction</p>
                                            <div className="prediction-box">
                                                {selectedHistoryItem?.type === 'crop' && selectedHistoryItem?.mlPrediction?.crop}
                                                {selectedHistoryItem?.type === 'quality' && `Grade ${selectedHistoryItem?.systemGrade?.grade}`}
                                                {selectedHistoryItem?.type === 'decision' && selectedHistoryItem?.systemDecision?.action}
                                            </div>
                                        </div>

                                        {selectedHistoryItem?.expertValidation?.status !== 'Pending' && (
                                            <>
                                                <div className="detail-group">
                                                    <p className="label">Expert Decision</p>
                                                    <div className="decision-box highlight">
                                                        {selectedHistoryItem?.expertValidation?.status === 'Modified' ? (
                                                            <div className="flex items-center gap-3">
                                                                <span className="strikethrough text-slate-400">
                                                                    {selectedHistoryItem?.type === 'crop' && selectedHistoryItem?.mlPrediction?.crop}
                                                                    {selectedHistoryItem?.type === 'quality' && selectedHistoryItem?.systemGrade?.grade}
                                                                    {selectedHistoryItem?.type === 'decision' && selectedHistoryItem?.systemDecision?.action}
                                                                </span>
                                                                <ArrowRightLeft size={16} />
                                                                <span className="font-bold text-primary">
                                                                    {selectedHistoryItem?.type === 'crop' && selectedHistoryItem?.expertValidation?.modifiedCrop}
                                                                    {selectedHistoryItem?.type === 'quality' && selectedHistoryItem?.expertValidation?.modifiedGrade}
                                                                    {selectedHistoryItem?.type === 'decision' && selectedHistoryItem?.expertValidation?.modifiedAction}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="font-bold text-emerald-600">Approved as Predicted</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="detail-group">
                                                    <p className="label">Expert Notes</p>
                                                    <div className="notes-box">
                                                        {selectedHistoryItem?.expertValidation?.notes || "No additional notes provided by the expert."}
                                                    </div>
                                                </div>

                                                <div className="detail-group">
                                                    <p className="label">Verified At</p>
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Clock size={16} />
                                                        {selectedHistoryItem?.expertValidation?.verifiedAt ? new Date(selectedHistoryItem.expertValidation.verifiedAt).toLocaleString() : 'N/A'}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div className="detail-group border-t pt-6 mt-6">
                                            <p className="label">Submission Date</p>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar size={16} />
                                                {selectedHistoryItem?.createdAt ? new Date(selectedHistoryItem.createdAt).toLocaleString() : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FarmerDashboard;
