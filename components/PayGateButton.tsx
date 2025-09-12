import React from 'react'

interface Props {
  orderId: string
  amountRands: number
  description?: string
}

// Build and submit a form to the PayGate endpoint in a new window
export default function PayGateButton({ orderId, amountRands, description }: Props) {
  const handleClick = async () => {
    try {
      const res = await fetch('/paygate/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amountRands, description })
      })

      const json = await res.json()
      if (!json.success) {
        alert('Failed to create PayGate form: ' + (json.message || 'Unknown'))
        return
      }

      const endpoint = json.endpoint || 'https://secure.paygate.co.za/paypage'
      const fields = json.fields || {}
      const signature = json.signature

      // Build and submit the form with returned fields and signature
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = endpoint
      form.target = '_blank'

      const addField = (name: string, value: string) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = name
        input.value = String(value)
        form.appendChild(input)
      }

      Object.keys(fields).forEach(k => addField(k, fields[k]))
      if (signature) addField('signature', signature)
      addField('signature_method', json.signature_method || 'HMAC-SHA256')

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
