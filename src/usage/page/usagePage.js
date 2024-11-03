import React, { useState, useMemo } from 'react';
import useUsage from '../hooks/usageHooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const UsagePage = () => {
    const { usageData } = useUsage();
    const [viewMode, setViewMode] = useState('tokens'); // 'tokens' or 'cost'
    const [timeView, setTimeView] = useState('total'); // 'total' or 'daily'
    const [selectedModel, setSelectedModel] = useState('all'); // 'all' or specific model

    // Get unique model names from both total and daily data
    const modelNames = useMemo(() => {
        if (!usageData || !usageData.totals || !usageData.daily) return [];
        
        const totalModels = new Set(Object.keys(usageData.totals));
        Object.values(usageData.daily).forEach(dayData => {
            Object.keys(dayData).forEach(model => totalModels.add(model));
        });
        return Array.from(totalModels);
    }, [usageData]);

    // Get all available dates
    const availableDates = useMemo(() => {
        if (!usageData || !usageData.daily) return [];
        return Object.keys(usageData.daily).sort(); 
    }, [usageData]);

    // Prepare the data for visualization
    const prepareChartData = useMemo(() => {
        if (!usageData) return [];
        
        if (timeView === 'total') {
            // For total view, return data grouped by model
            return modelNames.map(modelName => {
                const modelData = usageData.totals[modelName] || {
                    inputTokens: 0,
                    outputTokens: 0,
                    inputTokenCost: 0,
                    outputTokenCost: 0
                };
                
                return {
                    name: modelName,
                    input: viewMode === 'tokens' ? modelData.inputTokens : modelData.inputTokenCost,
                    output: viewMode === 'tokens' ? modelData.outputTokens : modelData.outputTokenCost
                };
            });
        } else {
            // For daily view
            if (selectedModel === 'all') {
                // Show stacked data for all models per day
                return availableDates.map(date => {
                    const dailyData = usageData.daily[date] || {};
                    const dataPoint = {
                        name: date,
                    };

                    // Add data for each model
                    modelNames.forEach(modelName => {
                        const modelData = dailyData[modelName] || {
                            inputTokens: 0,
                            outputTokens: 0,
                            inputTokenCost: 0,
                            outputTokenCost: 0
                        };

                        dataPoint[`input_${modelName}`] = viewMode === 'tokens' 
                            ? modelData.inputTokens 
                            : modelData.inputTokenCost;
                        dataPoint[`output_${modelName}`] = viewMode === 'tokens' 
                            ? modelData.outputTokens 
                            : modelData.outputTokenCost;
                    });

                    return dataPoint;
                });
            } else {
                // Show data for selected model only
                return availableDates.map(date => {
                    const dailyData = usageData.daily[date] || {};
                    const modelData = dailyData[selectedModel] || {
                        inputTokens: 0,
                        outputTokens: 0,
                        inputTokenCost: 0,
                        outputTokenCost: 0
                    };

                    return {
                        name: date,
                        input: viewMode === 'tokens' ? modelData.inputTokens : modelData.inputTokenCost,
                        output: viewMode === 'tokens' ? modelData.outputTokens : modelData.outputTokenCost
                    };
                });
            }
        }
    }, [usageData, timeView, viewMode, selectedModel, modelNames, availableDates]);

    // Calculate totals based on current view and selection
    const calculateTotals = useMemo(() => {
        const totals = {
            totalInputTokens: 0,
            totalOutputTokens: 0,
            totalInputCost: 0,
            totalOutputCost: 0
        };

        if (usageData) {
            if (timeView === 'total' || selectedModel === 'all') {
                modelNames.forEach(modelName => {
                    const modelTotal = usageData.totals[modelName] || {
                        inputTokens: 0,
                        outputTokens: 0,
                        inputTokenCost: 0,
                        outputTokenCost: 0
                    };
                    totals.totalInputTokens += modelTotal.inputTokens;
                    totals.totalOutputTokens += modelTotal.outputTokens;
                    totals.totalInputCost += modelTotal.inputTokenCost;
                    totals.totalOutputCost += modelTotal.outputTokenCost;
                });
            } else {
                availableDates.forEach(date => {
                    const dailyData = usageData.daily[date] || {};
                    const modelData = dailyData[selectedModel] || {
                        inputTokens: 0,
                        outputTokens: 0,
                        inputTokenCost: 0,
                        outputTokenCost: 0
                    };
                    totals.totalInputTokens += modelData.inputTokens;
                    totals.totalOutputTokens += modelData.outputTokens;
                    totals.totalInputCost += modelData.inputTokenCost;
                    totals.totalOutputCost += modelData.outputTokenCost;
                });
            }
        }

        return totals;
    }, [usageData, timeView, selectedModel, modelNames, availableDates]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-date">{label}</p>
                    <div className="tooltip-content">
                        {payload.map((entry, index) => {
                            const modelName = entry.dataKey.includes('_') 
                                ? entry.dataKey.split('_')[1] 
                                : entry.dataKey;
                            return (
                                <p key={index} style={{ color: entry.color }}>
                                    {modelName}: {entry.value.toLocaleString()}
                                    {viewMode === 'tokens' ? ' tokens' : ' $'}
                                </p>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return null;
    };

    // Conditional rendering for loading state
    if (!usageData || !usageData.totals || !usageData.daily) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="usage-page">
            <div className="usage-card">
                <div className="card-header">
                <h2 className="total-cost">
                    Total Cost: ${usageData.totalCost}
                </h2>

                    <div className="view-controls">
                        <div className="toggle-buttons">
                            <button 
                                className={`toggle-btn ${timeView === 'total' ? 'active' : ''}`}
                                onClick={() => setTimeView('total')}
                            >
                                Total Usage
                            </button>
                            <button 
                                className={`toggle-btn ${timeView === 'daily' ? 'active' : ''}`}
                                onClick={() => setTimeView('daily')}
                            >
                                Daily Usage
                            </button>
                        </div>
                        
                        <div className="toggle-buttons">
                            <button 
                                className={`toggle-btn ${viewMode === 'tokens' ? 'active' : ''}`}
                                onClick={() => setViewMode('tokens')}
                            >
                                Tokens
                            </button>
                            <button 
                                className={`toggle-btn ${viewMode === 'cost' ? 'active' : ''}`}
                                onClick={() => setViewMode('cost')}
                            >
                                Cost
                            </button>
                        </div>
                    </div>
                </div>

                {timeView === 'daily' && (
                    <div className="model-selector">
                        <select 
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="model-select"
                        >
                            <option value="all">All Models</option>
                            {modelNames.map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart 
                            data={prepareChartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={70}
                                interval={0}
                            />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            {timeView === 'daily' && selectedModel === 'all' 
                                ? modelNames.map((modelName) => (
                                    <Bar key={modelName} dataKey={`input_${modelName}`} stackId="a" fill="#8884d8">
                                        <LabelList dataKey={`input_${modelName}`} position="top" />
                                    </Bar>
                                ))
                                : (
                                    <>
                                        <Bar dataKey="input" fill="#8884d8">
                                            <LabelList dataKey="input" position="top" />
                                        </Bar>
                                        <Bar dataKey="output" fill="#82ca9d">
                                            <LabelList dataKey="output" position="top" />
                                        </Bar>
                                    </>
                                )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default UsagePage;
