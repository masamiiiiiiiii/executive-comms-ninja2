import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TimelineEvent {
  time: string;
  event: string;
  analysis: string;
  type: string;
  score: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { timelineEvents } = await req.json()
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required')
    }

    const generatedImages = await Promise.all(
      timelineEvents.map(async (event: TimelineEvent) => {
        // Create prompt based on event analysis
        const prompt = generateVisualPrompt(event)
        
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-image-1',
            prompt: prompt,
            n: 1,
            size: '512x512',
            output_format: 'png',
            quality: 'medium',
            style: 'natural'
          }),
        })

        const imageData = await response.json()
        
        if (!response.ok) {
          console.error('OpenAI API error:', imageData)
          return {
            time: event.time,
            imageUrl: generateFallbackSVG(event),
            prompt: prompt
          }
        }

        return {
          time: event.time,
          imageUrl: imageData.data[0].b64_json ? 
            `data:image/png;base64,${imageData.data[0].b64_json}` : 
            imageData.data[0].url,
          prompt: prompt
        }
      })
    )

    return new Response(
      JSON.stringify({ images: generatedImages }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function generateVisualPrompt(event: TimelineEvent): string {
  const baseStyle = "Minimalist business icon, clean human silhouette, modern line design, professional simplicity, vector style illustration, monochrome"
  
  switch (event.type) {
    case 'positive':
      return `${baseStyle}, confident posture silhouette, upright stance, positive body language, successful gesture, ${event.event.toLowerCase()}`
    case 'neutral':
      return `${baseStyle}, balanced professional silhouette, neutral stance, composed posture, business formal outline, ${event.event.toLowerCase()}`
    default:
      return `${baseStyle}, thoughtful silhouette, learning posture, development-focused stance, growth-oriented gesture, ${event.event.toLowerCase()}`
  }
}

function generateFallbackSVG(event: TimelineEvent): string {
  const color = event.type === 'positive' ? '#10B981' : event.type === 'neutral' ? '#6B7280' : '#F59E0B'
  
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#F9FAFB"/>
      <circle cx="256" cy="200" r="80" fill="none" stroke="${color}" stroke-width="3"/>
      <rect x="176" y="280" width="160" height="120" rx="8" fill="none" stroke="${color}" stroke-width="3"/>
      <line x1="256" y1="180" x2="256" y2="160" stroke="${color}" stroke-width="3"/>
      <text x="256" y="440" text-anchor="middle" font-family="Arial" font-size="14" fill="#374151">
        ${event.event}
      </text>
      <text x="256" y="460" text-anchor="middle" font-family="Arial" font-size="12" fill="#6B7280">
        ${event.time}
      </text>
    </svg>
  `
  
  return `data:image/svg+xml;base64,${btoa(svg)}`
}