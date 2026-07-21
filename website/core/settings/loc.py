"""Local settings and globals."""
import sys
from os.path import normpath, join
from .base import *

# Import secrets (no project-specific secrets)
#sys.path.append(
#    abspath(join(PROJECT_ROOT, '../secrets/storymapjs/stg'))
#)
#try:
#    from secrets import *
#except ImportError, e:
#    print 'WARNING: Could not import project secrets (%s).  You will not be able to deploy.' % (e)

# Set static URL
STATIC_URL = '/static'