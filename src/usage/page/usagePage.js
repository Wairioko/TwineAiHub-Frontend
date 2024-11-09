import React, { useState, useMemo } from 'react';
import useUsage from '../hooks/usageHooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, startOfMonth, endOfMonth } from 'date-fns';


const UsagePage = () => {
    const { usageData } = useUsage();
    const [viewMode, setViewMode] = useState('tokens');
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedModel, setSelectedModel] = useState('all');
  
    const availableDates = useMemo(() => {
      if (!usageData || !usageData.daily) return [];
      return Object.keys(usageData.daily).sort();
    }, [usageData]);
  
    const modelNames = useMemo(() => {
      if (!usageData || !usageData.daily) return ['all'];
      return ['all', ...Object.keys(usageData.daily['2024-10-09'])];
    }, [usageData]);
  
    const filteredUsageData = useMemo(() => {
      if (!usageData || !usageData.daily) return {};
  
      if (!selectedMonth) return usageData.daily; // If no month selected, return all data
  
      const startDate = startOfMonth(selectedMonth);
      const endDate = endOfMonth(selectedMonth);
  
      return Object.keys(usageData.daily)
        .filter(date => {
          const currentDate = new Date(date);
          return currentDate >= startDate && currentDate < endDate;
        })
        .reduce((acc, date) => {
          acc[date] = selectedModel === 'all' ? usageData.daily[date] : { [selectedModel]: usageData.daily[date][selectedModel] };
          return acc;
        }, {});
    }, [selectedMonth, usageData, selectedModel]);
  
    const prepareChartData = useMemo(() => {
      if (!usageData || !usageData.daily) return [];
  
      return Object.keys(filteredUsageData).map(date => {
        const dayData = filteredUsageData[date] || {};
        const dateLabel = format(new Date(date), 'MMM d');
  
        let inputTokens = 0;
        let outputTokens = 0;
        let inputCost = 0;
        let outputCost = 0;
  
        Object.values(dayData).forEach(modelData => {
          inputTokens += modelData?.inputTokens || 0;
          outputTokens += modelData?.outputTokens || 0;
          inputCost += modelData?.inputTokenCost || 0;
          outputCost += modelData?.outputTokenCost || 0;
        });
  
        return {
          name: dateLabel,
          inputTokens,
          outputTokens,
          inputCost,
          outputCost
        };
      });
    }, [filteredUsageData, viewMode]);
  
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="custom-tooltip">
            <p className="tooltip-date">{label}</p>
            <div className="tooltip-content">
              {payload.map((entry, index) => (
                <p key={index} style={{ color: entry.color }}>
                  {entry.dataKey.includes('_') ? entry.dataKey.split('_')[1] : entry.dataKey}: {entry.value.toLocaleString()}
                  {viewMode === 'tokens' ? ' tokens' : ' $'}
                </p>
              ))}
            </div>
          </div>
        );
      }
      return null;
    };
  
    if (!usageData || !usageData.totals || !usageData.daily) {
      return <div className="loading">Loading...</div>;
    }
  
    return (
      <div className="usage-page">
        <div className="usage-card">
          <div className="card-header">
            <h2 className="total-cost">
              Total Cost: ${usageData.totalCost || 0}
              {usageData.extraCost ? ` (+$${usageData.extraCost})` : ""}
            </h2>
            <div className="view-controls">
              <div className="toggle-buttons">
                <button className={`toggle-btn ${viewMode === 'tokens' ? 'active' : ''}`} onClick={() => setViewMode('tokens')}>
                  Tokens
                </button>
                <button className={`toggle-btn ${viewMode === 'cost' ? 'active' : ''}`} onClick={() => setViewMode('cost')}>
                  Cost
                </button>
              </div>
            </div>
          </div>
  
          <div className="month-selector">
            <DatePicker
              selected={selectedMonth}
              onChange={(date) => setSelectedMonth(date)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              placeholderText="Select a month"
            />
          </div>
  
          <div className="model-selector">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="model-select"
            >
              {modelNames.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
  
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={prepareChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} interval={0} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {viewMode === 'tokens' ? (
                  <>
                    <Bar dataKey="inputTokens" fill="#8884d8" barSize={20}></Bar>
                    <Bar dataKey="outputTokens" fill="#82ca9d" barSize={20}></Bar>
                  </>
                ) : (
                  <>
                    <Bar dataKey="inputCost" fill="#8884d8" barSize={20}></Bar>
                    <Bar dataKey="outputCost" fill="#82ca9d" barSize={20}></Bar>
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