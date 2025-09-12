import React from 'react'

interface Props {
  orderId: string
  amountRands: number
  description?: string
  apiBaseUrl?: string // optional override for dev
}

// Build and submit a form to the PayGate endpoint in a new window
export default function PayGateButton({ orderId, amountRands, description, apiBaseUrl }: Props) {
  const handleClick = async () => {
    try {
      // Determine API base at runtime; prefer explicit prop, then NEXT_PUBLIC_API_URL, then localhost:4000 for dev
      let base = apiBaseUrl || (process.env.NEXT_PUBLIC_API_URL ?? '')
      if (!base && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        base = `http://${window.location.hostname}:4000`
      }
      const endpointUrl = base ? `${base.replace(/\/$/, '')}/paygate/create` : '/paygate/create'

      // Open a blank window early to preserve the user gesture and avoid popup blockers.
      let payWindow = null
      try {
        payWindow = window.open('', 'paygate_window')
        if (!payWindow) {
          alert('Popup blocked: please allow popups for this site to complete payment')
        }
      } catch (e) {
        console.warn('Failed to open pay window early', e)
      }

      const res = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amountRands, description })
      })

      // Some hosts (Next dev) may return HTML error pages. Read as text and parse JSON safely.
      const text = await res.text()
      let json: any = null
      try {
        json = JSON.parse(text)
      } catch (e) {
        console.error('Non-JSON response from PayGate create:', text)
        alert('Unexpected response from payment server. Check backend URL and server logs.')
        return
      }

      if (!json || !json.success) {
        alert('Failed to create PayGate form: ' + (json?.message || 'Unknown'))
        return
      }

      const endpoint = json.endpoint || 'https://secure.paygate.co.za/paypage'
      const fields = json.fields || {}
      const signature = json.signature || ''

      // Build and submit the form with returned fields and signature
      const form = document.createElement('form')
  form.method = 'POST'
  form.action = endpoint
  form.target = payWindow ? (payWindow.name || 'paygate_window') : '_blank'

      const addField = (name: string, value: any) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = name
        input.value = String(value ?? '')
        form.appendChild(input)
      }

      Object.entries(fields).forEach(([k, v]) => addField(k, v))
      // Match server's returned signature key
      if (signature) addField('SIGNATURE', signature)
      addField('SIGNATURE_METHOD', json.signature_method || 'HMAC-SHA256')

      document.body.appendChild(form)
      form.submit()
      form.remove()
    } catch (err) {
      console.error('Error creating PayGate form:', err)
      alert('Failed to initiate payment. See console for details.')
    }
  }

  return (
    <button onClick={handleClick} className="w-full bg-blue-600 text-white py-2 rounded">
      Pay with Card (PayGate)
    </button>
  )
}
