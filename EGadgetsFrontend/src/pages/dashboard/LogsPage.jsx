import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaTrash, FaDownload, FaSync, FaSearch, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import getBaseUrl from '../../utils/baseURL';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [errorLogs, setErrorLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLogs: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');

  const token = localStorage.getItem('token');

  const fetchLogs = async (page = 1, type = 'activity') => {
    try {
      setLoading(true);
      const endpoint = type === 'activity' ? '/api/admin/logs' : '/api/admin/error-logs';
      const response = await axios.get(`${getBaseUrl()}${endpoint}?page=${page}&limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (type === 'activity') {
        setLogs(response.data.logs);
        setPagination(response.data.pagination);
      } else {
        setErrorLogs(response.data.logs);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1, activeTab);
  }, [activeTab]);

  const clearLogs = async () => {
    try {
      await axios.delete(`${getBaseUrl()}/api/admin/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Logs cleared successfully');
      fetchLogs(1, activeTab);
    } catch (error) {
      console.error('Error clearing logs:', error);
      toast.error('Failed to clear logs');
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getMethodColor = (method) => {
    const colors = {
      'GET': 'bg-blue-100 text-blue-800',
      'POST': 'bg-green-100 text-green-800',
      'PUT': 'bg-yellow-100 text-yellow-800',
      'DELETE': 'bg-red-100 text-red-800',
      'PATCH': 'bg-purple-100 text-purple-800'
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };

  const getLevelColor = (level) => {
    const colors = {
      'error': 'bg-red-100 text-red-800',
      'warn': 'bg-yellow-100 text-yellow-800',
      'info': 'bg-blue-100 text-blue-800',
      'debug': 'bg-gray-100 text-gray-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const filteredLogs = (activeTab === 'activity' ? logs : errorLogs).filter(log => {
    const matchesSearch = searchTerm === '' || 
      (log.userId && log.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.url && log.url.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.message && log.message.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMethod = filterMethod === 'all' || log.method === filterMethod;
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;

    return matchesSearch && matchesMethod && matchesLevel;
  });

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTab}-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
              <p className="text-gray-600">Monitor user activity and system events</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => fetchLogs(1, activeTab)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaSync className="mr-2" />
                Refresh
              </button>
              <button
                onClick={exportLogs}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaDownload className="mr-2" />
                Export
              </button>
              <button
                onClick={clearLogs}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaTrash className="mr-2" />
                Clear Logs
              </button>
              {/* Login Requests Quick Filter */}
              <button
                onClick={() => {
                  setSearchTerm('login');
                  setFilterMethod('POST');
                }}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-2"
              >
                <FaFilter className="mr-2" />
                Login Requests
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Activity Logs
            </button>
            <button
              onClick={() => setActiveTab('errors')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'errors'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Error Logs
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {activeTab === 'activity' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HTTP Method
                </label>
                <select
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Methods</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Log Level
              </label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="error">Error</option>
                <option value="warn">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                Showing {filteredLogs.length} of {pagination.totalLogs} logs
              </div>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center">
              <FaEye className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No logs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterMethod !== 'all' || filterLevel !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'No logs available at the moment'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    {activeTab === 'activity' ? (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          URL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IP Address
                        </th>
                      </>
                    ) : (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      {activeTab === 'activity' ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.userId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(log.method)}`}>
                              {log.method}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                            {log.url}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.ip}
                          </td>
                        </>
                      ) : (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(log.level)}`}>
                            {log.level}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs">
                          {activeTab === 'activity' ? (
                            <div>
                              <p className="font-medium">{log.action}</p>
                              {log.details && Object.keys(log.details).length > 0 && (
                                <details className="mt-1">
                                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                                    View Details
                                  </summary>
                                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                                    {JSON.stringify(log.details, null, 2)}
                                  </pre>
                                </details>
                              )}
                            </div>
                          ) : (
                            <div>
                              <p className="font-medium">{log.message}</p>
                              {log.stack && (
                                <details className="mt-1">
                                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                                    View Stack Trace
                                  </summary>
                                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                                    {log.stack}
                                  </pre>
                                </details>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages} 
                ({pagination.totalLogs} total logs)
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchLogs(pagination.currentPage - 1, activeTab)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchLogs(pagination.currentPage + 1, activeTab)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LogsPage; 