import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const formatDate = (date: string | null | undefined): string => {
  if (!date) return '—'
  return dayjs(date).format('MMM D, YYYY')
}

export const formatRelative = (date: string): string => {
  return dayjs(date).fromNow()
}

export const isOverdue = (date: string | null | undefined): boolean => {
  if (!date) return false
  return dayjs(date).isBefore(dayjs(), 'day')
}
