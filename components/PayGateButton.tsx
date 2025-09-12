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
      const base = apiBaseUrl || (process.env.NEXT_PUBLIC_API_URL ?? '')
      const endpointUrl = base ? `${base.replace(/\/$/, '')}/paygate/create` : '/paygate/create'
      const res = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amountRands, description })
      })

      const json = await res.json()
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
      form.target = '_blank'

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
