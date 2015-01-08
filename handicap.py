
from google.appengine.ext import ndb

#
# One row per player, regardless of how many seasons they play
#

class Handicap(ndb.Model):
    """Models a Handicap."""
    ranks = ndb.StringProperty()
    races = ndb.BlobProperty()
