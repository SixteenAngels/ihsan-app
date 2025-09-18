'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Download,
  Calendar,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Filter,
  Search,
  Eye,
  Clock,
  CheckCircle
} from 'lucide-react'

interface Report {
  id: string
  name: string
  type: 'sales' | 'inventory' | 'customer' | 'financial' | 'marketing'
  status: 'generating' | 'ready' | 'failed'
  createdAt: string
  fileSize?: string
  downloadUrl?: string
  description: string
}

export default function ManagerReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    // Simulate loading reports data
    setTimeout(() => {
      setReports([
        {
          id: '1',
          name: 'Monthly Sales Report',
          type: 'sales',
          status: 'ready',
          createdAt: '2024-01-15T10:30:00Z',
          fileSize: '2.4 MB',
          downloadUrl: '/reports/monthly-sales.pdf',
          description: 'Comprehensive monthly sales analysis with revenue breakdown'
        },
        {
          id: '2',
          name: 'Inventory Status Report',
          type: 'inventory',
          status: 'ready',
          createdAt: '2024-01-14T15:45:00Z',
          fileSize: '1.8 MB',
          downloadUrl: '/reports/inventory-status.pdf',
          description: 'Current inventory levels and stock status across all categories'
        },
        {
          id: '3',
          name: 'Customer Analytics Report',
          type: 'customer',
          status: 'generating',
          createdAt: '2024-01-15T09:15:00Z',
          description: 'Customer behavior analysis and demographic insights'
        },
        {
          id: '4',
          name: 'Financial Summary Q4',
          type: 'financial',
          status: 'ready',
          createdAt: '2024-01-10T14:20:00Z',
          fileSize: '3.2 MB',
          downloadUrl: '/reports/financial-q4.pdf',
          description: 'Quarterly financial performance and profit analysis'
        },
        {
          id: '5',
          name: 'Marketing Campaign Report',
          type: 'marketing',
          status: 'failed',
          createdAt: '2024-01-12T11:30:00Z',
          description: 'Marketing campaign performance and ROI analysis'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = !typeFilter || report.type === typeFilter
    const matchesStatus = !statusFilter || report.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sales': return 'bg-green-100 text-green-800'
      case 'inventory': return 'bg-blue-100 text-blue-800'
      case 'customer': return 'bg-purple-100 text-purple-800'
      case 'financial': return 'bg-orange-100 text-orange-800'
      case 'marketing': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800'
      case 'generating': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sales': return <TrendingUp className="h-4 w-4" />
      case 'inventory': return <Package className="h-4 w-4" />
      case 'customer': return <Users className="h-4 w-4" />
      case 'financial': return <DollarSign className="h-4 w-4" />
      case 'marketing': return <BarChart3 className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="h-4 w-4" />
      case 'generating': return <Clock className="h-4 w-4" />
      case 'failed': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const generateReport = (type: string) => {
    // Simulate report generation
    const newReport: Report = {
      id: Date.now().toString(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      type: type as any,
      status: 'generating',
      createdAt: new Date().toISOString(),
      description: `Automated ${type} report generation`
    }
    
    setReports(prev => [newReport, ...prev])
    
    // Simulate completion after 3 seconds
    setTimeout(() => {
      setReports(prev => prev.map(report => 
        report.id === newReport.id 
          ? { ...report, status: 'ready', fileSize: '1.5 MB', downloadUrl: `/reports/${type}-report.pdf` }
          : report
      ))
    }, 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-slate-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Quick Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => generateReport('sales')}
            >
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Sales Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => generateReport('inventory')}
            >
              <Package className="h-6 w-6 mb-2" />
              <span>Inventory Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => generateReport('customer')}
            >
              <Users className="h-6 w-6 mb-2" />
              <span>Customer Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => generateReport('financial')}
            >
              <DollarSign className="h-6 w-6 mb-2" />
              <span>Financial Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => generateReport('marketing')}
            >
              <BarChart3 className="h-6 w-6 mb-2" />
              <span>Marketing Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search reports..."
              className="pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md focus:border-primary focus:ring-primary"
          aria-label="Filter by type"
          title="Filter by type"
        >
          <option value="">All Types</option>
          <option value="sales">Sales</option>
          <option value="inventory">Inventory</option>
          <option value="customer">Customer</option>
          <option value="financial">Financial</option>
          <option value="marketing">Marketing</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md focus:border-primary focus:ring-primary"
          aria-label="Filter by status"
          title="Filter by status"
        >
          <option value="">All Status</option>
          <option value="ready">Ready</option>
          <option value="generating">Generating</option>
          <option value="failed">Failed</option>
        </select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Report</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-slate-200 rounded-lg mr-4 flex items-center justify-center">
                          {getTypeIcon(report.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{report.name}</div>
                          <div className="text-sm text-slate-500 max-w-xs truncate">{report.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getTypeColor(report.type)}>
                        {report.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(report.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(report.status)}
                          <span>{report.status}</span>
                        </div>
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {report.fileSize || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {report.status === 'ready' && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No reports found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm || typeFilter || statusFilter ? 'Try adjusting your search terms or filters.' : 'No reports have been generated yet.'}
            </p>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Report Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Reports</p>
                <p className="text-2xl font-bold text-slate-900">{reports.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Ready Reports</p>
                <p className="text-2xl font-bold text-slate-900">
                  {reports.filter(r => r.status === 'ready').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Generating</p>
                <p className="text-2xl font-bold text-slate-900">
                  {reports.filter(r => r.status === 'generating').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Failed Reports</p>
                <p className="text-2xl font-bold text-slate-900">
                  {reports.filter(r => r.status === 'failed').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
