import base64

with open('marketing_assets/bg_no_text.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800" height="800" viewBox="0 0 800 800">
    <image xlink:href="data:image/png;base64,{b64}" href="data:image/png;base64,{b64}" width="800" height="800" />
    <text x="400" y="110" font-family="'MinervaModern', 'Playfair Display', 'Times New Roman', serif" font-size="44" font-weight="normal" fill="#5a6361" text-anchor="middle" letter-spacing="-0.5">Master Your Executive Presence</text>
    <text x="400" y="170" font-family="'MinervaModern', 'Playfair Display', 'Times New Roman', serif" font-size="28" font-weight="normal" fill="#5a6361" text-anchor="middle" letter-spacing="0">Observation over intuition.</text>
    <text x="400" y="740" font-family="'MinervaModern', 'Playfair Display', 'Times New Roman', serif" font-size="44" font-weight="bold" fill="#064e3b" text-anchor="middle" letter-spacing="-0.5">Executive Comms Ninja</text>
</svg>'''

with open('marketing_assets/Master_Your_Executive_Presence.svg', 'w') as f:
    f.write(svg)
