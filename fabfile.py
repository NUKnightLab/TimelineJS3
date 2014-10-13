from os.path import abspath, basename, dirname, join
import sys
from fabric.api import env

#
# Project-specific settings, alter as needed
#
env.project_name = basename(dirname(__file__))
env.django = False

#
# Add paths
#
def add_paths(*args):
    """Make paths are in sys.path."""
    for p in args:
        if p not in sys.path:
            sys.path.append(p)

project_path = dirname(abspath(__file__))
repos_path = dirname(project_path)

add_paths(project_path, repos_path)

#
# Import from fablib
#
from fablib import *
