"use client"

import CMSLive from './cms-live'

export default function CMSLiveWrapper({ resource, initial }: { resource: 'blog' | 'advice', initial: any[] }) {
  return <CMSLive resource={resource} initial={initial} />
}
