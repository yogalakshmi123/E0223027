import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, ShieldAlert } from 'lucide-react';

export default function NotificationList() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                // Fetch data directly from your working local Express backend endpoint proxy
                const res = await fetch('http://localhost:5000/api/notifications');
                const data = await res.json();
                
                if (data && data.notifications) {
                    setNotifications(data.notifications);
                } else if (Array.isArray(data)) {
                    setNotifications(data);
                }
            } catch (err) {
                console.error("Frontend view fetch exception:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Placement': return <ShieldAlert className="text-purple-500 w-5 h-5" />;
            case 'Result': return <CheckCircle className="text-green-500 w-5 h-5" />;
            case 'Event': return <Info className="text-blue-500 w-5 h-5" />;
            default: return <Bell className="text-gray-500 w-5 h-5" />;
        }
    };

    const filteredList = notifications.filter(item => 
        filter === 'All' ? true : item.type === filter
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64 text-gray-500 font-medium">
                Loading campus notification pipeline...
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md border border-gray-100 font-sans">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Bell className="text-blue-600 w-6 h-6 animate-pulse" /> 
                    Campus Notification Dashboard
                </h2>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Active Feed Rows: {filteredList.length}
                </span>
            </div>

            {/* Quick Filter Pill Controls */}
            <div className="flex gap-2 mb-6">
                {['All', 'Placement', 'Result', 'Event'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            filter === cat 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Vertical Flow Items */}
            <div className="space-y-4">
                {filteredList.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                        No alerts matching this category filter.
                    </div>
                ) : (
                    filteredList.map((item) => (
                        <div 
                            key={item.id} 
                            className={`flex gap-4 p-4 border rounded-xl transition-all duration-200 ${
                                item.isRead ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-blue-100 shadow-sm hover:border-blue-300'
                            }`}
                        >
                            <div className="mt-1">{getTypeIcon(item.type)}</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start gap-4">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                        item.type === 'Placement' ? 'bg-purple-100 text-purple-800' :
                                        item.type === 'Result' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {item.type}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-gray-700 font-medium text-sm mt-2">{item.message}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
