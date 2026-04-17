import ssl
ssl._create_default_https_context = ssl._create_unverified_context

import sys
from demucs.separate import main

if __name__ == "__main__":
    sys.exit(main())
