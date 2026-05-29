// src/hooks/useReports.js
import { useState, useCallback } from 'react'
import { reportsService } from '../services/api'

export function useReports() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createReport = useCallback(async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await reportsService.create(formData)
      // ✅ res.data = { success: true, message: "...", data: { ... } }
      return res.data  // Return the full response object
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getMyReports = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const res = await reportsService.getMyReports(params)
      // ✅ res.data = { success: true, data: { data: [...], current_page: 1, ... } }
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reports')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const trackReport = useCallback(async (token) => {
    setLoading(true)
    setError(null)
    try {
      const res = await reportsService.track(token)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || 'Report not found')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { createReport, getMyReports, trackReport, loading, error }
}