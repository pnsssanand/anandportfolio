import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  Eye, 
  MessageSquare, 
  FolderOpen, 
  Download,
  TrendingUp,
  Calendar,
  Activity,
  BarChart3
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const { analytics, loading } = useAnalytics();
  const [selectedMetric, setSelectedMetric] = useState('pageViews');
  const [previousAnalytics, setPreviousAnalytics] = useState<typeof analytics | null>(null);

  // Calculate growth percentages dynamically
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return '+100%';
    const growth = ((current - previous) / previous) * 100;
    return growth >= 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
  };

  // Get yesterday's data for comparison
  const getYesterdayViews = () => {
    const yesterdayIndex = analytics.dailyViews.length - 2;
    return yesterdayIndex >= 0 ? analytics.dailyViews[yesterdayIndex].views : 0;
  };

  const getTodayViews = () => {
    const todayIndex = analytics.dailyViews.length - 1;
    return todayIndex >= 0 ? analytics.dailyViews[todayIndex].views : 0;
  };

  const stats = [
    { 
      id: 'pageViews',
      icon: <Eye className="w-8 h-8" />, 
      value: loading ? '...' : analytics.pageViews.toLocaleString(), 
      label: "Page Views",
      trend: loading ? '+0%' : calculateGrowth(getTodayViews(), getYesterdayViews()),
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    { 
      id: 'messages',
      icon: <MessageSquare className="w-8 h-8" />, 
      value: loading ? '...' : analytics.messages.toLocaleString(), 
      label: "Messages",
      trend: loading ? '+0%' : calculateGrowth(analytics.messages, Math.max(1, analytics.messages - 5)),
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
    { 
      id: 'projects',
      icon: <FolderOpen className="w-8 h-8" />, 
      value: loading ? '...' : analytics.projects.toString(), 
      label: "Projects",
      trend: analytics.projects > 0 ? `+${analytics.projects}` : '0',
      color: "text-gold",
      bgColor: "bg-gold/10",
      borderColor: "border-gold/20"
    },
    { 
      id: 'downloads',
      icon: <Download className="w-8 h-8" />, 
      value: loading ? '...' : analytics.downloads.toLocaleString(), 
      label: "Downloads",
      trend: loading ? '+0%' : calculateGrowth(analytics.downloads, Math.max(1, analytics.downloads - 10)),
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass-effect border-gold/20 bg-transparent">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-700 rounded mb-4"></div>
                  <div className="h-12 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gold mb-2 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3" />
            Analytics Dashboard
            {!loading && (
              <div className="ml-4 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="ml-2 text-sm text-green-400 font-medium">Live</span>
              </div>
            )}
          </h2>
          <p className="text-gray-400">
            Real-time insights and performance metrics
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-400">Last updated</p>
          </div>
          <p className="text-white font-medium">
            {loading ? 'Loading...' : analytics.lastUpdated.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`glass-effect ${stat.borderColor} bg-transparent cursor-pointer transition-all duration-300 ${
                selectedMetric === stat.id ? 'ring-2 ring-gold/50' : ''
              }`}
              onClick={() => setSelectedMetric(stat.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`${stat.color} mb-3 flex justify-center`}>
                  {stat.icon}
                </div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <motion.p 
                    className="text-3xl font-bold text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                  >
                    {stat.value}
                  </motion.p>
                  <span className="text-sm text-green-400 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.trend}
                  </span>
                </div>
                <p className="text-gray-400 font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Detailed Analytics */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Daily Views Chart */}
        <motion.div variants={itemVariants}>
          <Card className="glass-effect border-gold/20 bg-transparent">
            <CardHeader>
              <CardTitle className="text-gold flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Daily Page Views (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.dailyViews.slice(-7).map((day, index) => {
                  const maxViews = Math.max(...analytics.dailyViews.map(d => d.views));
                  const percentage = (day.views / maxViews) * 100;
                  
                  return (
                    <div key={day.date} className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <div className="flex items-center gap-3 flex-1 mx-4">
                        <div className="flex-1 bg-gray-700 rounded-full h-2 relative overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: index * 0.1, duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <span className="text-white text-sm font-medium w-8 text-right">
                          {day.views}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Summary stats */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-400">Peak Day</p>
                    <p className="text-lg font-bold text-blue-400">
                      {Math.max(...analytics.dailyViews.map(d => d.views))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">7-Day Avg</p>
                    <p className="text-lg font-bold text-blue-400">
                      {Math.round(analytics.dailyViews.slice(-7).reduce((sum, day) => sum + day.views, 0) / 7)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Pages */}
        <motion.div variants={itemVariants}>
          <Card className="glass-effect border-gold/20 bg-transparent">
            <CardHeader>
              <CardTitle className="text-gold flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Top Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topPages.map((page, index) => {
                  const totalViews = analytics.topPages.reduce((sum, p) => sum + p.views, 0);
                  const percentage = (page.views / totalViews * 100).toFixed(1);
                  
                  return (
                    <motion.div 
                      key={page.path} 
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-gold text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {page.path === '/' ? 'Home' : 
                             page.path === '/about' ? 'About' :
                             page.path === '/projects' ? 'Projects' :
                             page.path === '/contact' ? 'Contact' :
                             page.path.charAt(1).toUpperCase() + page.path.slice(2)}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-400 text-sm">{page.path}</p>
                            <span className="text-xs text-gray-500">({percentage}%)</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{page.views.toLocaleString()}</p>
                        <p className="text-gray-400 text-sm">views</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Total views summary */}
              <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                <p className="text-sm text-gray-400 mb-1">Total Page Views</p>
                <p className="text-2xl font-bold text-gold">
                  {analytics.topPages.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats Summary */}
      <motion.div variants={itemVariants}>
        <Card className="glass-effect border-gold/20 bg-transparent">
          <CardHeader>
            <CardTitle className="text-gold flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <motion.div 
                className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-blue-400 text-sm font-medium mb-1">Average Daily Views</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(analytics.dailyViews.reduce((sum, day) => sum + day.views, 0) / analytics.dailyViews.length)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
              </motion.div>
              
              <motion.div 
                className="bg-green-500/10 border border-green-500/20 rounded-lg p-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-green-400 text-sm font-medium mb-1">Engagement Rate</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.pageViews > 0 ? ((analytics.messages / analytics.pageViews) * 100).toFixed(1) : '0.0'}%
                </p>
                <p className="text-xs text-gray-400 mt-1">Messages/Views</p>
              </motion.div>
              
              <motion.div 
                className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-purple-400 text-sm font-medium mb-1">Download Rate</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.pageViews > 0 ? ((analytics.downloads / analytics.pageViews) * 100).toFixed(1) : '0.0'}%
                </p>
                <p className="text-xs text-gray-400 mt-1">Downloads/Views</p>
              </motion.div>
              
              <motion.div 
                className="bg-gold/10 border border-gold/20 rounded-lg p-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-gold text-sm font-medium mb-1">Portfolio Score</p>
                <p className="text-2xl font-bold text-white">
                  {Math.min(100, Math.round((analytics.projects * 20) + (analytics.messages * 2) + (analytics.downloads / 10)))}
                </p>
                <p className="text-xs text-gray-400 mt-1">Overall rating</p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
