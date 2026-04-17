import ssl
import sys
import asyncio
import certifi

orig_create_default_context = ssl.create_default_context
def create_patched_context(*args, **kwargs):
    # Force use of certifi bundle for all context creations
    if 'cafile' not in kwargs or kwargs['cafile'] is None:
        kwargs['cafile'] = certifi.where()
    return orig_create_default_context(*args, **kwargs)

ssl.create_default_context = create_patched_context

import edge_tts
import edge_tts.util

if __name__ == "__main__":
    if len(sys.argv) > 1:
        sys.exit(asyncio.run(edge_tts.util.amain()))
    else:
        print("Usage error.")
